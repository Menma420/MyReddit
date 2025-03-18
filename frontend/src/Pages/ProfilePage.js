import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ProfilePage() {

    let { id } = useParams();
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:4000/auth/basicInfo/${id}`)
        .then((response) => {
            setUsername(response.data.username);
        });

        axios.get(`http://localhost:4000/posts/byUser/${id}`)
        .then((response) => {
            setListOfPosts(response.data);
        })

    }, [])

    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                {""}
                <h1>Username : {username}</h1>    
            </div> 

            <div className="listOfPosts">
                {listOfPosts.map((value,key) => {
                    return (
                    <div className="post">
                        <div className="title">{value.title}</div>
                        <div className="body" onClick={() => {
                        navigate(`/post/${value.id}`);
                    }}>{value.postText}</div>
                        <div className="footer">
                            {value.username}
                        <label>{value.Likes.length}</label> </div>
                    </div>
                    ); 
                })}
            </div>
         </div>   
    );
}

export default ProfilePage;