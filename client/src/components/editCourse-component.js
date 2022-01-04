import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import CourseService from "../services/course.service";

const EditCourseComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  let { courseId, setCourseId } = props;
  let { title, setTitle } = props;
  let { description, setDescription } = props;
  let { price, setPrice } = props;

  let [message, setMessage] = useState("");
  const history = useHistory();
  const handleTakeToLogin = () => {
    history.push("/login");
  };
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeDesciption = (e) => {
    setDescription(e.target.value);
  };
  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };
  const editCourse = () => {
    CourseService.edit(courseId, title, description, price)
      .then(() => {
        window.alert("Course has been edited.");
        history.push("/course");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before posting a new course.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role !== "mentor" && (
        <div>
          <p>Only mentors can edit courses.</p>
        </div>
      )}
      {currentUser && currentUser.user.role == "mentor" && (
        <div className="form-group">
          <label for="exampleforTitle">Title</label>
          <input
            name="title"
            type="text"
            className="form-control"
            id="exampleforTitle"
            onChange={handleChangeTitle}
            value={title}
          />
          <br />
          <label for="exampleforContent">Content</label>
          <textarea
            className="form-control"
            id="exampleforContent"
            aria-describedby="emailHelp"
            name="content"
            onChange={handleChangeDesciption}
            value={description}
          />
          <br />
          <label for="exampleforPrice">Price</label>
          <input
            name="price"
            type="number"
            className="form-control"
            id="exampleforPrice"
            onChange={handleChangePrice}
            value={price}
          />
          <br />
          <button className="btn btn-primary" onClick={editCourse}>
            Edit
          </button>
          <br />
          <br />
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditCourseComponent;
