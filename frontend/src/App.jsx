import { Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar.jsx"
import Home from "./components/Home.jsx"
import Testimonial from "./components/Testimonial.jsx"
import Login from "./components/Login.jsx"
import Courses from "./components/Courses.jsx"
import CourseDetails from "./components/CourseDetails.jsx"
import Register from "./components/Register.jsx"
import Dashboard from "./components/Dashboard.jsx"
import About from "./components/About.jsx"
import Certificate from "./components/Certificate";

function App() {

  return (

    <>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <>
              <Home />
              <Testimonial />
            </>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/course/:id"
          element={<CourseDetails />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
        <Route
           path="/dashboard"
           element={<Dashboard />}
        />   
        <Route
           path="/about"
           element={<About />}
        />   
        <Route
  path="/certificate"
  element={<Certificate />}
  />
  

      </Routes>

    </>

  )
}

export default App