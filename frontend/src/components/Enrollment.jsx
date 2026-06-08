import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courses from "../Data/CourseData";
import "./Enrollment.css";

import { generatePersonalizedRoadmap } from "../utils/roadmapGenerator";

function Enrollment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = courses.find((item) => item.id === Number(id));
  const [learningGoal, setLearningGoal] = useState("");

  const options = [
    "Job Ready",
    "Interview Preparation",
    "Project Based Learning",
    "Certification Preparation",
    "1 Hour Quick Learning",
  ];

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (loggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  if (!course) return <div>Loading course...</div>;

  const handleEnroll = async () => {
    if (!learningGoal) {
      alert("Please select a learning goal");
      return;
    }

    const email = localStorage.getItem("email");

    let enrolled =
      JSON.parse(localStorage.getItem(`enrolledCourses_${email}`)) || [];

    // 🔥 FIX: WAIT FOR ROADMAP
    const roadmap = await generatePersonalizedRoadmap(
      course.id,
      learningGoal
    );

    const newCourseData = {
      ...course,
      learningGoal,
      roadmap,
      progress: 0,
      watchedSteps: [],
      currentStepIndex: 0,
      enrolledAt: new Date().toISOString(),
    };

    const index = enrolled.findIndex((c) => c.id === course.id);

    if (index === -1) {
      enrolled.push(newCourseData);
    } else {
      enrolled[index] = newCourseData;
    }

    localStorage.setItem(
      `enrolledCourses_${email}`,
      JSON.stringify(enrolled)
    );

    navigate(`/roadmap/${course.id}`);
  };

  return (
    <div className="enroll-page">
      <div className="enroll-box">
        <h2>Enroll in {course.title}</h2>

        <p className="enroll-subtitle">
          Choose your learning goal before starting this course
        </p>

        <div className="goal-container">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setLearningGoal(opt)}
              className={`goal-btn ${
                learningGoal === opt ? "active" : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <button className="enroll-confirm" onClick={handleEnroll}>
          Confirm Enrollment
        </button>
      </div>
    </div>
  );
}

export default Enrollment;
