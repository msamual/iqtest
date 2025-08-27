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
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
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
    // Don't redirect to HTTPS in development
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAngular");

// Serve static files (images)
app.UseStaticFiles();

app.UseAuthorization();
app.MapControllers();

app.Run();
