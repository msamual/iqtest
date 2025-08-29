# Fix Docker Build Error

## Problem
Docker build fails with error:
```
error NETSDK1022: Duplicate 'Content' items were included
```

## Root Cause
.NET SDK automatically includes files from `wwwroot` directory, so explicit inclusion in `.csproj` creates duplicates.

## Solution Applied

### 1. Removed explicit Content items from .csproj
Removed this section:
```xml
<ItemGroup>
  <Content Include="wwwroot\images\**\*" CopyToOutputDirectory="PreserveNewest" />
</ItemGroup>
```

### 2. Simplified Dockerfile
Removed manual copying of images since they're automatically included in publish output.

### 3. Added permissions fix
Added proper permissions for wwwroot directory in Dockerfile.

## Testing on Server

### Step 1: Test local publish (already working)
```bash
./test-publish.sh
```

### Step 2: Test Docker build locally
```bash
./test-docker-build.sh
```

### Step 3: Rebuild and restart containers
```bash
docker-compose down
docker-compose up --build -d
```

### Step 4: Check images in container
```bash
./check-api-images.sh
```

### Step 5: Test image access
```bash
./test-images-simple.sh
```

## Expected Results

After fixes:
- ✅ Docker build succeeds without errors
- ✅ Images are automatically included in publish output
- ✅ Images exist in `/app/wwwroot/images/` in container
- ✅ API serves images at `/images/...` endpoint
- ✅ Images return 200 OK with correct content

## Key Changes

1. **IqTestApi.csproj** - removed duplicate Content items
2. **Dockerfile.prod** - simplified, relies on automatic inclusion
3. **Added permissions** - ensure wwwroot is accessible

The .NET SDK automatically includes all files from `wwwroot` in the publish output, so no manual configuration is needed.
