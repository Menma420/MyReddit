import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Home(){

    const navigate = useNavigate();

    const [listofPosts, setListofPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:4000/posts',{
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
          console.log(response.data);
          setListofPosts(response.data.listofPosts);
          setLikedPosts(response.data.likedPosts.map((like) => {
            return like.PostId;
          }));
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
                setLikedPosts([...likedPosts, PostId]);
                return { ...post, Likes: [...post.Likes, 0] }; 
              } else {
                setLikedPosts(likedPosts.filter((id) => id !== PostId));
                return { ...post, Likes: post.Likes.slice(0, -1) }; 
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
            {likedPosts.includes(value.id) ? 
              <FavoriteIcon onClick={() => likePost(value.id)} />  :
             <FavoriteBorderIcon onClick={() => likePost(value.id)} />
          }
            
          
            <label>{value.Likes.length}</label> </div>
          </div>
        ); 
      })}
        </div>
    );
}

export default Home;