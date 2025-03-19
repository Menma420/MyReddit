import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function ProfilePage() {

    let { id } = useParams();
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const navigate = useNavigate();
    const {authState} = useContext(AuthContext);

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

            {
                (authState.username === username) && (
                <div className="button">
                    <button onClick={() => navigate('/changePassword')}>Change Password</button>
                </div>)
            }

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