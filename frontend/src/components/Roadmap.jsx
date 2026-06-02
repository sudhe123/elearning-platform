import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";

import courses from "../Data/CourseData";
import roadmapData from "../Data/roadmapData";
import "./CourseDetails.css";

function Roadmap() {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = courses.find((item) => item.id === Number(id));

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [watchedSteps, setWatchedSteps] = useState([]);
  const [videoStarted, setVideoStarted] = useState(false);
  const [learningGoal, setLearningGoal] = useState("");

  if (!course) {
    return <div>Loading course...</div>;
  }

  const steps = Array.isArray(roadmapData?.[course.id])
    ? roadmapData[course.id]
    : [];

  const roadmap = steps;

  useEffect(() => {
    const enrolledCourses =
      JSON.parse(localStorage.getItem("enrolledCourses")) || [];

    const saved = enrolledCourses.find((c) => c.id == id);

    if (saved) {
      setLearningGoal(saved.learningGoal || "");
      setWatchedSteps(saved.watchedSteps || []);
      setCurrentStepIndex(saved.currentStepIndex || 0);
    }
  }, [id]);

  const progress =
    roadmap.length > 0
      ? Math.round((watchedSteps.length / roadmap.length) * 100)
      : 0;

  const updateProgress = (newWatched, index) => {
    const enrolledCourses =
      JSON.parse(localStorage.getItem("enrolledCourses")) || [];

    const updated = enrolledCourses.map((c) => {
      if (c.id == id) {
        return {
          ...c,
          watchedSteps: newWatched,
          currentStepIndex: index,
          progress:
            roadmap.length > 0
              ? Math.round((newWatched.length / roadmap.length) * 100)
              : 0,
        };
      }
      return c;
    });

    localStorage.setItem("enrolledCourses", JSON.stringify(updated));
  };

  const currentStep = roadmap?.[currentStepIndex] || null;

  const currentVideoId =
    currentStep?.video ||
    currentStep?.videoUrl ||
    course?.video ||
    null;

  const onPlayerStateChange = (event) => {
    if (event.data === 0 && currentStep) {
      if (!watchedSteps.includes(currentStep.id)) {
        const newWatched = [...watchedSteps, currentStep.id];
        setWatchedSteps(newWatched);
        updateProgress(newWatched, currentStepIndex);
      }
    }
  };

  const handleStepClick = (index) => {
    if (!roadmap[index]) return;

    setCurrentStepIndex(index);
    updateProgress(watchedSteps, index);
  };

  const opts = {
    height: "450",
    width: "100%",
    playerVars: { autoplay: 1 },
  };

  const isCourseCompleted =
    roadmap.length > 0 && watchedSteps.length === roadmap.length;

  return (
    <div className="course-details">
      <div className="roadmap-container">

        {/* HEADER */}
        <div className="roadmap-header">
          <button
            className="back-btn"
            onClick={() => navigate(`/course/${id}`)}
          >
            ← Back
          </button>

          <h2>{course.title} Roadmap</h2>

          <div className="goal-text">Goal: {learningGoal}</div>
        </div>

        <div className="roadmap-main">

          {/* START / VIDEO */}
          {!videoStarted ? (
            <div className="start-box">
              <h2>Start Learning</h2>
              <button
                className="start-btn"
                onClick={() => setVideoStarted(true)}
              >
                Start
              </button>
            </div>
          ) : (
            currentVideoId && (
              <YouTube
                videoId={currentVideoId}
                opts={opts}
                onStateChange={onPlayerStateChange}
              />
            )
          )}

          {/* PROGRESS */}
          <div className="progress-box">
            <h3>Progress: {progress}%</h3>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* STEPS */}
          <div className="steps-container">
            {roadmap.map((step, index) => {
              const isCompleted = watchedSteps.includes(step.id);

              return (
                <div
                  key={step.id}
                  className={`step-card ${
                    isCompleted ? "step-completed" : ""
                  }`}
                  onClick={() => handleStepClick(index)}
                >
                  <h4>
                    {isCompleted ? "✔" : index + 1}. {step.title}
                  </h4>
                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>

          {/* COMPLETED */}
          {isCourseCompleted && (
            <h3 className="completed-text">
              🎓 Course Completed
            </h3>
          )}

        </div>
      </div>
    </div>
  );
}

export default Roadmap;
