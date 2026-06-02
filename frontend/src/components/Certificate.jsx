import { useEffect, useState } from "react";
import "./Certificate.css";

function Certificate() {
  const [completedCourses, setCompletedCourses] = useState([]);

  useEffect(() => {
    const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    const completed = enrolled.filter(c => c.progress === 100);
    setCompletedCourses(completed);
  }, []);

  return (
    <div className="certificate-container">
      <h1>My Certificates</h1>
      {completedCourses.length > 0 ? (
        <div className="certificate-grid">
          {completedCourses.map((course, index) => (
            <div key={index} className="certificate-card">
              <div className="cert-info">
                <h3>{course.title}</h3>
                <p>Completed on: {new Date(course.enrolledAt).toLocaleDateString()}</p>
                <div className="cert-goal">Goal: {course.learningGoal}</div>
              </div>
              <button className="download-btn" onClick={() => alert("Downloading Certificate for " + course.title)}>
                Download PDF
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-cert-msg">
          <p>No certificates earned yet.</p>
          <p className="sub-msg">Complete a course roadmap to unlock your certificate!</p>
        </div>
      )}
    </div>
  );
}

export default Certificate;