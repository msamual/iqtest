# Debug Images Not Displaying

## Quick Test

Run this on the server to test image loading:

```bash
./test-images-simple.sh
```

## Manual Testing

1. **Check if containers are running:**
```bash
docker-compose ps
```

2. **Test API health:**
```bash
curl -k https://localhost/api/IqTest/health
```

3. **Test image access:**
```bash
curl -k -I https://localhost/api/images/triangles.svg
```

4. **Check if images exist in API container:**
```bash
docker-compose exec iq-test-api ls -la /app/wwwroot/images/
```

5. **Check Nginx configuration:**
```bash
docker-compose exec iq-test-frontend cat /etc/nginx/conf.d/default.conf
```

## Common Issues

### Issue 1: Nginx serving static files instead of proxying
**Problem:** Nginx tries to serve SVG files directly instead of proxying to API.

**Solution:** Fixed in `nginx.prod.conf` - moved API proxy before static assets.

### Issue 2: Images not copied to Docker container
**Problem:** SVG files not included in API Docker image.

**Solution:** Fixed in `Dockerfile.prod` - added `COPY wwwroot/images/ /app/wwwroot/images/`

### Issue 3: Wrong base URL in Angular service
**Problem:** `baseUrl` was empty string.

**Solution:** Fixed in `iq-test.service.ts` - set `baseUrl = '/api'`

### Issue 4: Static files not configured in .NET
**Problem:** .NET not serving static files from wwwroot.

**Solution:** Added specific static file configuration in `Program.cs`

## Expected Results

- ✅ API health check returns 200
- ✅ Image URLs return 200 with correct Content-Type
- ✅ Images have non-zero file size
- ✅ Images display in browser

## If Still Not Working

1. **Check browser developer tools:**
   - Network tab for failed requests
   - Console for errors

2. **Check server logs:**
```bash
docker-compose logs iq-test-api
docker-compose logs iq-test-frontend
```

3. **Test direct API access:**
```bash
curl -k https://localhost/api/images/triangles.svg -o test.svg
file test.svg
```
