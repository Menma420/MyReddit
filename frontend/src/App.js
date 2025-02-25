import "./App.css";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import Home from "./Pages/Home";
import CreatePost from "./Pages/CreatePost";
import Post from "./Pages/Post";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";


function App() {

  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:4000/auth/auth', {headers: {
      accessToken: localStorage.getItem("accessToken"),
    } }).then((response) =>{
      if(response.data.error){
        setAuthState(false);
      }
      else{
        setAuthState(true);
      }
    });
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value = {{authState, setAuthState}}>
      <Router>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="navbar-logo">MyReddit</div>
          <div className="navbar-links">
            <NavLink to="/" activeClassName="active-link" className="nav-link">
              Home
            </NavLink>
            <NavLink
              to="/createPost"
              activeClassName="active-link"
              className="nav-link"
            >
              Create A Post
            </NavLink>

            { !authState && (
              <>
            <NavLink
              to="/login"
              activeClassName="active-link"
              className="nav-link"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              activeClassName="active-link"
              className="nav-link"
            >Register
            </NavLink>
            </>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
