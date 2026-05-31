var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var aiBasedUrl = builder.Configuration["AI_BASE"] ?? "http://localhost:8000";

builder.Services.AddHttpClient("ai", client =>
{
    client.BaseAddress = new Uri(aiBasedUrl);
});

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("ReactApp");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
