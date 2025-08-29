# Fix Nginx Proxy for Images

## Problem Found
Diagnostic revealed the issue:
- ✅ Files exist in container
- ✅ API serves files at `/images/` (HTTP 200)
- ❌ Nginx doesn't proxy `/api/images/` correctly (HTTP 404)

## Root Cause
Nginx was proxying `/api/` to `/api/` on the API server, but the API serves static files at `/images/`, not `/api/images/`.

## Solution Applied

### Fixed Nginx Configuration
Added specific proxy rule for images:

```nginx
# API images proxy (must come before general API proxy)
location /api/images/ {
    proxy_pass http://iq-test-api:80/images/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

This maps:
- `https://msamual.ru/api/images/triangles.svg` 
- → `http://iq-test-api:80/images/triangles.svg`

## Deploy to Server

### Step 1: Push changes
```bash
git add .
git commit -m "Fix Nginx proxy for API images"
git push origin main
```

### Step 2: Wait for deployment
GitHub Actions will automatically deploy the changes.

### Step 3: Test the fix
```bash
# This should now return 200 OK
curl -k -I https://msamual.ru/api/images/triangles.svg
```

## Expected Results

After deployment:
- ✅ `https://msamual.ru/api/images/triangles.svg` returns 200 OK
- ✅ Content-Type: image/svg+xml
- ✅ Images display in browser
- ✅ All SVG files accessible via `/api/images/`

## Verification

1. **Test image access:**
```bash
curl -k -I https://msamual.ru/api/images/triangles.svg
```

2. **Test in browser:**
   - Go to https://msamual.ru
   - Start IQ test
   - Check if images display in questions

3. **Test all images:**
```bash
curl -k -I https://msamual.ru/api/images/cubes.svg
curl -k -I https://msamual.ru/api/images/pattern.svg
curl -k -I https://msamual.ru/api/images/rotation.svg
```

## Why This Works

The diagnostic showed:
- API serves files at `/images/` ✅
- Nginx needs to map `/api/images/` → `/images/` ✅
- Specific location block has higher priority than general `/api/` ✅

This is the correct solution!
