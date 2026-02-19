# Student Registration System - MERN Stack

A full-stack student registration system built with MongoDB, Express.js, React, and Node.js.

## Features

- Register new students with 10 detailed fields
- Submit student data to MongoDB database
- Retrieve student data by ID
- Display "data not found" message if ID doesn't exist
- Form validation on both frontend and backend
- Responsive design with clean UI

## Student Data Fields

1. Student ID (auto-generated MongoDB ObjectId)
2. Full Name
3. Email
4. Phone Number
5. Date of Birth
6. Gender
7. Address
8. Course/Program
9. Year/Semester
10. Parent/Guardian Contact

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
cd "Regestration Form"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/student_registration
PORT=5000
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/student_registration
PORT=5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system or you have a valid MongoDB Atlas connection string.

### 2. Start Backend Server

```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```

The backend server will run on http://localhost:5000

### 3. Start Frontend

Open a new terminal:

```bash
cd frontend
npm start
```

The React app will run on http://localhost:3000

## API Endpoints

### Register Student
- **POST** `/api/students`
- **Body**: JSON with student details (9 fields)
- **Response**: Success message with created student data

### Get Student by ID
- **GET** `/api/students/:id`
- **Parameter**: MongoDB ObjectId
- **Response**: Student data if found, "data not found" if not found

## Usage

### Register a New Student

1. Fill out all required fields in the registration form
2. Click "Submit Registration" button
3. Upon success, you'll receive a message with the generated Student ID
4. The form will reset automatically

### Retrieve Student Data

1. Enter a valid Student ID in the "Retrieve Student Data" section
2. Click "Retrieve Student" button
3. The student details will be displayed if found
4. If not found, you'll see "Data not found" message

## Project Structure

```
project-root/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── studentController.js
│   ├── models/
│   │   └── Student.js
│   ├── routes/
│   │   └── studentRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentForm.js
│   │   │   └── StudentDisplay.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv
- body-parser

### Frontend
- React 18
- Axios
- CSS3

## Error Handling

- Invalid ID format: Appropriate error message
- Database connection errors: 500 error with message
- Student not found: 404 with "data not found"
- Validation errors: 400 with specific field errors
- Duplicate email: Error message preventing registration

## Validation

### Frontend Validation
- All fields are required
- Email format validation
- Date format validation

### Backend Validation
- Mongoose schema validation
- Unique email constraint
- MongoDB ObjectId format validation
- Duplicate email check