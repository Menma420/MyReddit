import React, {useState, useContext} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const {setAuthState} = useContext(AuthContext);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username cannot exceed 15 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password cannot exceed 16 characters")
      .required("Password is required"),
  });

  // The login function where resetForm is passed and used
  const login = (values, { resetForm }) => {
    axios
      .post("http://localhost:4000/auth/login", values)
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data);
          setAuthState(true);
          console.log("Successful!");
          navigate("/"); // Redirect after successful login
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("Login failed. Please try again.");
        resetForm(); // Reset form fields after failure
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <div className="formContainer"> 
        <Formik
          initialValues={initialValues}
          onSubmit={login}
          validationSchema={validationSchema}
        >
          {({ resetForm }) => (
            <Form>
              <label>Username: </label>
              <ErrorMessage name="username" component="span" className="error-message" />
              <Field
                id="inputUsername"
                name="username"
                placeholder="(Ex. KelaKumar)"
              />

              <label>Password: </label>
              <ErrorMessage name="password" component="span" className="error-message" />
              <Field
                id="inputPassword"
                name="password"
                type="password"
                placeholder="Your password"
              />

              <button className="loginSubmit" type="submit">Login</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
