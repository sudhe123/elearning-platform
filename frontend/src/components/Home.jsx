import "./Home.css";
import { Link } from "react-router-dom";
import courses from "../Data/CourseData";

function Home() {

  const homeCourses = courses.filter(
    (course) => course.id <= 3
  );

  return (

    <section className="home">
      <div className="cards-container">

        {homeCourses.map((course) => (

          <div
            className="course-card"
            key={course.id}
          >

            <img
              src={course.image}
              alt={course.title}
            />

            <div className="course-content">

              <h2>{course.title}</h2>

              <p className="rating">
                ⭐ {course.rating}
              </p>

              <p className="price">
                {course.price}
              </p>

              <Link to={`/course/${course.id}`}>

                <button className="explore-btn">
                  Explore Course
                </button>

              </Link>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}

export default Home;