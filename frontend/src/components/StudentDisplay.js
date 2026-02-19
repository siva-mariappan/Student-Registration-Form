import React from 'react';

const StudentDisplay = ({ student }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="student-display">
      <h3>Student Information</h3>
      <div className="student-details">
        <div className="detail-row">
          <span className="detail-label">Student ID:</span>
          <span className="detail-value">{student._id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Full Name:</span>
          <span className="detail-value">{student.fullName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{student.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Phone Number:</span>
          <span className="detail-value">{student.phoneNumber}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Date of Birth:</span>
          <span className="detail-value">{formatDate(student.dateOfBirth)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Gender:</span>
          <span className="detail-value">{student.gender}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Address:</span>
          <span className="detail-value">{student.address}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Course/Program:</span>
          <span className="detail-value">{student.course}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Year/Semester:</span>
          <span className="detail-value">{student.yearSemester}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Parent/Guardian Contact:</span>
          <span className="detail-value">{student.parentGuardianContact}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Registration Date:</span>
          <span className="detail-value">{formatDate(student.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentDisplay;
