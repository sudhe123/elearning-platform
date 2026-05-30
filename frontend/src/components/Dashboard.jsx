import "./Dashboard.css";
import { useEffect, useState } from "react";

function Dashboard() {

  const [courses, setCourses] = useState([]);

useEffect(() => {

  const enrolledCourses =
    JSON.parse(localStorage.getItem("enrolledCourses")) || [];

  console.log("Dashboard Data:", enrolledCourses);

  setCourses(enrolledCourses);

}, []);

  return (
 <div className="dashboard-container">

  <h2>Welcome to Dashboard</h2>

  <h3>My Enrolled Courses</h3>

  <div className="course-grid">

   {
  courses.length > 0 ? (
    courses.map((course, index) => (
      <div className="course-box" key={index}>

  <h3>{course.title}</h3>

  <p className="course-id">
    Course ID: {course.id}
  </p>

  <div className="progress-section">

    <span>Progress</span>
<span>{course.progress || 0}%</span>

  </div>

  <div className="progress-bar">

    <div
      className="progress-fill"
      style={{ width: `${course.progress || 0}%`
}}
    ></div>

  </div>

</div>
    ))
  ) : (
    <p className="no-course">
  No courses enrolled yet
</p>
  )
}

  </div>

</div>
  );
}

export default Dashboard;