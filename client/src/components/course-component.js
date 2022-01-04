import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = (props) => {
  let {
    currentUser,
    setCurrentUser,
    courseId,
    setCourseId,
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
  } = props;

  const history = useHistory();
  const handleTakeToLogin = () => {
    history.push("/login");
  };
  let [courseData, setCourseData] = useState(null);
  useEffect(() => {
    console.log("Using effect.");
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
    } else {
      _id = "";
    }

    if (currentUser.user.role == "mentor") {
      CourseService.get(_id)
        .then((data) => {
          console.log(data);
          console.log(data.data);
          setCourseData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.user.role == "mentee") {
      CourseService.getEnrolledCourses(_id)
        .then((data) => {
          console.log(data);
          setCourseData(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleEdit = (courseId, title, description, price) => {
    setTitle(title);
    setDescription(description);
    setPrice(price);
    setCourseId(courseId);
    history.push("/editCourse");
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login before seeing your courses.</p>
          <button
            onClick={handleTakeToLogin}
            className="btn btn-primary btn-lg"
          >
            Take me to login page
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "mentor" && (
        <div>
          <h1>Welcome to mentor's Course page.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "mentee" && (
        <div>
          <h1>Welcome to mentee's Course page.</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div>
          <p>Here's the data we got back from server.</p>
          {courseData.map((course) => (
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>Student Count: {course.mentees.length}</p>

                <p>Price: {course.price}</p>
                <br />
                <button
                  onClick={() => {
                    handleEdit(
                      course._id,
                      course.title,
                      course.description,
                      course.price
                    );
                  }}
                  className="card-text"
                  className="btn btn-primary"
                  id={course._id}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
