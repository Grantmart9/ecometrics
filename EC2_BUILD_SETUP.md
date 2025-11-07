# EC2 Build Setup Instructions

## Prerequisites

- EC2 instance with Node.js 18+ installed
- Yarn package manager installed
- Git access to your repository

## Step 1: Install Node.js and Yarn on EC2

```bash
# Install Node.js 18.x (required for Next.js 15.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn globally
npm install -g yarn

# Verify installations
node --version
yarn --version
```

## Step 2: Clone Your Repository

```bash
# Clone your repository
git clone <your-repository-url> /home/ubuntu/ecometrics
cd /home/ubuntu/ecometrics
```

## Step 3: Install Dependencies

```bash
# Install all dependencies
yarn install

# Verify package.json dependencies are correct
cat package.json | grep -A 5 -B 5 "@mui"
```

You should see:

```json
{
  "@mui/icons-material": "^6.1.3",
  "@mui/material": "^6.1.3"
}
```

## Step 4: Build the Project

```bash
# Run the build command
yarn build

# Verify the "out" folder was created
ls -la out/

# Check specific file
ls -la out/input.html
```

## Expected Build Output

```
✓ Compiled successfully in 7-8s
✓ Generating static pages (29/29)
✓ Exporting (2/2)
○ (Static) prerendered as static content
```

## Step 5: Configure Web Server

### For Nginx:

```bash
sudo nano /etc/nginx/sites-available/ecometrics

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    root /home/ubuntu/ecometrics/out;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/ecometrics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Troubleshooting

### If Material-UI errors occur:

```bash
# Clear yarn cache
yarn cache clean

# Remove node_modules and reinstall
rm -rf node_modules
yarn install
yarn build
```

### If permission errors:

```bash
# Set proper ownership
sudo chown -R ubuntu:ubuntu /home/ubuntu/ecometrics
```

## File Structure After Build

```
/home/ubuntu/ecometrics/
├── out/                 # Generated static files
│   ├── index.html
│   ├── input.html
│   ├── _next/          # Static assets
│   └── ...
├── package.json
├── next.config.js
└── ...
```

## Post-Build Verification

```bash
# Check out folder size
du -sh out/

# Test serving (if you have Python)
cd out
python3 -m http.server 8000
# Visit: http://your-ec2-ip:8000
```
