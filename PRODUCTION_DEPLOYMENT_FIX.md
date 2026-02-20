# Production Deployment Configuration Guide

## The Problem You're Experiencing

When you login on your hosted server, the page doesn't display because:
1. CORS is blocking your frontend
2. OAuth redirects go to localhost instead of your production URL
3. Session cookies aren't working with HTTPS

## ✅ Code Fixes Applied

I've updated the following files:
- `backend/server.js` - Dynamic CORS and session configuration
- `backend/routes/authGoogleRoutes.js` - Dynamic OAuth redirects
- `backend/.env` - Added new environment variables

---

## 🚀 What You Need to Do Now

### Step 1: Update Environment Variables on Your Hosting Platform

**On your backend hosting service (Render/Heroku/etc):**

Add these environment variables:

```env
# Your existing variables
MONGODB_URI=mongodb+srv://StudentRegistrationForm:regform-01@cluster0.czzkzzu.mongodb.net/student_registration?retryWrites=true&w=majority&appName=Cluster0
PORT=5001
JWT_SECRET=your_super_secret_key_change_this_in_production_123456
SESSION_SECRET=4a441960ece246bf1fae8c9a34ffc7737a46038f480c7e04fa053ebd8dd492cef496dc8dfdabcf7993092dc6b97bc8fdb32df35d4e5b8b0a458f99615828f5de

# THESE ARE THE CRITICAL NEW VARIABLES:
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app  # ⚠️ REPLACE WITH YOUR ACTUAL FRONTEND URL

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-app.onrender.com/auth/google/callback  # ⚠️ REPLACE WITH YOUR BACKEND URL
```

**IMPORTANT:** Replace:
- `https://your-frontend-app.vercel.app` with your actual Vercel/Netlify frontend URL
- `https://your-backend-app.onrender.com` with your actual Render/Heroku backend URL

---

### Step 2: Update Google OAuth Console

Go to: https://console.cloud.google.com/apis/credentials

1. Select your project: **Student Registration Form**

2. Click on your OAuth 2.0 Client ID

3. **Add Authorized JavaScript Origins:**
   ```
   https://your-frontend-app.vercel.app
   https://your-backend-app.onrender.com
   ```

4. **Add Authorized Redirect URIs:**
   ```
   https://your-backend-app.onrender.com/auth/google/callback
   ```

5. Click **SAVE**

---

### Step 3: Update Frontend Environment Variable

**On your frontend hosting service (Vercel/Netlify):**

Update the environment variable:
```env
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

⚠️ Replace with your actual backend URL

---

### Step 4: Redeploy Both Services

1. **Backend:** Trigger a new deployment on Render/Heroku
2. **Frontend:** Trigger a new deployment on Vercel/Netlify

---

## 🧪 Testing

After deployment:

1. Visit your production frontend URL
2. Click "Sign in with Google"
3. Complete Google OAuth
4. **You should now see the Student Registration form!**

---

## ❌ Common Issues

### Issue: Still redirecting to localhost
**Solution:** Clear browser cookies and cache, then try again

### Issue: "Redirect URI mismatch" error
**Solution:** Double-check that your Google OAuth Console Redirect URIs exactly match your backend URL + `/auth/google/callback`

### Issue: CORS error in browser console
**Solution:** Make sure `FRONTEND_URL` environment variable on backend exactly matches your frontend URL (no trailing slash)

### Issue: Authentication works but then logs out immediately
**Solution:**
- Verify `NODE_ENV=production` is set on backend
- Verify your hosting platform supports cookies (most do)
- Check browser console for cookie warnings

---

## 📋 Quick Checklist

- [ ] Added `NODE_ENV=production` to backend environment variables
- [ ] Added `FRONTEND_URL` to backend environment variables
- [ ] Updated `GOOGLE_CALLBACK_URL` to production backend URL
- [ ] Updated Google OAuth Console JavaScript Origins
- [ ] Updated Google OAuth Console Redirect URIs
- [ ] Updated `REACT_APP_API_URL` on frontend environment variables
- [ ] Redeployed backend
- [ ] Redeployed frontend
- [ ] Cleared browser cache and cookies
- [ ] Tested login flow

---

## 🆘 Need Help?

If you're still having issues:
1. Check the browser console (F12) for error messages
2. Check your backend logs on Render/Heroku
3. Verify all URLs have `https://` (not `http://`) in production
4. Make sure there are no trailing slashes in URLs

---

**Created:** February 20, 2026
**Status:** Ready for deployment
