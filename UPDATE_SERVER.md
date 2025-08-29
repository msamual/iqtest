# Update Server to Fix Images

## Problem
Images return 404 error on production server at https://msamual.ru

## Root Cause
API is not serving static files properly. The static file middleware needs proper configuration.

## Solution Applied

### 1. Fixed Program.cs
- Added `using Microsoft.Extensions.FileProviders;`
- Added specific static file configuration for `/images` path
- This maps `/images/` requests to `wwwroot/images/` directory

### 2. Updated static file configuration
```csharp
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
    RequestPath = "/images"
});
```

## Deploy to Server

### Step 1: Push changes to GitHub
```bash
git add .
git commit -m "Fix static file serving for images"
git push origin main
```

### Step 2: Wait for GitHub Actions
The deploy workflow will automatically:
- Build new Docker images
- Deploy to server
- Restart containers

### Step 3: Test the fix
```bash
# Test image access
curl -k -I https://msamual.ru/api/images/triangles.svg

# Should return HTTP 200 instead of 404
```

## Expected Results

After deployment:
- ✅ `https://msamual.ru/api/images/triangles.svg` returns 200 OK
- ✅ Content-Type: image/svg+xml
- ✅ Images display in browser
- ✅ All SVG files accessible

## Verification

1. **Check API health:**
```bash
curl -k https://msamual.ru/api/IqTest/health
```

2. **Test image access:**
```bash
curl -k -I https://msamual.ru/api/images/triangles.svg
```

3. **Test in browser:**
   - Go to https://msamual.ru
   - Start IQ test
   - Check if images display in questions

## If Still Not Working

1. **Check container logs:**
```bash
docker-compose logs iq-test-api
```

2. **Check if files exist in container:**
```bash
docker-compose exec iq-test-api ls -la /app/wwwroot/images/
```

3. **Test internal API:**
```bash
docker-compose exec iq-test-api curl -s http://localhost:80/images/triangles.svg -I
```
