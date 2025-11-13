# Local Domain Setup for Cookie Authentication

## Problem

The API sets cookies with `domain=.temo.co.za`, which cannot be accessed from `localhost:3003` due to browser Same-Origin Policy. This causes 401 Unauthorized errors.

## Solution

Run your development app on `local.temo.co.za` instead of `localhost`.

---

## Step 1: Edit Your Hosts File

### macOS/Linux:

1. Open Terminal and run:

```bash
sudo nano /etc/hosts
```

2. Add this line at the end:

```
127.0.0.1 local.temo.co.za
```

3. Save and exit (Ctrl+X, then Y, then Enter)

4. Verify the entry:

```bash
cat /etc/hosts | grep temo
```

You should see: `127.0.0.1 local.temo.co.za`

### Windows:

1. Run Notepad as Administrator
2. Open: `C:\Windows\System32\drivers\etc\hosts`
3. Add this line at the end:

```
127.0.0.1 local.temo.co.za
```

4. Save the file

5. Verify with Command Prompt:

```cmd
findstr temo C:\Windows\System32\drivers\etc\hosts
```

---

## Step 2: Start Your Development Server

Use the new `dev:local` script that configures the custom hostname:

```bash
npm run dev:local
```

Or if using yarn:

```bash
yarn dev:local
```

**Alternative (manual):**

```bash
npm run dev -- --hostname local.temo.co.za
```

You should see output like:

```
▲ Next.js 15.x.x
- Local:        http://local.temo.co.za:3003
```

---

## Step 3: Access Your Application

Open your browser and navigate to:

```
http://local.temo.co.za:3003
```

**Note:** Use `http` not `https` for local development.

---

## Step 4: Test Authentication

1. Navigate to the login page
2. Login with your credentials
3. Open browser DevTools (F12) → Console tab
4. Look for cookie logs (🍪 emoji) that should now show cookies being sent:

   ```
   🍪 ALL COOKIES: _advice_dev=...; _advice_dev_rt=...; XSRF-TOKEN=...
   ```

5. Verify API calls return 200 OK instead of 401 Unauthorized

---

## Why This Works

- Your app runs on `local.temo.co.za` subdomain
- Cookies set for `.temo.co.za` are now accessible
- Browser sends cookies to `api.temo.co.za` because both are under `.temo.co.za`
- Same-Origin Policy requirements satisfied ✅

---

## Troubleshooting

### Can't access local.temo.co.za

- Verify hosts file entry: `cat /etc/hosts | grep temo` (macOS/Linux)
- Try flushing DNS cache:
  - macOS: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
  - Windows: `ipconfig /flushdns`
  - Linux: `sudo systemd-resolve --flush-caches`

### Still getting 401 errors

- Clear browser cookies for `.temo.co.za` domain
- Restart browser
- Check browser console for cookie logs (🍪)
- Verify cookies show in DevTools → Application → Cookies

### Port already in use

- Stop other processes using port 3003
- Or change port: `npm run dev -- --hostname local.temo.co.za -p 3004`

---

## Reverting to localhost

To switch back to localhost development:

1. Use regular dev script:

```bash
npm run dev
```

2. Access app at: `http://localhost:3003`

Note: Authentication will not work on localhost due to cookie domain restrictions.
