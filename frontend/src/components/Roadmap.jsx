import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";

import courses from "../Data/CourseData";
import { generatePersonalizedRoadmap } from "../utils/roadmapGenerator";
import "./Roadmap.css";

// Safe import resolver wrapper for YouTube component in Vite/React 19 ESM environments
const YouTubeComponent = typeof YouTube === "function" ? YouTube : (YouTube.default || YouTube);

function Roadmap() {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = courses.find((item) => item.id === Number(id));

  const [roadmap, setRoadmap] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(null); // null means show Roadmap Overview first
  const [watchedSteps, setWatchedSteps] = useState([]);
  const [videoStarted, setVideoStarted] = useState(false);
  const [learningGoal, setLearningGoal] = useState("");
  const [videoError, setVideoError] = useState(false);
useEffect(() => {
  const loadRoadmap = async () => {
    const enrolledCourses =
      JSON.parse(localStorage.getItem("enrolledCourses")) || [];

    const saved = enrolledCourses.find((c) => c.id == id);

    if (!saved) return;

    setLearningGoal(saved.learningGoal || "");
    setWatchedSteps(saved.watchedSteps || []);

    let savedRoadmap = saved.roadmap;

    // 🔥 FIX: invalid roadmap safety check
    if (!Array.isArray(savedRoadmap) || savedRoadmap.length === 0) {
      savedRoadmap = await generatePersonalizedRoadmap(
        Number(id),
        saved.learningGoal || "Skill Improvement"
      );

      const updatedEnrolled = enrolledCourses.map((c) =>
        c.id == id ? { ...c, roadmap: savedRoadmap } : c
      );

      localStorage.setItem(
        "enrolledCourses",
        JSON.stringify(updatedEnrolled)
      );
    }

    // 🔥 FINAL SAFETY
    setRoadmap(Array.isArray(savedRoadmap) ? savedRoadmap : []);
  };

  loadRoadmap();
}, [id]);

  // When step changes, reset error state and load its configuration
  useEffect(() => {
    setVideoError(false);
  }, [currentStepIndex]);

  if (!course) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-container">
          <h2>Loading course...</h2>
        </div>
      </div>
    );
  }

  if (roadmap.length === 0) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-container">
          <h2>Generating your personalized roadmap...</h2>
        </div>
      </div>
    );
  }

  // Calculate progress based on how many steps of the CURRENT roadmap are completed
  const safeRoadmap = Array.isArray(roadmap) ? roadmap : [];

