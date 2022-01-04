import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import HomeComponent from "./components/home-component";
import NavComponent from "./components/nav-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import AuthService from "./services/auth.service";
import CourseComponent from "./components/course-component";
import PostCourseComponent from "./components/postCourse-component";
import EnrollComponent from "./components/enroll-component";
import EditCourseComponent from "./components/editCourse-component";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  let [courseId, setCourseId] = useState("");
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState(0);

  return (
    <div>
      <NavComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Switch>
        <Route path="/" exact>
          <HomeComponent />
        </Route>
        <Route path="/register" exact>
          <RegisterComponent />
        </Route>
        <Route path="/login" exact>
          <LoginComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route path="/profile" exact>
          <ProfileComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route path="/course" exact>
          <CourseComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            courseId={courseId}
            setCourseId={setCourseId}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
          />
        </Route>
        <Route path="/postCourse" exact>
          <PostCourseComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route path="/editCourse" exact>
          <EditCourseComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            courseId={courseId}
            setCourseId={setCourseId}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
          />
        </Route>
        <Route path="/enroll" exact>
          <EnrollComponent
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
