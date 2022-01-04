import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CourseService from "../services/course.service";

const EnrollComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const history = useHistory();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  let [courseData, setCourseData] = useState(null);
  useEffect(() => {
    console.log("Using effect.");
    CourseService.getAllCourses()
      .then((data) => {
        console.log(data);
        console.log(data.data);
        setCourseData(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleTakeToLogin = () => {
    history.push("/login");
  };
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        console.log(data);
        setSearchResult(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function checkEnrolled(e) {
    let existed = false;
    await CourseService.getEnrolledCourses(currentUser.user._id).then(
      (courses) => {
        for (let i in courses.data) {
          if (e.target.id === courses.data[i]._id) {
            window.alert("already enrolled!");
            existed = true;
          }
        }
      }
    );
    return existed;
  }

  const handleEnroll = (e) => {
    checkEnrolled(e).then((existed) => {
      if (!existed) {
        CourseService.enroll(e.target.id, currentUser.user._id)
          .then(() => {
            window.alert("Done Enrollment");
            history.push("/course");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before searching for courses.</p>
          <button class="btn btn-primary btn-lg" onClick={handleTakeToLogin}>
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "mentor" && (
        <div>
          <h1>Only students can enroll in courses.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "mentee" && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            type="text"
            class="form-control"
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      )}

      {currentUser && courseData && currentUser.user.role == "mentee" && (
        <div>
          <p>Data we got back from API.</p>
          {courseData.map((course) => (
            <div key={course._id} className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>Price: {course.price}</p>
                <p>Student: {course.mentees.length}</p>
                <a
                  href="#"
                  onClick={handleEnroll}
                  className="card-text"
                  className="btn btn-primary"
                  id={course._id}
                >
                  Enroll
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentUser && searchResult && searchResult.length != 0 && (
        <div>
          <p>Data we got back from API.</p>
          {searchResult.map((course) => (
            <div key={course._id} className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>Price: {course.price}</p>
                <p>Student: {course.mentees.length}</p>
                <a
                  href="#"
                  onClick={handleEnroll}
                  className="card-text"
                  className="btn btn-primary"
                  id={course._id}
                >
                  Enroll
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
