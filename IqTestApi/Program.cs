using IqTestApi.Services;

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

// Serve static files (images)
app.UseStaticFiles();

// Serve static files from wwwroot with specific path
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
    RequestPath = "/images"
});

app.UseAuthorization();
app.MapControllers();

app.Run();
