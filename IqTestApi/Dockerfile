FROM mcr.microsoft.com/dotnet/sdk:9.0

WORKDIR /app

# Copy everything
COPY . ./

# Restore dependencies
RUN dotnet restore

# Build the application
RUN dotnet build -c Release

# Expose ports
EXPOSE 7210
EXPOSE 5263

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=https://0.0.0.0:7210;http://0.0.0.0:5263

# Start the application without launch profile
CMD ["dotnet", "run", "--configuration", "Release", "--no-launch-profile"]
