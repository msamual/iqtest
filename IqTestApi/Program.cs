using IqTestApi.Services;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

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

app.Run();
