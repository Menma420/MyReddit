import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

function Home(){

    const navigate = useNavigate();

    const [listofPosts, setListofPosts] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:4000/posts').then((response) => {
          console.log(response.data);
          setListofPosts(response.data);
      });
    }, []);

    const likePost = (PostId) => {
      axios.post("http://localhost:4000/likes", 
        { PostId: PostId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListofPosts((prevPosts) => 
          prevPosts.map((post) => {
            if (post.id === PostId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };  // Add a like
              } else {
                return { ...post, Likes: post.Likes.slice(0, -1) }; // Remove a like safely
              }
            }
            return post;
          })
        );
      })
      .catch((error) => {
        console.error("Error liking post:", error);
        alert("Failed to like the post. Please try again.");
      });
    };
    
    

    return (
        <div>
             {listofPosts.map((value,key) => {
        return (
          <div className="post">
            <div className="title">{value.title}</div>
            <div className="body" onClick={() => {
            navigate(`/post/${value.id}`);
          }}>{value.postText}</div>
            <div className="footer">{value.username} 
            <button onClick={() => {likePost(value.id)}}> Like </button> 
            <label>{value.Likes.length}</label> </div>
          </div>
        ); 
      })}
        </div>
    );
}

export default Home;