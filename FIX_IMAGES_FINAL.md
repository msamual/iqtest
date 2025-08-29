# Final Fix for Images 404 Error

## Problem
Images still return 404 after previous fixes.

## Root Cause Analysis
The issue is likely one of:
1. Static files not being copied to Docker container
2. Middleware order in Program.cs
3. Path mapping not working correctly

## Solution Applied

### 1. Fixed middleware order in Program.cs
- Added `app.UseRouting()` before authorization
- Ensured static files middleware comes before routing
- Added logging to debug path issues

### 2. Added debugging logs
```csharp
var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
Console.WriteLine($"Serving static files from: {wwwrootPath}");
Console.WriteLine($"Directory exists: {Directory.Exists(wwwrootPath)}");
```

### 3. Created diagnostic scripts
- `debug-images-detailed.sh` - comprehensive debugging
- `test-local-api.sh` - test local API build

## Deploy to Server

### Step 1: Push changes
```bash
git add .
git commit -m "Fix static file middleware order and add debugging"
git push origin main
```

### Step 2: Wait for deployment
GitHub Actions will automatically deploy the changes.

### Step 3: Check logs
```bash
# Check API logs for debugging info
docker-compose logs iq-test-api | grep "Serving static files"
```

### Step 4: Run diagnostics
```bash
# Run comprehensive debugging
./debug-images-detailed.sh
```

## Expected Results

After deployment:
- ✅ API logs show correct wwwroot path
- ✅ Directory exists: True
- ✅ `/api/images/triangles.svg` returns 200 OK
- ✅ Images display in browser

## If Still 404

### Check 1: Verify files in container
```bash
docker-compose exec iq-test-api ls -la /app/wwwroot/images/
```

### Check 2: Test internal API
```bash
docker-compose exec iq-test-api curl -s http://localhost:80/images/triangles.svg -I
```

### Check 3: Check API logs
```bash
docker-compose logs iq-test-api --tail 50
```

### Check 4: Rebuild from scratch
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Alternative Solution

If the above doesn't work, we may need to:
1. Use a different approach for serving static files
2. Serve images directly from Nginx instead of API
3. Use a different path mapping strategy

The debugging logs will help identify the exact issue.
