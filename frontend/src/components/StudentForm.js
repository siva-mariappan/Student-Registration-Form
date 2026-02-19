import React, { useState } from 'react';
import axios from 'axios';
import StudentDisplay from './StudentDisplay';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    course: '',
    yearSemester: '',
    parentGuardianContact: ''
  });

  const [retrieveId, setRetrieveId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [retrieveLoading, setRetrieveLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.fullName.trim()) {
      setMessage({ type: 'error', text: 'Please enter full name' });
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter phone number' });
      return false;
    }
    if (!formData.dateOfBirth) {
      setMessage({ type: 'error', text: 'Please select date of birth' });
      return false;
    }
    if (!formData.gender) {
      setMessage({ type: 'error', text: 'Please select gender' });
      return false;
    }
    if (!formData.address.trim()) {
      setMessage({ type: 'error', text: 'Please enter address' });
      return false;
    }
    if (!formData.course.trim()) {
      setMessage({ type: 'error', text: 'Please enter course/program' });
      return false;
    }
    if (!formData.yearSemester.trim()) {
      setMessage({ type: 'error', text: 'Please enter year/semester' });
      return false;
    }
    if (!formData.parentGuardianContact.trim()) {
      setMessage({ type: 'error', text: 'Please enter parent/guardian contact' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/students`, formData, {
        withCredentials: true
      });

      setMessage({
        type: 'success',
        text: `Student registered successfully! Student ID: ${response.data.data._id}`
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        course: '',
        yearSemester: '',
        parentGuardianContact: ''
      });
    } catch (error) {
      if (error.response) {
        setMessage({
          type: 'error',
          text: error.response.data.message || 'Failed to register student'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Network error. Please check if the server is running.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieve = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setStudentData(null);

    if (!retrieveId.trim()) {
      setMessage({ type: 'error', text: 'Please enter a student ID' });
      return;
    }

    setRetrieveLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/students/${retrieveId}`, {
        withCredentials: true
      });
      setStudentData(response.data.data);
      setMessage({ type: 'success', text: 'Student data retrieved successfully' });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage({ type: 'error', text: 'Data not found' });
      } else if (error.response) {
        setMessage({
          type: 'error',
          text: error.response.data.message || 'Failed to retrieve student data'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Network error. Please check if the server is running.'
        });
      }
    } finally {
      setRetrieveLoading(false);
    }
  };

  return (
    <div className="student-form-container">
      {/* Registration Form */}
      <div className="form-section">
        <h2>Register New Student</h2>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth *</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="course">Course/Program *</label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Enter course or program"
            />
          </div>

          <div className="form-group">
            <label htmlFor="yearSemester">Year/Semester *</label>
            <input
              type="text"
              id="yearSemester"
              name="yearSemester"
              value={formData.yearSemester}
              onChange={handleChange}
              placeholder="e.g., Year 1 Semester 1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="parentGuardianContact">Parent/Guardian Contact *</label>
            <input
              type="tel"
              id="parentGuardianContact"
              name="parentGuardianContact"
              value={formData.parentGuardianContact}
              onChange={handleChange}
              placeholder="Enter parent/guardian contact"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>
      </div>

      {/* Retrieve Student Section */}
      <div className="retrieve-section">
        <h2>Retrieve Student Data</h2>

        <form onSubmit={handleRetrieve} className="retrieve-form">
          <div className="form-group">
            <label htmlFor="retrieveId">Student ID</label>
            <input
              type="text"
              id="retrieveId"
              value={retrieveId}
              onChange={(e) => setRetrieveId(e.target.value)}
              placeholder="Enter student ID"
            />
          </div>

          <button type="submit" className="btn btn-secondary" disabled={retrieveLoading}>
            {retrieveLoading ? 'Retrieving...' : 'Retrieve Student'}
          </button>
        </form>

        {studentData && <StudentDisplay student={studentData} />}
      </div>
    </div>
  );
};

export default StudentForm;
