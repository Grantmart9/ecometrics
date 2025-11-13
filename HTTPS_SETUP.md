# HTTPS Setup for Local Development

## Can We Use HTTPS on Localhost?

**Short Answer:** Partially - HTTPS solves the `Secure` flag issue, but NOT the `domain=.temo.co.za` issue.

---

## The Cookie Domain Problem

Backend sends:

```http
Set-Cookie: _advice_dev=...; domain=.temo.co.za; path=/; secure; HttpOnly
```

### Issue with `https://localhost:3003`:

- ✅ `Secure` flag works (HTTPS satisfied)
- ❌ `domain=.temo.co.za` still fails - browser won't store `.temo.co.za` cookies from `localhost`

### Result: Still 401 Unauthorized

---

## Solution Options

### Option A: HTTPS + local.temo.co.za (RECOMMENDED) ✅

Use `https://local.temo.co.za:3003` with self-signed certificate

**Pros:**

- ✅ Secure flag works (HTTPS)
- ✅ Domain works (local.temo.co.za → .temo.co.za)
- ✅ Most production-like setup

**Cons:**

- ⚠️ Requires SSL certificate setup
- ⚠️ Backend must add HTTPS URL to CORS
- ⚠️ Browser will show security warning (self-signed cert)

### Option B: HTTPS + localhost (Still Needs Backend Fix) ⚠️

Use `https://localhost:3003` with self-signed certificate

**Pros:**

- ✅ Secure flag works

**Cons:**

- ❌ Backend MUST remove `domain=.temo.co.za` for localhost
- ⚠️ Requires SSL certificate setup
- ⚠️ Backend must add HTTPS URL to CORS
- ⚠️ Browser will show security warning

### Option C: HTTP + Backend Fix (SIMPLEST) 🎯

Use `http://local.temo.co.za:3003` (current setup)

**Pros:**

- ✅ No SSL certificate needed
- ✅ Domain works
- ✅ Simplest setup

**Cons:**

- ❌ Backend must remove `Secure` flag for dev
- ❌ Backend must add to CORS

---

## Implementing Option A: HTTPS + local.temo.co.za

### Step 1: Generate Self-Signed Certificate

```bash
# Create SSL directory
mkdir -p .ssl

# Generate certificate for local.temo.co.za
openssl req -x509 -newkey rsa:4096 -keyout .ssl/key.pem -out .ssl/cert.pem -sha256 -days 365 -nodes \
  -subj "/C=ZA/ST=Gauteng/L=Johannesburg/O=Dev/CN=local.temo.co.za"
```

### Step 2: Update package.json

```json
{
  "scripts": {
    "dev": "next dev -p 3003",
    "dev:local": "next dev -p 3003 --hostname local.temo.co.za",
    "dev:https": "node server-https.js"
  }
}
```

### Step 3: Create HTTPS Dev Server

Create `server-https.js`:

```javascript
const https = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const hostname = "local.temo.co.za";
const port = 3003;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./.ssl/key.pem"),
  cert: fs.readFileSync("./.ssl/cert.pem"),
};

app.prepare().then(() => {
  https
    .createServer(httpsOptions, async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("internal server error");
      }
    })
    .listen(port, hostname, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://${hostname}:${port}`);
    });
});
```

### Step 4: Update .gitignore

```
# SSL certificates
.ssl/
*.pem
```

### Step 5: Run HTTPS Server

```bash
npm run dev:https
```

Access at: `https://local.temo.co.za:3003`

**Note:** Browser will show security warning - click "Advanced" → "Proceed to local.temo.co.za"

### Step 6: Backend CORS Update Required

Backend must add HTTPS URL to CORS:

```csharp
services.AddCors(options =>
{
    options.AddPolicy("DevelopmentPolicy", builder =>
    {
        builder
            .WithOrigins(
                "http://localhost:3003",
                "http://local.temo.co.za:3003",
                "https://local.temo.co.za:3003"    // ADD THIS
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

---

## macOS: Trust Self-Signed Certificate (Optional)

To remove browser warnings:

```bash
# Add certificate to keychain
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain .ssl/cert.pem
```

Restart browser after adding certificate.

---

## Comparison Table

| Solution                     | Backend Changes               | Frontend Setup   | Complexity         |
| ---------------------------- | ----------------------------- | ---------------- | ------------------ |
| **HTTP + local.temo.co.za**  | Remove Secure flag + Add CORS | Hosts file only  | ⭐ Low             |
| **HTTPS + local.temo.co.za** | Add HTTPS CORS                | Hosts + SSL cert | ⭐⭐⭐ High        |
| **HTTP + localhost**         | Remove domain + Secure        | None             | ⭐⭐ Medium        |
| **HTTPS + localhost**        | Remove domain + Add CORS      | SSL cert         | ⭐⭐⭐⭐ Very High |

---

## Recommendation

**Use HTTP + local.temo.co.za (current setup)**

This is the simplest solution that requires only:

1. Backend removes `Secure` flag for dev endpoints
2. Backend adds `http://local.temo.co.za:3003` to CORS

HTTPS adds complexity without significant benefit for local development. Cookie-based authentication works fine over HTTP in development environments.

---

## If You Still Want HTTPS

Follow the steps above for Option A. The main benefit is practicing a production-like environment, but it requires:

- SSL certificate management
- Browser security warnings
- Additional backend CORS configuration

Most teams use HTTP for local development and reserve HTTPS for staging/production.