const completedCount = safeRoadmap.filter((step) =>
  watchedSteps.includes(step.id)
).length;
  const progress =
    safeRoadmap.length > 0
      ? Math.round((completedCount / safeRoadmap.length) * 100)
      : 0;

  const isCourseCompleted = roadmap.length > 0 && completedCount === roadmap.length;

  const updateProgress = (newWatched, index) => {
    const enrolledCourses =
      JSON.parse(localStorage.getItem("enrolledCourses")) || [];

    const updated = enrolledCourses.map((c) => {
      if (c.id == id) {
        const currentCompleted = roadmap.filter((step) => newWatched.includes(step.id)).length;
        const newProgress = roadmap.length > 0 ? Math.round((currentCompleted / roadmap.length) * 100) : 0;
        return {
          ...c,
          watchedSteps: newWatched,
          currentStepIndex: index !== null ? index : c.currentStepIndex,
          progress: newProgress,
        };
      }
      return c;
    });

    localStorage.setItem("enrolledCourses", JSON.stringify(updated));
  };

  const currentStep = currentStepIndex !== null ? (roadmap?.[currentStepIndex] || null) : null;

  const currentVideoId =
    currentStep?.video ||
    currentStep?.videoUrl ||
    course?.video ||
    "dQw4w9WgXcQ"; // Definite fallback

  const onPlayerStateChange = (event) => {
    // 0 is PlayerState.ENDED
    if (event.data === 0 && currentStep) {
      if (!watchedSteps.includes(currentStep.id)) {
        const newWatched = [...watchedSteps, currentStep.id];
        setWatchedSteps(newWatched);
        updateProgress(newWatched, currentStepIndex);
      }
    }
  };

  const onPlayerError = (event) => {
    console.error("YouTube Player Error Callback:", event);
    setVideoError(true);
  };

  const handleStepClick = (index) => {
    if (!roadmap[index]) return;

    setCurrentStepIndex(index);
    setVideoStarted(true); // Auto-start when step is clicked
    updateProgress(watchedSteps, index);
  };

  // Dynamically assign simple durations based on goal
  const getDuration = (index) => {
    if (learningGoal === "1 Hour Quick Learning") {
      return "30 mins";
    }
    const durations = ["1.5 hours", "2.0 hours", "1.0 hour", "2.5 hours", "1.5 hours"];
    return durations[index % durations.length];
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: { autoplay: 1, rel: 0 },
  };

  const handlePrintCertificate = () => {
    if (!isCourseCompleted) {
      alert("Please complete all topics to unlock your certificate!");
      return;
    }

    const email = localStorage.getItem("email") || "student@elearn.com";
    const studentName = email.split("@")[0].toUpperCase();
    const completionDate = new Date().toLocaleDateString();
    const certId = `CERT-${course.id}-${Math.floor(100000 + Math.random() * 900000)}`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${course.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #0f172a;
              color: #f1f5f9;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .certificate-box {
              border: 10px double #475569;
              padding: 50px;
              width: 700px;
              text-align: center;
              background-color: #1e293b;
              box-shadow: 0 4px 15px rgba(0,0,0,0.5);
              border-radius: 8px;
            }
            h1 {
              color: #6c63ff;
              font-size: 32px;
              margin-bottom: 10px;
              letter-spacing: 2px;
            }
            p {
              font-size: 16px;
              color: #94a3b8;
              margin: 12px 0;
            }
            .student-name {
              font-size: 28px;
              font-weight: bold;
              color: #38bdf8;
              margin: 25px 0;
              text-decoration: underline;
            }
            .course-title {
              font-size: 24px;
              font-weight: bold;
              color: #ffffff;
              margin: 15px 0;
            }
            .footer-info {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              color: #64748b;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="certificate-box">
            <p>CERTIFICATE OF COMPLETION</p>
            <p>This is to certify that</p>
            <div class="student-name">${studentName}</div>
            <p>has successfully completed the learning roadmap for</p>
            <div class="course-title">${course.title}</div>
            <p>Focus Goal: ${learningGoal || "General Improvement"}</p>
            <div class="footer-info">
              <div>DATE: ${completionDate}</div>
              <div>CERTIFICATE ID: ${certId}</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // RENDER ROADMAP OVERVIEW
  if (currentStepIndex === null) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-container">
          
          {/* HEADER */}
          <div className="roadmap-header">
            <div className="header-top">
              <button
                className="back-btn"
                onClick={() => navigate(`/course/${id}`)}
              >
                ← Back to Course
              </button>
              <span className="course-badge">Personalized Roadmap</span>
            </div>

            <h2>{course.title}</h2>

            {learningGoal && (
              <div className="goal-info">
                Selected Goal Focus: <strong>{learningGoal}</strong>
              </div>
            )}
          </div>

          <div className="roadmap-main roadmap-overview-grid">
            
            {/* Steps Timeline Grid */}
            <div className="roadmap-content-area">
              <div className="overview-steps-container">
                <h3>Your Learning Path</h3>
                <div className="overview-timeline">
                  {roadmap.map((step, index) => {
                    const isCompleted = watchedSteps.includes(step.id);
                    return (
                      <div key={step.id} className="overview-timeline-item">
                        <div className="timeline-node-sec">
                          <div className={`timeline-number-node ${isCompleted ? "completed" : ""}`}>
                            {isCompleted ? "✓" : index + 1}
                          </div>
                          {index < roadmap.length - 1 && <div className="timeline-connector-line"></div>}
                        </div>
                        <div className={`overview-step-card-detail ${isCompleted ? "completed" : ""}`}>
                          <div className="overview-card-header">
                            <h4>{step.title}</h4>
                            <span className="meta-tag">{getDuration(index)}</span>
                          </div>
                          <p>{step.description}</p>
                          {step.outcome && (
                            <div className="step-outcome">
                              <h5>Target Skill / Outcome</h5>
                              <p>{step.outcome}</p>
                            </div>
                          )}
                          <button
                            className="start-step-action-btn"
                            onClick={() => handleStepClick(index)}
                          >
                            {isCompleted ? "Review Topic" : "Start Learning"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Stats and Actions */}
            <div className="roadmap-sidebar">
              <div className="progress-box">
                <div className="progress-header-text">
                  <h3>Overall Progress</h3>
                  <span className="progress-pct">{progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {isCourseCompleted ? (
                <div className="completed-text-box">
                  <h3>🎓 Course Completed!</h3>
                  <p>You have finished all topics in this roadmap. Unlock your certificate below.</p>
                  <button
                    className="cert-download-btn"
                    onClick={handlePrintCertificate}
                  >
                    Download Certificate (PDF)
                  </button>
                </div>
              ) : (
                <div className="completed-text-box" style={{ borderColor: "#475569", opacity: 0.8 }}>
                  <h3>🎓 Certificate Locked</h3>
                  <p>Complete all {roadmap.length} steps in this roadmap to unlock your certificate of completion.</p>
                  <button
                    className="cert-download-btn"
                    style={{ background: "#475569", cursor: "not-allowed" }}
                    disabled
                  >
                    Locked ({completedCount}/{roadmap.length} Done)
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    );
  }

  // RENDER LESSON & VIDEO PLAYER VIEW
  return (
    <div className="roadmap-page">
      <div className="roadmap-container">

        {/* HEADER */}
        <div className="roadmap-header">
          <div className="header-top">
            <div>
              <button
                className="back-btn"
                onClick={() => setCurrentStepIndex(null)}
                style={{ marginRight: "10px" }}
              >
                ← Back to Roadmap
              </button>
              <button
                className="back-btn"
                onClick={() => navigate(`/course/${id}`)}
              >
                ← Back to Course
              </button>
            </div>
            <span className="course-badge">Learning Lesson</span>
          </div>

          <h2>{course.title}</h2>

          {learningGoal && (
            <div className="goal-info">
              Selected Goal Focus: <strong>{learningGoal}</strong>
            </div>
          )}
        </div>

        <div className="roadmap-main">

          {/* Left Column - Video Display Area */}
          <div className="roadmap-content-area">
            <div className="video-section-wrapper">
              <div className="video-container-box">
                {videoError ? (
                  <div className="video-error-fallback" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <iframe
                      width="100%"
                      height="80%"
                      src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0`}
                      title="YouTube video player fallback"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{ border: "none" }}
                    ></iframe>
                    <div style={{ padding: "8px", background: "#1a1010", textAlign: "center", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#ef4444" }}>If video fails, watch directly:</span>
                      <a
                        href={`https://www.youtube.com/watch?v=${currentVideoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fallback-link-btn"
                        style={{ padding: "4px 10px", fontSize: "12px" }}
                      >
                        Watch on YouTube
                      </a>
                    </div>
                  </div>
                ) : !videoStarted ? (
                  <div className="start-box">
                    <h2>Start Topic Video</h2>
                    <p>Click below to open the lesson and launch the video player.</p>
                    <button
                      className="start-btn"
                      onClick={() => setVideoStarted(true)}
                    >
                      Start Lesson
                    </button>
                  </div>
                ) : (
                  currentVideoId && (
                    <YouTubeComponent
                      videoId={currentVideoId}
                      opts={opts}
                      onStateChange={onPlayerStateChange}
                      onError={onPlayerError}
                    />
                  )
                )}
              </div>
            </div>

            {currentStep && (
              <div className="active-step-details">
                <div className="step-meta-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span className="meta-tag">Topic {currentStepIndex + 1} of {roadmap.length}</span>
                    <span className="meta-tag">Estimated Duration: {getDuration(currentStepIndex)}</span>
                  </div>
                  <div>
                    {watchedSteps.includes(currentStep.id) ? (
                      <span className="meta-tag" style={{ background: "#065f46", color: "#34d399", fontWeight: "bold" }}>✓ Completed</span>
                    ) : (
                      <button
                        onClick={() => {
                          if (!watchedSteps.includes(currentStep.id)) {
                            const newWatched = [...watchedSteps, currentStep.id];
                            setWatchedSteps(newWatched);
                            updateProgress(newWatched, currentStepIndex);
                          }
                        }}
                        style={{
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 12px",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          fontWeight: "bold",
                          transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#2563eb"}
                        onMouseOut={(e) => e.target.style.background = "#3b82f6"}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
                <h3 style={{ marginTop: "15px" }}>{currentStep.title}</h3>
                <p>{currentStep.description}</p>
                {currentStep.outcome && (
                  <div className="step-outcome">
                    <h5>Expected Outcome</h5>
                    <p>{currentStep.outcome}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Timeline Sidebar */}
          <div className="roadmap-sidebar">
            
            {/* Progress Card */}
            <div className="progress-box">
              <div className="progress-header-text">
                <h3>Overall Progress</h3>
                <span className="progress-pct">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Certificate Generation block */}
            {isCourseCompleted ? (
              <div className="completed-text-box">
                <h3>🎓 Course Completed!</h3>
                <p>You have finished all topics in this roadmap. Unlock your certificate below.</p>
                <button
                  className="cert-download-btn"
                  onClick={handlePrintCertificate}
                >
                  Download Certificate (PDF)
                </button>
              </div>
            ) : (
              <div className="completed-text-box" style={{ borderColor: "#475569", opacity: 0.8 }}>
                <h3>🎓 Certificate Locked</h3>
                <p>Complete all {roadmap.length} steps in this roadmap to unlock your certificate of completion.</p>
                <button
                  className="cert-download-btn"
                  style={{ background: "#475569", cursor: "not-allowed" }}
                  disabled
                >
                  Locked ({completedCount}/{roadmap.length} Done)
                </button>
              </div>
            )}

            {/* Vertical timeline of steps */}
            <div className="steps-container">
              {roadmap.map((step, index) => {
                const isCompleted = watchedSteps.includes(step.id);
                const isActive = index === currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`step-card ${isCompleted ? "step-completed" : ""} ${
                      isActive ? "active-card" : ""
                    }`}
                    onClick={() => handleStepClick(index)}
                  >
                    <div className="card-num-circle">
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <div className="card-title-sec">
                      <h4>{step.title}</h4>
                    </div>
                    <div className="status-indicator-dot"></div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Roadmap;
