# 401 Unauthorized Error - Complete Diagnosis

## Status: BACKEND CORS CONFIGURATION REQUIRED ⚠️

---

## Root Cause Identified

The 401 error is caused by **CORS configuration on the backend** being incomplete.

### Evidence from Console Logs:

```
🍪 ALL COOKIES: __next_hmr_refresh_hash__=...
🍪 Cookies for .temo.co.za: []

Response headers:
{
  access-control-allow-origin: null,
  access-control-allow-methods: null,
  access-control-allow-headers: null,
  access-control-allow-credentials: null
}
```

**Problem:** All CORS headers are `null`, meaning the backend **rejects** requests from `http://local.temo.co.za:3003`.

---

## Why This Happens

1. Frontend now runs on: `http://local.temo.co.za:3003` ✅
2. Backend CORS allows: `http://localhost:3003` ✅
3. Backend CORS does **NOT** allow: `http://local.temo.co.za:3003` ❌

Without proper CORS headers:

- Browser blocks cookie storage
- API returns 401 Unauthorized
- No authentication possible

---

## Required Backend Fix

### What to Request from Backend Team:

**Add `http://local.temo.co.za:3003` to CORS allowed origins**

#### ASP.NET Implementation (Startup.cs or Program.cs):

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("DevelopmentPolicy", builder =>
        {
            builder
                .WithOrigins(
                    "http://localhost:3003",           // Existing
                    "http://local.temo.co.za:3003"    // ADD THIS LINE
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();  // Required for cookies
        });
    });
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseCors("DevelopmentPolicy");
    }

    app.UseRouting();
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
}
```

---

## Verification After Backend Fix

### Expected Response Headers:

```http
access-control-allow-origin: http://local.temo.co.za:3003
access-control-allow-credentials: true
access-control-allow-methods: POST, GET, OPTIONS
access-control-allow-headers: Content-Type, Authorization
```

### Expected Console Output:

```
🍪 ALL COOKIES: _advice_dev=...; _advice_dev_rt=...; XSRF-TOKEN=...
🍪 Cookies for .temo.co.za: ['_advice_dev=...', '_advice_dev_rt=...', 'XSRF-TOKEN=...']
```

### Expected API Response:

```
Status: 200 OK (instead of 401 Unauthorized)
```

---

## Current Implementation Status

### ✅ Frontend (COMPLETE)

- [x] Local domain mapping configured
- [x] Next.js accepts custom hostname
- [x] Cookie debugging logs added
- [x] Documentation created

### ⏳ Backend (REQUIRES ACTION)

- [ ] **CRITICAL**: Add `http://local.temo.co.za:3003` to CORS origins
- [ ] **RECOMMENDED**: Remove `Secure` flag from cookies for dev endpoints

---

## Next Steps

### Immediate Action:

1. **Share `BACKEND_COOKIE_FIX.md` with backend team**
2. **Request CORS update as PRIORITY #1**
3. **Request Secure flag removal as PRIORITY #2**

### After Backend Updates:

1. Clear browser cookies for `.temo.co.za`
2. Restart dev server: `npm run dev:local`
3. Navigate to: `http://local.temo.co.za:3003`
4. Login and verify:
   - Console shows cookies in `🍪` logs
   - Network tab shows CORS headers
   - API returns 200 OK

---

## Alternative Workaround (Temporary)

If backend cannot be updated immediately, you can temporarily go back to `localhost`:

1. Stop server: `Ctrl+C`
2. Run: `npm run dev`
3. Access: `http://localhost:3003`

**Note:** This will only work if backend removes the `Secure` flag from cookies, OR if you switch to token-based auth instead of cookies.

---

## Reference Documents

- [`BACKEND_COOKIE_FIX.md`](BACKEND_COOKIE_FIX.md) - Complete ASP.NET implementation guide
- [`HOSTS_SETUP.md`](HOSTS_SETUP.md) - Frontend local domain setup
- [`lib/crudService.ts`](lib/crudService.ts) - Cookie debugging implementation

---

## Summary

**The frontend is configured correctly.** The issue is purely on the backend - the CORS policy needs to include `http://local.temo.co.za:3003` as an allowed origin. Without this, cookies cannot work and authentication will fail with 401 Unauthorized.
