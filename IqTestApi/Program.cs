using IqTestApi.Services;
using IqTestApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Add Entity Framework
var connectionStringName = builder.Environment.IsProduction() ? "ProductionConnection" : "DefaultConnection";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString(connectionStringName)));

// Register services
builder.Services.AddScoped<IIqTestService, IqTestService>();
builder.Services.AddScoped<AuthService>();

// Add JWT Authentication
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"] ?? "your-super-secret-key-for-jwt-tokens-must-be-at-least-32-characters-long";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "IqTestApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "IqTestApp";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(
                "https://msamual.ru",
                "https://www.msamual.ru",
                "http://localhost:4200", 
                "https://localhost:4200"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Don't use HTTPS redirection in production (handled by reverse proxy)

app.UseCors("AllowAngular");

// Serve static files (images) - must come before routing
app.UseStaticFiles();

// Serve static files from wwwroot with specific path mapping
var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
Console.WriteLine($"Serving static files from: {wwwrootPath}");
Console.WriteLine($"Directory exists: {Directory.Exists(wwwrootPath)}");

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(wwwrootPath),
    RequestPath = "/images"
});

app.UseRouting();

// Add authentication middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Применяем миграции и заполняем данные при запуске
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Ensuring database schema is up to date...");
        
        // Проверяем, существует ли таблица Users
        bool usersTableExists = false;
        try
        {
            await context.Database.ExecuteSqlRawAsync("SELECT 1 FROM \"Users\" LIMIT 1");
            usersTableExists = true;
            logger.LogInformation("Users table exists.");
        }
        catch
        {
            logger.LogInformation("Users table does not exist, will create it.");
        }
        
        if (!usersTableExists)
        {
            logger.LogInformation("Creating Users table...");
            
            // Создаем таблицу Users
            await context.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE ""Users"" (
                    ""Id"" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    ""Username"" VARCHAR(50) NOT NULL UNIQUE,
                    ""Email"" VARCHAR(100) NOT NULL UNIQUE,
                    ""PasswordHash"" TEXT NOT NULL,
                    ""CreatedAt"" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
                )");
            
            // Добавляем столбец UserId в TestSessions если его нет
            try
            {
                await context.Database.ExecuteSqlRawAsync(@"
                    ALTER TABLE ""TestSessions"" ADD COLUMN ""UserId"" UUID");
                logger.LogInformation("Added UserId column to TestSessions.");
            }
            catch (Exception ex)
            {
                logger.LogInformation($"UserId column might already exist: {ex.Message}");
            }
            
            // Создаем внешний ключ
            try
            {
                await context.Database.ExecuteSqlRawAsync(@"
                    ALTER TABLE ""TestSessions"" 
                    ADD CONSTRAINT ""FK_TestSessions_Users"" 
                    FOREIGN KEY (""UserId"") REFERENCES ""Users"" (""Id"") ON DELETE SET NULL");
                logger.LogInformation("Created foreign key constraint.");
            }
            catch (Exception ex)
            {
                logger.LogInformation($"Foreign key constraint might already exist: {ex.Message}");
            }
            
            // Создаем индексы
            try
            {
                await context.Database.ExecuteSqlRawAsync(@"
                    CREATE INDEX ""IX_Users_Username"" ON ""Users"" (""Username"")");
                await context.Database.ExecuteSqlRawAsync(@"
                    CREATE INDEX ""IX_Users_Email"" ON ""Users"" (""Email"")");
                await context.Database.ExecuteSqlRawAsync(@"
                    CREATE INDEX ""IX_TestSessions_UserId"" ON ""TestSessions"" (""UserId"")");
                logger.LogInformation("Created indexes.");
            }
            catch (Exception ex)
            {
                logger.LogInformation($"Some indexes might already exist: {ex.Message}");
            }
            
            logger.LogInformation("Users table and relationships created successfully.");
        }
        else
        {
            logger.LogInformation("Users table already exists.");
        }
        
        // Создаем базу данных если её нет (для остальных таблиц)
        await context.Database.EnsureCreatedAsync();
        
        logger.LogInformation("Database schema verified successfully.");
        
        // Заполняем начальные данные
        logger.LogInformation("Seeding initial data...");
        await IqTestApi.Data.DataSeeder.SeedDataAsync(context);
        logger.LogInformation("Initial data seeded successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
        
        // В продакшене не останавливаем приложение из-за проблем с БД
        if (app.Environment.IsDevelopment())
        {
            throw;
        }
    }
}

app.Run();
