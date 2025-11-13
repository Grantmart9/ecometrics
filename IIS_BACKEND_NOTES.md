# IIS/ASP.NET Backend Configuration Notes

## Important Clarification

Your backend runs on **IIS (Internet Information Services)** hosting an **ASP.NET** application. All cookie and CORS configuration changes must be made in your **ASP.NET application code**, NOT in IIS configuration.

---

## Where to Make Changes

### ✅ Correct: ASP.NET Application Code

All the code examples in [`BACKEND_COOKIE_FIX.md`](BACKEND_COOKIE_FIX.md) are correct:

**Changes go in:**

- `Startup.cs` (ASP.NET Core 3.1 - 5.0)
- `Program.cs` (ASP.NET Core 6.0+)
- Authentication Controller (e.g., `AuthController.cs`)

**Example locations in your codebase:**

```
YourProject/
├── Startup.cs                    ← CORS configuration here
├── Program.cs                    ← Or here for .NET 6+
└── Controllers/
    └── AuthController.cs         ← Cookie settings here
```

### ❌ Incorrect: IIS Configuration Files

Do NOT try to configure cookies or CORS in:

- `web.config`
- IIS Manager GUI
- `applicationHost.config`

These settings must be in C# application code.

---

## Deployment Note

After your backend team makes the code changes:

1. They update the C# code in Visual Studio
2. They rebuild the application
3. They redeploy to IIS
4. IIS serves the updated application with new cookie/CORS behavior

---

## Quick Summary for Backend Team

**Technology Stack:**

- Server: IIS
- Framework: ASP.NET (Core or Framework)
- Language: C#
- Database: MySQL

**Required Changes (in ASP.NET code):**

### Priority 1: CORS Configuration

```csharp
// In Startup.cs ConfigureServices method
services.AddCors(options =>
{
    options.AddPolicy("DevelopmentPolicy", builder =>
    {
        builder
            .WithOrigins(
                "http://localhost:3003",
                "http://local.temo.co.za:3003"    // ADD THIS
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// In Configure method
app.UseCors("DevelopmentPolicy");  // BEFORE UseRouting()
```

### Priority 2: Cookie Configuration

```csharp
// In AuthController.cs SignIn method
var cookieOptions = new CookieOptions
{
    HttpOnly = true,
    Path = "/",
    Domain = ".temo.co.za",
    Secure = false,  // Change from true to false for dev endpoints
    SameSite = SameSiteMode.Lax
};
```

---

## Testing After Deployment

Once backend team deploys the changes to IIS:

1. Clear browser cookies for `.temo.co.za`
2. Access `http://local.temo.co.za:3003`
3. Login
4. Check console: `🍪 ALL COOKIES: _advice_dev=...; _advice_dev_rt=...; XSRF-TOKEN=...`
5. Verify: API returns 200 OK (not 401)

---

## Reference Documents

All implementation details are in:

- [`BACKEND_COOKIE_FIX.md`](BACKEND_COOKIE_FIX.md) - Complete ASP.NET/C# code examples
- [`DIAGNOSIS_SUMMARY.md`](DIAGNOSIS_SUMMARY.md) - Root cause and verification steps

These apply to ASP.NET on IIS - the code is identical regardless of hosting platform.
