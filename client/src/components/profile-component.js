import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import moment from "moment";

const ProfileComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  console.log(currentUser);
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>You must login first before getting your profile.</div>
      )}
      {currentUser && (
        <div>
          <h1>Welcome to {currentUser.user.username} 's profile page</h1>

          {/* <p>
            <strong>Token: {currentUser.token}</strong>
          </p> */}
          <p>
            <strong>Role: {currentUser.user.role}</strong>
          </p>
          <p>
            <strong>ID: {currentUser.user._id}</strong>
          </p>
          <p>
            <strong>E-mail: {currentUser.user.email}</strong>
          </p>
          <p>
            <strong>
              Registered At:{" "}
              {moment(currentUser.user.date).format("YYYY/MM/DD")}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
