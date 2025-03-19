import "./App.css";
import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import CreatePost from "./Pages/CreatePost";
import Post from "./Pages/Post";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PageNotFound from "./Pages/PageNotFound";
import ProfilePage from "./Pages/ProfilePage";
import ChangePassword from "./Pages/ChangePassword";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";


function App() {

  const [authState, setAuthState] = useState({username: "", id: 0, status: false});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/auth/auth', {headers: {
      accessToken: localStorage.getItem("accessToken"),
    } }).then((response) =>{
      if(response.data.error){
        setAuthState({...authState, status: false});
      }
      else{
        setAuthState({username: response.data.username, id: response.data.id, status: true});
      }
    });
  }, []);


  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({username: "", id: 0, status: false});
    navigate("/login");
  }

  return (
    <div className="App">
      <AuthContext.Provider value = {{authState, setAuthState}}>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="navbar-logo">MyReddit</div>
          <div className="navbar-links">
            { !authState.status ? (
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
            ) : (

              <>
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
            <h3>{authState.username}</h3>
            <button onClick={logout}>Logout</button>
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
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
