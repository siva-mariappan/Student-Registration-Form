# Google Authentication Setup Guide

Complete guide to add "Sign in with Google" to your Student Registration System.

---

## Part 1: Get Google OAuth Credentials (5 minutes)

### Step 1: Go to Google Cloud Console

1. Open: **https://console.cloud.google.com/**
2. Sign in with your Google account

### Step 2: Create a New Project

1. Click **"Select a Project"** (top bar)
2. Click **"New Project"**
3. **Project Name**: `Student Registration System`
4. Click **"Create"**
5. Wait for project creation (10-20 seconds)
6. Click **"Select Project"** to switch to your new project

### Step 3: Enable Google+ API

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for: `Google+ API`
3. Click on **"Google+ API"**
4. Click **"Enable"** button
5. Wait for activation

### Step 4: Create OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (for testing)
3. Click **"Create"**

**Fill in the form:**
- **App name**: Student Registration System
- **User support email**: Your email
- **Developer contact**: Your email
- Leave other fields as default
- Click **"Save and Continue"**

**Scopes page:**
- Click **"Save and Continue"** (skip for now)

**Test users page:**
- Click **"Add Users"**
- Add your email address
- Click **"Add"**
- Click **"Save and Continue"**

Click **"Back to Dashboard"**

### Step 5: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** (top)
3. Select **"OAuth client ID"**

**Configure:**
- **Application type**: Web application
- **Name**: Student Registration Web Client

**Authorized JavaScript origins:**
- Click **"Add URI"**
- Add: `http://localhost:3000`

**Authorized redirect URIs:**
- Click **"Add URI"**
- Add: `http://localhost:5001/auth/google/callback`

4. Click **"Create"**

### Step 6: Save Your Credentials

You'll see a popup with:
- **Client ID**: (looks like: `123456789-abcdefgh.apps.googleusercontent.com`)
- **Client Secret**: (looks like: `GOCSPX-AbCdEfGh1234567890`)

**⚠️ IMPORTANT: Copy and save these!**

```
Client ID: _________________________________
Client Secret: _________________________________
```

Click **"OK"**

---

## Part 2: Configure Backend (Already Done!)

The required packages are installed:
- ✅ passport
- ✅ passport-google-oauth20
- ✅ express-session

---

## Part 3: Update .env File

Add your Google credentials to `backend/.env`:

```env
MONGODB_URI=mongodb+srv://...
PORT=5001
JWT_SECRET=your_super_secret_key_change_this_in_production_123456

# Google OAuth Credentials
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback
SESSION_SECRET=your_random_session_secret_here_123456789
```

**Replace:**
- `YOUR_CLIENT_ID_HERE` with your actual Client ID
- `YOUR_CLIENT_SECRET_HERE` with your actual Client Secret

---

## Part 4: Testing the Setup

After implementation:

1. Go to: http://localhost:3000
2. You'll see **"Sign in with Google"** button
3. Click the button
4. Select your Google account
5. Grant permissions
6. You'll be redirected back to the app
7. Now you can use the Student Registration form!

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Solution:**
1. Go to Google Cloud Console
2. Check **Authorized redirect URIs**
3. Make sure it's exactly: `http://localhost:5001/auth/google/callback`
4. No trailing slash!

### Error: "Access blocked: This app's request is invalid"

**Solution:**
1. Go to OAuth consent screen
2. Add yourself as a Test User
3. Make sure app is in "Testing" mode

### Error: "invalid_client"

**Solution:**
- Check Client ID and Secret in .env file
- Make sure no extra spaces
- Quotes are not needed in .env

---

## Security Notes

🔒 **For Development:**
- Using `http://localhost` is OK

🔒 **For Production:**
- Use HTTPS URLs only
- Update redirect URI to production domain
- Add production domain to Authorized JavaScript origins
- Move app to "Published" status in OAuth consent screen

---

## What Happens Behind the Scenes

1. User clicks "Sign in with Google"
2. Redirected to Google login
3. User grants permissions
4. Google redirects back with authorization code
5. Backend exchanges code for user profile
6. User profile saved to database
7. Session created
8. User logged in!

---

## Next Steps

After setup is complete:
1. ✅ Users must sign in with Google to access the app
2. ✅ User profile stored in database
3. ✅ Session maintained across page refreshes
4. ✅ Logout functionality available
5. ✅ Protected routes (only authenticated users can register students)

---

**Ready to implement?** Follow this guide and provide your Google OAuth credentials!
