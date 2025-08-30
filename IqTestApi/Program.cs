using IqTestApi.Services;
using IqTestApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Add Entity Framework
var connectionStringName = builder.Environment.IsProduction() ? "ProductionConnection" : "DefaultConnection";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString(connectionStringName)));

// Register IQ Test Service
builder.Services.AddScoped<IIqTestService, IqTestService>();

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
app.UseAuthorization();
app.MapControllers();

// Применяем миграции и заполняем данные при запуске
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Applying database migrations...");
        
        // Применяем миграции
        await context.Database.MigrateAsync();
        
        logger.LogInformation("Database migrations applied successfully.");
        
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
