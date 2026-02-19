# MongoDB Setup Guide for Student Registration System

This guide will help you set up MongoDB for this project. You have two options:
1. **MongoDB Atlas** (Cloud - Recommended for beginners)
2. **Local MongoDB** (Installed on your computer)

---

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED FOR BEGINNERS

MongoDB Atlas is a free cloud database service. No installation needed!

### Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with:
   - Email address
   - Password
   - Or use Google/GitHub to sign up

### Step 2: Create a Free Cluster

1. After signing up, you'll see "Create a Cluster" button
2. Choose the **FREE** tier (M0 Sandbox)
3. Select a cloud provider:
   - Choose **AWS**, **Google Cloud**, or **Azure**
4. Select a region closest to you:
   - Example: `us-east-1` (Virginia) for USA
   - Example: `ap-south-1` (Mumbai) for India
5. Cluster Name: Leave as default or name it `StudentRegistration`
6. Click **"Create Cluster"** button
7. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User

1. On the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"** button
3. Choose **"Password"** authentication
4. Enter:
   - **Username**: `studentadmin` (or any name you like)
   - **Password**: Create a strong password (write it down!)
   - Example: `MyPassword123!`
5. Database User Privileges: Select **"Read and write to any database"**
6. Click **"Add User"**

**IMPORTANT: Save this username and password - you'll need it later!**

### Step 4: Allow Network Access

1. On the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"** button
3. Click **"Allow Access from Anywhere"** (for development only)
   - This adds `0.0.0.0/0`
4. Click **"Confirm"**
5. Wait 1-2 minutes for the rule to activate

### Step 5: Get Your Connection String

1. Go back to **"Database"** on the left sidebar
2. Click **"Connect"** button on your cluster
3. Click **"Connect your application"**
4. Driver: Select **"Node.js"**
5. Version: Select **"4.1 or later"**
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your .env File

1. Open your project folder: `Regestration Form/backend/.env`
2. Replace the connection string with your Atlas connection string
3. Replace `<username>` with your database username
4. Replace `<password>` with your database password
5. Add your database name

**Example .env file:**
```env
MONGODB_URI=mongodb+srv://studentadmin:MyPassword123!@cluster0.xxxxx.mongodb.net/student_registration?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production_123456
```

**IMPORTANT NOTES:**
- Remove `<` and `>` symbols from the connection string
- Make sure there are no spaces in the password
- If your password has special characters like `@`, `#`, `%`, you need to encode them:
  - Replace `@` with `%40`
  - Replace `#` with `%23`
  - Replace `%` with `%25`
  - Or use a password without special characters

### Step 7: Test Your Connection

1. Open terminal in the backend folder:
   ```bash
   cd backend
   npm start
   ```
2. You should see:
   ```
   Server is running on http://localhost:5000
   MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
   ```
3. If you see this, congratulations! MongoDB is connected! 🎉

---

## Option 2: Local MongoDB Installation

### For Windows:

#### Step 1: Download MongoDB

1. Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Select:
   - Version: Latest (e.g., 7.0.x)
   - Platform: Windows
   - Package: msi
3. Click **"Download"**

#### Step 2: Install MongoDB

1. Run the downloaded `.msi` file
2. Click **"Next"** on the setup wizard
3. Accept the license agreement
4. Choose **"Complete"** installation
5. **Install MongoDB as a Service**: Check this option
6. **Service Name**: Leave as `MongoDB`
7. **Data Directory**: Leave default `C:\Program Files\MongoDB\Server\7.0\data\`
8. **Log Directory**: Leave default `C:\Program Files\MongoDB\Server\7.0\log\`
9. Uncheck **"Install MongoDB Compass"** (optional GUI tool)
10. Click **"Install"**
11. Wait for installation to complete
12. Click **"Finish"**

#### Step 3: Verify Installation

1. Open **Command Prompt** (cmd)
2. Type:
   ```bash
   mongod --version
   ```
3. You should see the MongoDB version
4. MongoDB service should start automatically

#### Step 4: Update .env File

```env
MONGODB_URI=mongodb://localhost:27017/student_registration
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production_123456
```

### For macOS:

#### Step 1: Install Homebrew (if not installed)

1. Open **Terminal**
2. Run:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

#### Step 2: Install MongoDB

```bash
# Tap MongoDB formula
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community@7.0
```

#### Step 3: Start MongoDB

```bash
# Start MongoDB service
brew services start mongodb-community@7.0

# Verify it's running
brew services list
```

#### Step 4: Update .env File

```env
MONGODB_URI=mongodb://localhost:27017/student_registration
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production_123456
```

### For Linux (Ubuntu/Debian):

#### Step 1: Import MongoDB GPG Key

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
```

#### Step 2: Add MongoDB Repository

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

#### Step 3: Install MongoDB

```bash
# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

#### Step 4: Update .env File

```env
MONGODB_URI=mongodb://localhost:27017/student_registration
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production_123456
```

---

## Verify MongoDB Connection

### Test with Node.js

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Look for this message:
   ```
   Server is running on http://localhost:5000
   MongoDB Connected: [hostname]
   ```

4. If you see "MongoDB Connected", you're good to go! ✅

---

## Common Issues and Solutions

### Issue 1: "MongooseServerSelectionError: connect ECONNREFUSED"

**Solution for Atlas:**
- Check your internet connection
- Verify IP address is whitelisted (0.0.0.0/0)
- Wait a few minutes for network access rules to apply

**Solution for Local:**
- Make sure MongoDB service is running
- Windows: Check Services app for "MongoDB" service
- macOS: Run `brew services start mongodb-community@7.0`
- Linux: Run `sudo systemctl start mongod`

### Issue 2: "Authentication failed"

**Solution:**
- Double-check username and password in .env file
- Make sure there are no extra spaces
- Encode special characters in password

### Issue 3: "Cannot find module 'mongoose'"

**Solution:**
```bash
cd backend
npm install mongoose
```

### Issue 4: Port 27017 already in use (Local MongoDB)

**Solution:**
```bash
# Windows
netstat -ano | findstr :27017
taskkill /PID [PID_NUMBER] /F

# macOS/Linux
lsof -i :27017
kill -9 [PID_NUMBER]
```

---

## Using MongoDB Compass (GUI Tool)

MongoDB Compass is a graphical interface to view your database.

### Installation

1. Download from [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
2. Install the application

### Connect to MongoDB

**For Atlas:**
- Use your connection string from Step 5 above

**For Local:**
- Connection string: `mongodb://localhost:27017`

### View Your Data

1. Connect to your database
2. You'll see `student_registration` database
3. Click on `students` collection
4. View all registered students here

---

## Next Steps

After MongoDB is connected:
1. Move to **STEP_BY_STEP_GUIDE.md** to run the complete application
2. Or move to **AUTHENTICATION_SETUP.md** to add authentication

---

## Need Help?

If you're still having issues:
1. Check the error message carefully
2. Google the exact error message
3. Make sure all steps were followed correctly
4. Verify your internet connection (for Atlas)
5. Ensure MongoDB service is running (for Local)
