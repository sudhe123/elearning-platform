import "./CourseDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import courses from "../Data/CourseData";

function CourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const course = courses.find((item) => item.id == Number(id));

  if (!course) return <div className="course-details-error">Course not found</div>;

  const handleEnroll = () => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn !== "true") {
      navigate("/login");
      return;
    }
    navigate(`/enroll/${id}`);
  };

  return (
    <div className="course-details">
      <div className="course-left">
        <h1>{course.title}</h1>
        <div className="course-rating-badge" style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
          <span style={{ background: '#ffe8a3', padding: '4px 10px', borderRadius: '5px', fontSize: '14px', fontWeight: 600, color: '#000' }}>
            ★ {course.rating}
          </span>
        </div>
        <p className="course-description-text" style={{ fontSize: '16px', lineHeight: '1.6', color: '#4b5563', marginBottom: '25px' }}>
          {course.description}
        </p>

        <div className="curriculum-preview" style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#111827' }}>What you'll learn</h3>
          <ul style={{ paddingLeft: '20px', color: '#4b5563', lineHeight: '1.8' }}>
            {course.contents.map((item, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="course-right" style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: 'fit-content' }}>
        <img 
          src={course.image} 
          alt={course.title} 
          style={{ width: '100%', borderRadius: '8px', marginBottom: '20px', objectFit: 'cover', height: '180px' }} 
        />
        
        <div className="course-quick-stats" style={{ margin: '15px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px' }}>
          <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>
            <strong>Estimated Duration:</strong> 10-15 Hours
          </p>
          <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>
            <strong>Personalized Paths:</strong> Available
          </p>
        </div>

        <h4 style={{ fontSize: '15px', color: '#111827', marginBottom: '10px' }}>Roadmap Benefits:</h4>
        <ul style={{ paddingLeft: '18px', color: '#4b5563', fontSize: '13px', lineHeight: '1.6', marginBottom: '25px' }}>
          <li>Custom steps aligned to your career goals</li>
          <li>Targeted skills and learning outcomes</li>
          <li>Structured progress tracking</li>
          <li>Verified certificate on completion</li>
        </ul>

        <button 
          className="enroll-btn" 
          onClick={handleEnroll} 
          style={{ 
            width: '100%', 
            padding: '14px 24px', 
            fontSize: '16px', 
            background: '#6c63ff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: '600',
            transition: 'background-color 0.2s' 
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#5b52e5'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6c63ff'}
        >
          Enroll Now to Start
        </button>
      </div>
    </div>
  );
}

export default CourseDetails;