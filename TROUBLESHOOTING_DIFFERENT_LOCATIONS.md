# Troubleshooting: Website Works in One Location but Not Another

## Problem
✅ Website works in Tamil Nadu (your location)
❌ Website doesn't work in Bangalore (brother's location)

## Why This Happens (Simple Explanation)

When you deploy a website using:
- **Frontend (Vercel)** = What users see
- **Backend (Render)** = Where data is stored/processed

There are several things that can cause it to work in one place but not another.

---

## 🔍 Step 1: IDENTIFY THE PROBLEM

Ask your brother to do these checks:

### Check A: Browser Console Errors

1. Open the website
2. Press **F12** (Windows) or **Cmd+Option+I** (Mac)
3. Click **"Console"** tab
4. Look for **RED error messages**

**Take a screenshot and check which error:**

| Error Message | What It Means | Solution Below |
|---------------|---------------|----------------|
| `CORS policy` or `Access-Control-Allow-Origin` | Backend blocking frontend | Solution 1 |
| `Failed to fetch` | Cannot reach backend | Solution 2 or 3 |
| `ERR_CONNECTION_REFUSED` | Backend is down | Solution 2 |
| `Timeout` or keeps loading | Render sleeping | Solution 3 |
| No errors, just blank page | JavaScript error or loading issue | Solution 4 |

### Check B: Wait Time Test

1. Open the website
2. **Wait exactly 60 seconds** (use phone timer)
3. Does it load now?

**If YES** → This is Render Free Tier Sleeping (Solution 3)
**If NO** → Different issue, continue checking

### Check C: Test Backend Directly

Open this URL in browser:
```
https://student-registration-form-ar1g.onrender.com/
```

**Should see:**
```json
{"message":"Student Registration API is running"}
```

**If you see this** → Backend is working
**If error/timeout** → Backend has issue

---

## ✅ SOLUTION 1: CORS Error (Already Fixed!)

**What I did:**
Updated your backend to allow requests from any location/network.

**After Render deploys** (in 2-3 minutes), it should work.

**How to verify fix worked:**
1. Wait for Render to show "Live"
2. Brother opens site
3. Press F12 → Console
4. CORS error should be gone ✅

---

## ✅ SOLUTION 2: Check Backend is Running

**Render Free Tier Note:**
If backend hasn't been used for 15 minutes, it goes to sleep.

**To check:**
Visit: https://student-registration-form-ar1g.onrender.com/

Should respond in:
- If awake: **1-2 seconds**
- If sleeping: **30-60 seconds** (this is normal!)

**If it never responds:**
1. Go to: https://dashboard.render.com
2. Check your backend service status
3. Should show "Live" (green dot)
4. If showing error, check logs

---

## ✅ SOLUTION 3: Render Free Tier Sleeping (MOST COMMON)

### What's Happening:

Render Free tier:
- **Spins down (sleeps)** after 15 minutes of no use
- **Takes 30-60 seconds** to wake up on first request
- After waking up, works normally

### Why it seems location-based:

- You/friends in TN: You used it recently → already awake
- Brother in Bangalore: First time visiting → has to wake it up

### The 60-Second Rule:

Tell your brother:
1. Open the website
2. **Wait 60 seconds** without refreshing
3. It will load!

### Permanent Fix Options:

#### Option A: Use Cron-Job (FREE)

Ping your backend every 10 minutes to keep it awake:

1. Go to: https://cron-job.org/en/
2. Sign up (free)
3. Click "Create Cronjob"
4. Fill in:
   - **Title:** Keep Backend Awake
   - **URL:** `https://student-registration-form-ar1g.onrender.com/`
   - **Schedule:** Every 10 minutes
   - **Notifications:** Off
5. Save

This keeps your backend awake 24/7!

#### Option B: Upgrade Render (Paid)

- Render Starter Plan: $7/month
- Backend never sleeps
- Faster response times

---

## ✅ SOLUTION 4: Browser Cache/Cookies

Sometimes different devices have different browser settings.

**Ask brother to:**

1. Clear browser cache:
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "Cookies" and "Cached images"
   - Time range: All time
   - Click Clear

2. Try in **Incognito/Private mode**:
   - Chrome: Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
   - Open your website
   - Does it work now?

**If works in incognito:**
→ Cache/cookies issue. Tell him to clear cache.

---

## ✅ SOLUTION 5: Network/ISP Issues

Sometimes internet providers or corporate networks block certain services.

**To check:**

Ask brother to:
1. Turn off WiFi
2. Use mobile data (4G/5G)
3. Try opening website

**If works on mobile data but not WiFi:**
→ His WiFi/ISP is blocking Render or Vercel

**Solutions:**
- Use mobile hotspot
- Use VPN (ProtonVPN free)
- Contact ISP (unlikely to help)

---

## 🎯 Quick Diagnosis Flowchart

```
Website not loading on brother's device?
           ↓
1. Wait 60 seconds
   ├─ Works now? → Render sleeping (use Solution 3: cron-job)
   └─ Still not working → Go to step 2

2. Check Console (F12)
   ├─ CORS error? → Already fixed! Wait for Render redeploy
   ├─ Failed to fetch? → Check backend (Solution 2)
   └─ No errors? → Go to step 3

3. Try Incognito mode
   ├─ Works? → Clear cache (Solution 4)
   └─ Still not working → Go to step 4

4. Try mobile data
   ├─ Works? → WiFi/ISP blocking (Solution 5)
   └─ Still not working → Share console screenshot with me
```

---

## 📱 Testing Checklist

After applying solutions, test from brother's device:

- [ ] Wait for Render to show "Live" (2-3 minutes)
- [ ] Open website in incognito mode
- [ ] Wait 60 seconds on first load
- [ ] Press F12 → Check console for errors
- [ ] Try login with Google
- [ ] Try registering a student

If all work → ✅ Fixed!

---

## 🆘 Still Not Working?

If after trying all solutions it still doesn't work, **gather this info**:

1. **Console errors** (screenshot)
2. **Network tab** (F12 → Network → screenshot)
3. **Device details**:
   - Browser: Chrome/Firefox/Safari?
   - Operating System: Windows/Mac/Android/iOS?
   - Internet: WiFi or Mobile data?
4. **What happens**:
   - Does it show login page?
   - Does it load but not work?
   - Completely blank?

With this info, I can diagnose the exact issue!

---

## 🎓 What You Learned

1. **Free hosting has trade-offs** (sleeping)
2. **CORS** is needed for frontend ↔ backend communication
3. **Different networks** may have different restrictions
4. **First request** to sleeping backend takes time

This is **normal for beginners** - you're doing great! 🚀

---

## Current Status

✅ CORS configuration improved (should fix most issues)
✅ Backend running on Render
✅ Frontend running on Vercel
⏳ Wait for Render to redeploy (2-3 minutes)
🧪 Test from Bangalore after redeploy

---

Created: February 20, 2026
Updated: After CORS fix deployed
