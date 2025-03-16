import React , {useEffect, useState, useContext} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../helpers/AuthContext";
import {useNavigate} from "react-router-dom";

function Post(){

    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();
    const {authState} = useContext(AuthContext);

    let {id} = useParams();

    useEffect(() => {
        axios.get(`http://localhost:4000/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });

        axios.get(`http://localhost:4000/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, [id]);

    const addComment = () => {
        axios.post("http://localhost:4000/comments", {
            commentBody: newComment,
            PostId: id,
        },{
            headers:{
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then((response) => {
            if(response.data.error){
                alert(response.data.error);
            }else{
                const commentToAdd = {commentBody: newComment, username: response.data.username};
                setComments([...comments, commentToAdd]);
                setNewComment("");
            }
        });
    };

    const deletePost = (id) => {
        axios.delete(`http://localhost:4000/posts/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            },
        }).then(() => {
            alert("Post deleted");
            navigate("/");
        });
    }

    const deleteComment = (id) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        axios.delete(`http://localhost:4000/comments/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            },
        }).then(() => {
           setComments(
            comments.filter((val) => {
                return val.id !== id;
            })
           )
        });
    }

    return (
        <div className='postPage'>
        <div className='leftSide'>
        <div className='title'>{postObject.title}</div>
        <div className='postText'>{postObject.postText}</div>
        <div className='username'>{postObject.username}
            { authState.username === postObject.username && <button onClick={() => {deletePost(postObject.id)}}>Delete Post</button> } </div>
        </div>
        <div className='rightSide'>
            <div className='addCommentContainer'>
                <input type="text" placeholder='Write a comment..' value={newComment} onChange={(event) => {setNewComment(event.target.value)}} />
                <button onClick={addComment}> Add Comment</button>
            </div>
            <div className='listOfComments'>
                {comments.map((comment,key) => {
                    return(
                        <div key={key} className='comment'>
                            {comment.commentBody}
                            <label> Username: {comment.username}</label> 
                            <br />
                            {  authState.username === comment.username && <button onClick={() => {deleteComment(comment.id)}}> X </button>}
                         </div>
                    );
                })}
            </div>
        </div>
        </div>
    ); 

}


export default Post;