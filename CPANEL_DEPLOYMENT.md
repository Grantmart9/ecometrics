# cPanel Deployment Guide - EcoMetrics

## Overview

This guide will help you deploy your EcoMetrics app to cPanel with support for both usernames and emails for authentication.

## Changes Made

### 1. Authentication System Updated

- ✅ **Support for both emails and usernames** during login/signup
- ✅ **Updated signup API** to accept either email or username
- ✅ **Enhanced validation** with proper regex patterns
- ✅ **Backend compatibility** - sends identifier as email field for API compatibility

### 2. UI Improvements

- ✅ **Updated login form** placeholder: "Email address or username"
- ✅ **Enhanced signup modal** with separate username field option
- ✅ **Better user guidance** with validation messages

### 3. Environment Configuration

- ✅ **Production-ready config** for static export
- ✅ **Environment-based API URLs**
- ✅ **cPanel compatible** static build

## cPanel Deployment Steps

### Step 1: Update Environment Variables

Edit the `.env.local` file and update the production API URL:

```env
# Replace 'your-domain.com' with your actual domain
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### Step 2: Build for Production

Run the build command to generate the static files:

```bash
npm run build
```

This creates the `out/` directory with all static files.

### Step 3: Upload to cPanel

1. **Compress the `out` directory** into a ZIP file
2. **Upload and extract** to your cPanel File Manager in the `public_html` directory
3. **Ensure all files** are properly extracted

### Step 4: Configure API Routes

Since this is a static export, your API routes need to be handled differently:

#### Option A: External API Backend

Point your `NEXT_PUBLIC_API_URL` to your existing CRUD API:

```env
NEXT_PUBLIC_API_URL=https://api.your-backend.com
```

#### Option B: cPanel API Routes

If you want to handle API routes on cPanel, you need to:

1. **Create PHP API endpoints** that match your Next.js API structure
2. **Update the environment** to point to your PHP endpoints
3. **Handle CORS** properly in your PHP files

### Step 5: Test the Deployment

1. **Access your domain** - the app should load
2. **Test login** with both email and username formats:
   - Email: `user@example.com`
   - Username: `johndoe`
3. **Verify signup** works with either format

## Username/Email Validation Rules

### Email Format

- Must be a valid email: `user@domain.com`
- Standard email validation applies

### Username Format

- 3-30 characters
- Only letters, numbers, and underscores
- No special characters or spaces
- Examples: `johndoe`, `user_123`, `MyUserName`

## File Structure for cPanel

Your cPanel `public_html` should contain:

```
public_html/
├── index.html
├── login/
├── dashboard/
├── emissions/
├── ... (other pages)
├── _next/
│   └── static/
└── .htaccess
```

## Troubleshooting

### Issue 1: "Address already in use" (Development)

```bash
# Kill processes on port 3003
kill $(lsof -ti:3003)
```

### Issue 2: API calls failing in production

- Check your `NEXT_PUBLIC_API_URL` setting
- Ensure your backend API is running and accessible
- Verify CORS settings on your backend

### Issue 3: Static export not generating

```bash
# Clean build
rm -rf .next out
npm run build
```

## Key Features Enabled

### ✅ Username + Email Authentication

- Users can register/login with either format
- Automatic detection of identifier type
- Backward compatibility with existing email users

### ✅ Production-Ready Static Export

- Optimized for cPanel deployment
- Fast loading with static files
- SEO-friendly with proper meta tags

### ✅ Enhanced User Experience

- Clear validation messages
- Intuitive form labels
- Better error handling

## Backend API Compatibility

Your existing CRUD API should be able to handle the new format:

### Signup Request

```json
{
  "email": "identifier (email or username)",
  "password": "userpassword",
  "name": "User Name",
  "company": "Company Name",
  "username": "optional_separate_username"
}
```

### Login Request

```json
{
  "email": "identifier (email or username)",
  "password": "userpassword"
}
```

## Next Steps

1. **Test locally** with the development server
2. **Update your production API URL** in `.env.local`
3. **Build and upload** the `out` directory to cPanel
4. **Configure your backend** to handle the new request format
5. **Test thoroughly** with both email and username formats

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your API backend is running
3. Ensure environment variables are set correctly
4. Test with the development server first

Your app is now ready for cPanel deployment with both username and email support!
