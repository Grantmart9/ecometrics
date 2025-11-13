# Backend Cookie Configuration Fix for ASP.NET

## Problem

The `/advice/dev/auth/sign-in` endpoint sets cookies with the `Secure` flag, which requires HTTPS. This blocks cookies when frontend runs on HTTP (`http://local.temo.co.za:3003`), causing 401 Unauthorized errors.

## Root Cause

```
Set-Cookie: _advice_dev=...; domain=.temo.co.za; path=/; secure; HttpOnly
```

The `secure` flag prevents browsers from sending/storing cookies over HTTP connections.

---

## Required Backend Changes

### CRITICAL FIX #1: Update CORS Configuration

The backend must allow `http://local.temo.co.za:3003` as an allowed origin.

#### ASP.NET CORS Configuration

```csharp
// In Startup.cs or Program.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("DevelopmentPolicy", builder =>
        {
            builder
                .WithOrigins(
                    "http://localhost:3003",           // Keep existing
                    "http://local.temo.co.za:3003"    // ADD THIS
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();  // CRITICAL for cookies
        });
    });

    // ... other services
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Enable CORS BEFORE other middleware
    if (env.IsDevelopment())
    {
        app.UseCors("DevelopmentPolicy");
    }

    app.UseRouting();
    app.UseAuthentication();
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
```

#### Alternative: Dynamic Origin Matching for \*.temo.co.za

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("DevelopmentPolicy", builder =>
        {
            builder
                .SetIsOriginAllowed(origin =>
                {
                    // Allow localhost and any subdomain of temo.co.za on HTTP
                    return origin.StartsWith("http://localhost:") ||
                           origin.StartsWith("http://") && origin.Contains(".temo.co.za:");
                })
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
    });
}
```

#### Verification

After applying CORS fix, response headers should show:

```http
access-control-allow-origin: http://local.temo.co.za:3003
access-control-allow-credentials: true
```

---

### FIX #2: Make `Secure` Flag Conditional for Development Endpoints

Backend team needs to modify the cookie configuration in the authentication controller to **disable the Secure flag for `/advice/dev/` endpoints**.

### ASP.NET Implementation

#### Option 1: Check Request Origin/Path

```csharp
// In your authentication controller (e.g., AuthController.cs)
public IActionResult SignIn([FromBody] LoginRequest request)
{
    // ... authentication logic ...

    // Determine if this is a development endpoint
    var isDevelopmentEndpoint = Request.Path.StartsWithSegments("/advice/dev");

    var cookieOptions = new CookieOptions
    {
        HttpOnly = true,
        Path = "/",
        Domain = ".temo.co.za",
        Secure = !isDevelopmentEndpoint,  // Disable Secure for dev endpoints
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddMinutes(5)
    };

    Response.Cookies.Append("_advice_dev", token, cookieOptions);
    Response.Cookies.Append("_advice_dev_rt", refreshToken, cookieOptions);

    // XSRF token (without HttpOnly)
    var xsrfOptions = new CookieOptions
    {
        HttpOnly = false,
        Path = "/",
        Domain = ".temo.co.za",
        Secure = !isDevelopmentEndpoint,
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddMinutes(5)
    };
    Response.Cookies.Append("XSRF-TOKEN", xsrfToken, xsrfOptions);

    return Ok(new { Status = 200, Data = userData });
}
```

#### Option 2: Use Configuration Setting

```csharp
// In appsettings.Development.json
{
  "CookieSettings": {
    "SecureFlag": false,
    "Domain": ".temo.co.za"
  }
}

// In appsettings.Production.json
{
  "CookieSettings": {
    "SecureFlag": true,
    "Domain": ".temo.co.za"
  }
}

// In your controller
private readonly IConfiguration _configuration;

public AuthController(IConfiguration configuration)
{
    _configuration = configuration;
}

