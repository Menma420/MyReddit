import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

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

  function onSubmit(data) {
    axios.post("http://localhost:4000/auth", data).then((response) => {
      console.log(data);
      navigate("/login"); // Redirect to login page after successful registration
    });
  }

  return (
    <div>
      <h1>Register</h1>
      <div className="createPostPage">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <label>Username: </label>
            <ErrorMessage name="username" component="span" className="error-message" />
            <Field id="inputCreatePost" name="username" placeholder="(Ex. KelaKumar)" />

            <label>Password: </label>
            <ErrorMessage name="password" component="span" className="error-message" />
            <Field id="inputCreatePost" name="password" type="password" placeholder="Create password" />

            <button type="submit">Register</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Register;
