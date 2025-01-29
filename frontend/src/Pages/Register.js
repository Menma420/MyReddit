import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Error state

  const initialValues = {
    username: "",
    password: "",
  };

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

  function onSubmit(data, { resetForm }) {
    axios
      .post("http://localhost:4000/auth", data)
      .then(() => {
        alert("✅ Registration successful!");
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          setError(error.response.data.error); // Set error message
        } else {
          setError("❌ Something went wrong. Please try again.");
          console.error("Unexpected error:", error);
        }

        resetForm(); // Reset form fields after error
      });
  }

  return (
    <div>
      <h1>Register</h1>
      <div className="formContainer">
        {error && <div className="error">{error}</div>} {/* Show error message */}

        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {/* Formik's render function will receive helpers, including resetForm */}
          {({ resetForm }) => (
            <Form>
              <label>Username: </label>
              <ErrorMessage name="username" component="span" className="error-message" />
              <Field id="inputCreatePost" name="username" placeholder="(Ex. KelaKumar)" />

              <label>Password: </label>
              <ErrorMessage name="password" component="span" className="error-message" />
              <Field id="inputCreatePost" name="password" type="password" placeholder="Create password" />

              <button type="submit">Register</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;
