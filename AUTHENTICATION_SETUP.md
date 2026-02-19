# Authentication Setup Guide

This guide will help you add user authentication to the Student Registration System.

## What is Authentication?

Authentication ensures that only authorized users (admin/staff) can:
- Register new students
- View student data
- Access the system

## Features We'll Add

1. **Admin Registration** - Create admin accounts
2. **Admin Login** - Login with email and password
3. **JWT Tokens** - Secure authentication tokens
4. **Protected Routes** - Only logged-in admins can access student operations
5. **Logout** - Clear authentication

---

## Part 1: Backend Authentication Setup

### Step 1: Install Additional Packages

Open terminal in the backend folder:

```bash
cd backend
npm install bcryptjs jsonwebtoken
```

**What these packages do:**
- `bcryptjs` - Encrypts passwords securely
- `jsonwebtoken` - Creates secure authentication tokens

### Step 2: Update .env File

Open `backend/.env` and add JWT secret:

```env
MONGODB_URI=mongodb://localhost:27017/student_registration
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production_123456
```

**Note:** Change `JWT_SECRET` to a random string in production!

### Step 3: Create Admin Model

Create new file: `backend/models/Admin.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
```

### Step 4: Create Authentication Middleware

Create new file: `backend/middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from token
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, admin not found'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

module.exports = { protect };
```

### Step 5: Create Auth Controller

Create new file: `backend/controllers/authController.js`

```javascript
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

// Register new admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password
    });

    if (admin) {
      res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id)
        }
      });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await admin.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get current admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile
};
```

### Step 6: Create Auth Routes

Create new file: `backend/routes/authRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/register - Register new admin
router.post('/register', registerAdmin);

// POST /api/auth/login - Login admin
router.post('/login', loginAdmin);

// GET /api/auth/profile - Get admin profile (protected)
router.get('/profile', protect, getAdminProfile);

module.exports = router;
```

### Step 7: Update Student Routes (Add Protection)

Open `backend/routes/studentRoutes.js` and update:

```javascript
const express = require('express');
const router = express.Router();
const { registerStudent, getStudentById } = require('../controllers/studentController');
const { protect } = require('../middleware/auth');

// POST /api/students - Register new student (PROTECTED)
router.post('/', protect, registerStudent);

// GET /api/students/:id - Get student by ID (PROTECTED)
router.get('/:id', protect, getStudentById);

module.exports = router;
```

### Step 8: Update server.js

Open `backend/server.js` and add auth routes:

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes'); // ADD THIS LINE

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes); // ADD THIS LINE

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Student Registration API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### Step 9: Test Backend Authentication

Restart your backend server:

```bash
cd backend
npm start
```

---

## Part 2: Frontend Authentication Setup

### Step 1: Create Auth Context

Create new file: `frontend/src/context/AuthContext.js`

```javascript
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    if (token && adminData) {
      setAdmin(JSON.parse(adminData));
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = (adminData, token) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    setAdmin(adminData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Step 2: Create Login Component

Create new file: `frontend/src/components/Login.js`

```javascript
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);

      login(response.data.data, response.data.data.token);
      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Operation failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegister ? 'Admin Registration' : 'Admin Login'}</h2>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>

        <p className="toggle-auth">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsRegister(!isRegister)} className="link-button">
            {isRegister ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

### Step 3: Update App.js

Replace `frontend/src/App.js` with:

```javascript
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import StudentForm from './components/StudentForm';
import Login from './components/Login';

function AppContent() {
  const { admin, logout, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!admin) {
    return <Login />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Student Registration System</h1>
        <div className="admin-info">
          <span>Welcome, {admin.name}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>
      <main className="app-main">
        <StudentForm />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

### Step 4: Update StudentForm.js

Update axios calls to include token (already handled by AuthContext):

The axios interceptor is set up automatically in AuthContext, so no changes needed!

### Step 5: Update CSS

Add to `frontend/src/styles/App.css`:

```css
/* Login Styles */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-box {
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-box h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  border-bottom: none;
}

.toggle-auth {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.link-button {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.5rem;
  font-size: 1rem;
}

.link-button:hover {
  color: #2980b9;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
  color: #3498db;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-info span {
  color: white;
  font-size: 1rem;
}

.btn-logout {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: #c0392b;
}

@media (max-width: 480px) {
  .login-box {
    padding: 1.5rem;
  }

  .admin-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

---

## Testing Authentication

### Test 1: Register Admin

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm start`
3. You'll see the Login page
4. Click "Register here"
5. Fill in:
   - Name: Admin User
   - Email: admin@example.com
   - Password: password123
6. Click "Register"
7. You should be logged in automatically

### Test 2: Login

1. Click "Logout" button
2. Enter your credentials
3. Click "Login"
4. You should be logged in

### Test 3: Protected Routes

1. Try registering a student (should work when logged in)
2. Logout and try opening http://localhost:3000
3. You should see the login page
4. Student operations should only work after login

---

## Security Best Practices

1. **Change JWT_SECRET** in production to a strong random string
2. **Use HTTPS** in production (not HTTP)
3. **Set token expiration** appropriately (currently 30 days)
4. **Never commit** `.env` file to Git
5. **Use strong passwords** for admin accounts
6. **Add password reset** functionality (future enhancement)
7. **Add rate limiting** to prevent brute force attacks (future enhancement)

---

## What's Next?

Your application now has:
- ✅ Admin registration and login
- ✅ Secure password encryption
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Logout functionality

Optional enhancements:
- Email verification
- Password reset functionality
- Role-based access (admin vs superadmin)
- Session timeout
- Remember me functionality
