import React , {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Post(){

    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

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
                accessToken: sessionStorage.getItem("accessToken"),
            }
        }).then((response) => {
            if(response.data.error){
                alert(response.data.error);
            }else{
                const commentToAdd = {commentBody: newComment};
                setComments([...comments, commentToAdd]);
                setNewComment("");
            }
        });
    };

    return (
        <div className='postPage'>
        <div className='leftSide'>
        <div className='title'>{postObject.title}</div>
        <div className='postText'>{postObject.postText}</div>
        <div className='username'>{postObject.username}</div>
        </div>
        <div className='rightSide'>
            <div className='addCommentContainer'>
                <input type="text" placeholder='Write a comment..' value={newComment} onChange={(event) => {setNewComment(event.target.value)}} />
                <button onClick={addComment}> Add Comment</button>
            </div>
            <div className='listOfComments'>
                {comments.map((comment,key) => {
                    return(
                        <div key={key} className='comment'>{comment.commentBody}</div>
                    );
                })}
            </div>
        </div>
        </div>
    ); 

}


export default Post;