import axios from "axios";
const APIURL = "http://localhost:8080/api/user";

class AuthService {
  login(email, password) {
    return axios.post(APIURL + "/login", { email, password });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password, role) {
    return axios.post(APIURL + "/register", {
      username,
      email,
      password,
      role,
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
