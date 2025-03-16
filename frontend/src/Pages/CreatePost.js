import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);

  const initialValues = {
    title: "",
    postText: "",
    username: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    postText: Yup.string().required("Content is required"),
    // username: Yup.string()
    //   .min(3, "Username must be at least 3 characters")
    //   .max(15, "Username cannot exceed 15 characters")
    //   .required("Username is required"),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:4000/posts", data, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then((response) => {
      console.log(response.data);
      navigate("/");
    }).catch((error) => {
      console.error("Error creating post:", error);
      alert("Failed to create the post. Please try again.");
    });
  };

  return (
    <div className="formContainer">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <label>Title:</label>
          <ErrorMessage name="title" component="span" className="error-message" />
          <Field id="inputCreatePost" name="title" placeholder="Title" />

          <label>Content:</label>
          <ErrorMessage name="postText" component="span" className="error-message" />
          <Field id="inputCreatePost" name="postText" placeholder="Write something..." />

          {/* <label>Username:</label>
          <ErrorMessage name="username" component="span" className="error-message" />
          <Field id="inputCreatePost" name="username" placeholder="(Ex. KelaKumar)" /> */}

          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