public IActionResult SignIn([FromBody] LoginRequest request)
{
    // ... authentication logic ...

    var useSecureFlag = _configuration.GetValue<bool>("CookieSettings:SecureFlag");
    var cookieDomain = _configuration.GetValue<string>("CookieSettings:Domain");

    var cookieOptions = new CookieOptions
    {
        HttpOnly = true,
        Path = "/",
        Domain = cookieDomain,
        Secure = useSecureFlag,
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddMinutes(5)
    };

    Response.Cookies.Append("_advice_dev", token, cookieOptions);
    Response.Cookies.Append("_advice_dev_rt", refreshToken, cookieOptions);

    return Ok(new { Status = 200, Data = userData });
}
```

#### Option 3: Environment-Based Check

```csharp
// In Startup.cs or Program.cs
public void ConfigureServices(IServiceCollection services)
{
    // ... other services ...

    services.Configure<CookieSettings>(options =>
    {
        options.UseSecureFlag = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development";
        options.Domain = ".temo.co.za";
    });
}

// Cookie settings class
public class CookieSettings
{
    public bool UseSecureFlag { get; set; }
    public string Domain { get; set; }
}

// In AuthController
private readonly CookieSettings _cookieSettings;

public AuthController(IOptions<CookieSettings> cookieSettings)
{
    _cookieSettings = cookieSettings.Value;
}

public IActionResult SignIn([FromBody] LoginRequest request)
{
    // ... authentication logic ...

    var cookieOptions = new CookieOptions
    {
        HttpOnly = true,
        Path = "/",
        Domain = _cookieSettings.Domain,
        Secure = _cookieSettings.UseSecureFlag,
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddMinutes(5)
    };

    Response.Cookies.Append("_advice_dev", token, cookieOptions);
    Response.Cookies.Append("_advice_dev_rt", refreshToken, cookieOptions);

    return Ok(new { Status = 200, Data = userData });
}
```

---

## Expected Cookie Headers After Fix

### Development Endpoints (`/advice/dev/*`)

```http
Set-Cookie: _advice_dev=<token>; domain=.temo.co.za; path=/; HttpOnly; SameSite=Lax
Set-Cookie: _advice_dev_rt=<token>; domain=.temo.co.za; path=/; HttpOnly; SameSite=Lax
Set-Cookie: XSRF-TOKEN=<token>; domain=.temo.co.za; path=/; SameSite=Lax
```

**Note:** No `secure` flag

### Production Endpoints

```http
Set-Cookie: _advice_dev=<token>; domain=.temo.co.za; path=/; secure; HttpOnly; SameSite=Lax
```

**Note:** `secure` flag included

---

## Testing After Backend Changes

### 1. Clear Existing Cookies

Open DevTools → Application → Cookies → Delete all `.temo.co.za` cookies

### 2. Login Again

Navigate to `http://local.temo.co.za:3003` and login

### 3. Verify Cookies Set

Check DevTools → Application → Cookies → `http://local.temo.co.za:3003`

You should see:

- `_advice_dev` with value
- `_advice_dev_rt` with value
- `XSRF-TOKEN` with value

### 4. Verify API Calls Work

Check Console for cookie logs showing cookies being sent:

```
🍪 ALL COOKIES: _advice_dev=...; _advice_dev_rt=...; XSRF-TOKEN=...
```

API calls should return **200 OK** instead of **401 Unauthorized**.

---

## Key Points for Backend Team

1. ✅ Only modify `/advice/dev/` endpoints (development)
2. ✅ Keep `secure` flag for production endpoints
3. ✅ Keep `HttpOnly` flag for security
4. ✅ Keep `domain=.temo.co.za` for subdomain access
5. ✅ Keep `SameSite=Lax` for CSRF protection

## Alternative: Quick Test (Temporary)

If backend team needs time to implement this, they can temporarily disable `Secure` for **all** dev endpoints to unblock development:

```csharp
// TEMPORARY - FOR TESTING ONLY
var cookieOptions = new CookieOptions
{
    HttpOnly = true,
    Path = "/",
    Domain = ".temo.co.za",
    Secure = false,  // Temporarily disabled
    SameSite = SameSiteMode.Lax
};
```

⚠️ **This should NOT go to production!**
