# Deployment Guide: wecare.temo.co.za

## Why This Works

`https://wecare.temo.co.za` is **already configured** in backend:

- ✅ CORS allows this origin
- ✅ HTTPS satisfies `Secure` cookie flag
- ✅ Domain `.temo.co.za` matches `wecare.temo.co.za`
- ✅ **Authentication will work immediately!**

---

## Quick Deployment Steps

### 1. Build Production Bundle

```bash
# Build the static export
npm run build

# Or with yarn
yarn build
```

This creates an `out/` directory with all static files.

### 2. Upload to wecare.temo.co.za

**Option A: Using FTP/SFTP**

```bash
# Upload the entire 'out' folder contents to your web server
# Typically to: /var/www/wecare.temo.co.za/public_html/
# Or: /home/wecare/public_html/
```

**Option B: Using SCP (if you have SSH access)**

```bash
# From your local machine
scp -r out/* user@wecare.temo.co.za:/path/to/web/root/
```

**Option C: Using rsync (recommended for updates)**

```bash
rsync -avz --delete out/ user@wecare.temo.co.za:/path/to/web/root/
```

### 3. Configure Web Server

**For Apache (.htaccess)**

Create/update `.htaccess` in your web root:

```apache
# Redirect all requests to index.html for SPA routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Rewrite everything else to index.html
  RewriteRule . /index.html [L]
</IfModule>

# Enable CORS for API calls (if needed)
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>

# Cache static assets
<FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

**For Nginx**

```nginx
server {
    listen 443 ssl http2;
    server_name wecare.temo.co.za;

    root /path/to/web/root;
    index index.html;

    # SSL configuration (should already exist)
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Verification Steps

### 1. Access the Site

Navigate to: `https://wecare.temo.co.za`

### 2. Test Authentication

1. Click on Login
2. Enter credentials
3. Open DevTools (F12) → Console
4. Look for cookie logs: `🍪 ALL COOKIES: _advice_dev=...; _advice_dev_rt=...; XSRF-TOKEN=...`

### Expected Results:

- ✅ Login successful
- ✅ Console shows cookies being set
- ✅ API calls return 200 OK (not 401)
- ✅ Dashboard loads with data

---

## Build Output Structure

After running `npm run build`, your `out/` folder contains:

```
out/
├── index.html                    # Main landing page
├── login.html                    # Login page
├── input.html                    # Input page
├── dashboard.html                # Dashboard
├── 404.html                      # Error page
├── _next/                        # Next.js static assets
│   ├── static/
│   │   ├── chunks/              # JavaScript bundles
│   │   ├── css/                 # Stylesheets
│   │   └── media/               # Images, fonts
└── ...                          # Other pages

Total size: ~10-15MB
```

---

## Troubleshooting

### Issue: Pages return 404 on refresh

**Solution:** Configure server for SPA routing (see .htaccess or nginx config above)

### Issue: Styles not loading

**Solution:** Check that base path is correct. Ensure all files from `_next/` folder are uploaded.

### Issue: Still getting 401 errors

**Possible causes:**

1. Old cached code - clear browser cache
2. Cookies deleted - login again
3. Backend changed - contact backend team

**Debug:**

```javascript
// Open console and check:
console.log(document.cookie);
// Should show: _advice_dev=...; _advice_dev_rt=...; XSRF-TOKEN=...
```

---

## Update Deployment (After Changes)

When you make changes to your local code:

```bash
# 1. Build new version
npm run build

# 2. Upload to server (overwrites old files)
rsync -avz --delete out/ user@wecare.temo.co.za:/path/to/web/root/

# 3. Clear browser cache and test
```

---

## Alternative: Automated Deployment

Create `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Building for production..."
npm run build

echo "📦 Deploying to wecare.temo.co.za..."
rsync -avz --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  out/ user@wecare.temo.co.za:/path/to/web/root/

echo "✅ Deployment complete!"
echo "🌐 Visit: https://wecare.temo.co.za"
```

Make executable:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Post-Deployment Checklist

- [ ] Site loads at https://wecare.temo.co.za
- [ ] Login page accessible
- [ ] Can login with credentials
- [ ] Cookies visible in DevTools
- [ ] Dashboard loads after login
- [ ] API calls successful (200 OK)
- [ ] No console errors
- [ ] All pages accessible via navigation
- [ ] Page refresh works correctly

---

## Support

If authentication still doesn't work after deployment:

1. Check console for cookie logs (🍪)
2. Verify you're accessing via HTTPS
3. Confirm backend CORS includes https://wecare.temo.co.za
4. Contact backend team if needed

**Expected behavior on wecare.temo.co.za:**

- Cookies work ✅
- Authentication works ✅
- No 401 errors ✅
- Full functionality ✅

This is because the backend is already configured for this domain!
