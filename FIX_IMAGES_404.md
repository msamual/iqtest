# Fix Images 404 Error

## Problem
Images return 404 error when accessed via `/api/images/...`

## Root Cause
Static files (SVG images) are not being copied to the Docker container properly.

## Solution Applied

### 1. Fixed .csproj file
Added static files to project output:
```xml
<ItemGroup>
  <Content Include="wwwroot\images\**\*" CopyToOutputDirectory="PreserveNewest" />
</ItemGroup>
```

### 2. Simplified Dockerfile
Removed unnecessary `mkdir` command and simplified copy:
```dockerfile
# Copy static files (images) from build context
COPY wwwroot/images/ /app/wwwroot/images/
```

### 3. Simplified Program.cs
Removed duplicate static file configuration.

## Testing on Server

### Step 1: Test Docker build locally
```bash
./test-docker-build.sh
```

### Step 2: Rebuild and restart containers
```bash
docker-compose down
docker-compose up --build -d
```

### Step 3: Check images in container
```bash
./check-api-images.sh
```

### Step 4: Test image access
```bash
./test-images-simple.sh
```

## Expected Results

After fixes:
- ✅ Docker build includes images
- ✅ Images exist in `/app/wwwroot/images/` in container
- ✅ API serves images at `/images/...` endpoint
- ✅ Nginx proxies `/api/images/...` to API
- ✅ Images return 200 OK with correct content

## If Still 404

1. **Check build context:**
```bash
# Make sure files exist in build context
ls -la IqTestApi/wwwroot/images/
```

2. **Check Docker build logs:**
```bash
docker-compose build iq-test-api
```

3. **Check container contents:**
```bash
docker-compose exec iq-test-api find /app -name "*.svg"
```

4. **Test internal API:**
```bash
docker-compose exec iq-test-api curl -s http://localhost:80/images/triangles.svg -I
```
