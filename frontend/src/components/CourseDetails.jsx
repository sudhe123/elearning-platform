import "./CourseDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import courses from "../Data/CourseData";
import YouTube from "react-youtube";

function CourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const course = courses.find(
    (item) => item.id == Number(id)
  );

  const [videoStarted, setVideoStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!course) {
    return <div>Course not found</div>;
  }

  const handleEnroll = () => {
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (loggedIn !== "true") {
      navigate("/login");
      return;
    }

    setVideoStarted(true);
  };

  const onPlayerStateChange = (event) => {
    
    if (event.data === 0) {
      setCompleted(true);
    }
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="course-details">

    
      <div className="course-left">

        {videoStarted ? (
          course.video ? (
            <YouTube
              videoId={course.video}
              opts={opts}
              onStateChange={onPlayerStateChange}
            />
          ) : (
            <p>Video not found</p>
          )
        ) : (
          <button
            className="enroll-btn"
            onClick={handleEnroll}
          >
            Enroll Now
          </button>
        )}

      </div>

      
      <div className="course-right">

        <h1>{course.title}</h1>

        <p>{course.description}</p>

        <h3>Course Contents</h3>

        <ul>
          {course.contents.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        {videoStarted && (
          <button
            className="complete-btn"
            disabled={!completed}
          >
            {completed
              ? "Lesson Completed 🎉"
              : "Watch Full Video to Unlock"}
          </button>
        )}

      </div>

    </div>
  );
}

export default CourseDetails;