# User Management API Guide

## Overview

Your application now stores all logged-in users in MongoDB and provides API endpoints to retrieve user data.

---

## 📊 What's Stored in Database

When a user logs in with Google, the following information is automatically saved:

| Field | Type | Description |
|-------|------|-------------|
| `googleId` | String | Unique Google account ID |
| `email` | String | User's email address |
| `name` | String | User's full name |
| `picture` | String | URL to profile picture |
| `createdAt` | Date | When user first logged in |

**Database:** `student_registration`
**Collection:** `users`

---

## 🔌 API Endpoints

All endpoints require authentication (user must be logged in).

### 1. Get All Users

**Endpoint:** `GET /api/users`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65abc123...",
      "googleId": "1234567890",
      "email": "user@gmail.com",
      "name": "John Doe",
      "picture": "https://lh3.googleusercontent.com/...",
      "createdAt": "2026-02-20T10:30:00.000Z"
    },
    ...
  ]
}
```

### 2. Get User Statistics

**Endpoint:** `GET /api/users/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 25,
    "recentUsers": [
      {
        "_id": "65abc123...",
        "name": "John Doe",
        "email": "john@gmail.com",
        "createdAt": "2026-02-20T10:30:00.000Z"
      },
      ...
    ]
  }
}
```

### 3. Get Specific User

**Endpoint:** `GET /api/users/:id`

**Example:** `GET /api/users/65abc123def456789`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "googleId": "1234567890",
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "createdAt": "2026-02-20T10:30:00.000Z"
  }
}
```

---

## 🧪 Testing the Endpoints

### Using Browser (After Login)

1. **Login to your app first**
2. Open a new tab
3. Visit:
   - All users: `https://student-registration-form-ar1g.onrender.com/api/users`
   - Stats: `https://student-registration-form-ar1g.onrender.com/api/users/stats`

### Using curl

```bash
# Get all users (replace with your backend URL)
curl -X GET 'https://student-registration-form-ar1g.onrender.com/api/users' \
  --cookie 'connect.sid=your-session-cookie'
```

### Using JavaScript (Frontend)

```javascript
// Get all users
const response = await axios.get(`${apiUrl}/api/users`, {
  withCredentials: true
});
console.log(response.data);

// Get user stats
const stats = await axios.get(`${apiUrl}/api/users/stats`, {
  withCredentials: true
});
console.log(stats.data);
```

---

## 🔒 Security Notes

- All user endpoints are **protected** - users must be logged in
- Only authenticated users can access user data
- If you want admin-only access, you can add an `isAdmin` field to the User model

---

## 📱 View Users in MongoDB Atlas

**Option 1: MongoDB Atlas Dashboard**
1. Go to https://cloud.mongodb.com
2. Login → Clusters → Cluster0
3. Click "Browse Collections"
4. Select `student_registration` database
5. Click `users` collection
6. You'll see all logged-in users

**Option 2: MongoDB Compass (Desktop App)**
1. Download MongoDB Compass
2. Connect using your MONGODB_URI
3. Navigate to `student_registration` → `users`

---

## 🎯 Example Use Cases

### Display User Count on Dashboard
```javascript
const { data } = await axios.get(`${apiUrl}/api/users/stats`, {
  withCredentials: true
});

console.log(`Total registered users: ${data.data.totalUsers}`);
```

### Show Recent Users
```javascript
const { data } = await axios.get(`${apiUrl}/api/users/stats`, {
  withCredentials: true
});

data.data.recentUsers.forEach(user => {
  console.log(`${user.name} (${user.email}) - Joined: ${user.createdAt}`);
});
```

### User Profile Page
```javascript
const userId = '65abc123...';
const { data } = await axios.get(`${apiUrl}/api/users/${userId}`, {
  withCredentials: true
});

console.log('User Profile:', data.data);
```

---

## 🔧 Adding More Fields to User Model

If you want to store additional information, edit `backend/models/User.js`:

```javascript
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String },

  // Add new fields here:
  phoneNumber: { type: String },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  lastLogin: { type: Date, default: Date.now },

  createdAt: { type: Date, default: Date.now }
});
```

Then update the passport configuration to save additional fields during login.

---

## 📋 Summary

✅ User login details are automatically stored in MongoDB
✅ Three API endpoints available to retrieve user data
✅ All endpoints are protected (require authentication)
✅ Users stored with: googleId, email, name, picture, createdAt
✅ Can view users in MongoDB Atlas dashboard

**Backend URL:** `https://student-registration-form-ar1g.onrender.com`

---

Created: February 20, 2026
