# Using localhost:3003 - Backend Requirements

## Reverting to Localhost

Simply run the regular dev script:

```bash
npm run dev
```

Then access: `http://localhost:3003`

---

## Why Localhost Still Has Issues

Even on localhost, you'll get 401 Unauthorized because:

1. ❌ Backend sends cookies with `domain=.temo.co.za`
2. ❌ Browser **cannot store** `.temo.co.za` cookies when on `localhost`
3. ❌ Backend also sets `Secure` flag, which **requires HTTPS**
4. ❌ `localhost` uses HTTP, not HTTPS
5. ❌ Result: No cookies → 401 Unauthorized

---

## Required Backend Fix for Localhost

The backend team MUST modify cookie settings:

### ASP.NET Implementation

```csharp
public IActionResult SignIn([FromBody] LoginRequest request)
{
    // ... authentication logic ...

    // Check if request is from localhost
    var origin = Request.Headers["Origin"].ToString();
    var isLocalhost = origin.Contains("localhost");

    var cookieOptions = new CookieOptions
    {
        HttpOnly = true,
        Path = "/",
        Domain = isLocalhost ? null : ".temo.co.za",  // No domain for localhost
        Secure = false,  // Must be false for HTTP
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddMinutes(5)
    };

    Response.Cookies.Append("_advice_dev", token, cookieOptions);
    Response.Cookies.Append("_advice_dev_rt", refreshToken, cookieOptions);

    // XSRF token
    var xsrfOptions = new CookieOptions
    {
        HttpOnly = false,
        Path = "/",
        Domain = isLocalhost ? null : ".temo.co.za",
        Secure = false,
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddMinutes(5)
    };
    Response.Cookies.Append("XSRF-TOKEN", xsrfToken, xsrfOptions);

    return Ok(new { Status = 200, Data = userData });
}
```

### What Changes:

**For requests from `http://localhost:3003`:**

```http
Set-Cookie: _advice_dev=<token>; path=/; HttpOnly; SameSite=Lax
```

- ✅ No `domain` attribute (works with localhost)
- ✅ No `Secure` flag (works with HTTP)

**For requests from production:**

```http
Set-Cookie: _advice_dev=<token>; domain=.temo.co.za; path=/; secure; HttpOnly
```

- ✅ Keeps domain for subdomains
- ✅ Keeps secure for HTTPS

---

## Verification After Backend Fix

### 1. Start your app on localhost:

```bash
npm run dev
```

### 2. Access:

```
http://localhost:3003
```

### 3. Login and check console:

```
🍪 ALL COOKIES: _advice_dev=...; _advice_dev_rt=...; XSRF-TOKEN=...
```

### 4. Verify API calls:

```
Status: 200 OK ✅ (not 401)
```

---

## Summary

**Localhost will only work after backend removes:**

1. `domain=.temo.co.za` restriction (or makes it conditional)
2. `Secure` flag (or makes it conditional)

**Both solutions (localhost OR local.temo.co.za) require backend changes.**

### Which is Better?

| Solution             | Backend Changes Required                             |
| -------------------- | ---------------------------------------------------- |
| **localhost**        | Remove `domain` + `Secure` flag for localhost origin |
| **local.temo.co.za** | Add to CORS origins + Remove `Secure` flag           |

**Recommendation:** Use `local.temo.co.za` as it's more production-like and only requires CORS addition.

But if backend prefers localhost support, share this document with them.
