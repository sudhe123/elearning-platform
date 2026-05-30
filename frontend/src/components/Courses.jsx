import "./Courses.css";
import { Link } from "react-router-dom";
import courses from "../Data/CourseData";

function Courses() {
  return (
    <section className="courses">

      <div className="cards-container">

        {courses.map((course) => (
          <Link
            to={`/course/${course.id}`}
            className="course-link"
            key={course.id}
          >

            <div className="course-card">

              <img
                src={course.image}
                alt={course.title}
                className="course-img"
              />

              <div className="course-content">

                <h2 className="course-title">
                  {course.title}
                </h2>

                <p className="rating">
                  ⭐ {course.rating}
                </p>

                <button className="enroll-btn">
                  View Course
                </button>

              </div>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}

export default Courses;