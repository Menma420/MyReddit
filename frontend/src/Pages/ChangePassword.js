import React, {useState} from "react";
import axios from "axios";

function ChangePassword() {

    const [oldPassword, setoldPassword] = useState("");
    const [newPassword, setnewPassword] = useState("");

    const changePassword = () => {
        axios.put("http://localhost:4000/auth/changePassword", {
            oldPassword: oldPassword,
            newPassword: newPassword,
        },{
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then((response) => {
            if(response.data.error){
                alert(response.data.error);
            }else{
                alert("Password updated successfully");
            }
        })
    } 

    return (
        <div>
            <h1>Change Password</h1>
            <label>Old Password:  </label><input type="text" onChange={(event) => {setoldPassword(event.target.value)}} /> <br></br>
            <label>New Password:  </label><input type="text" onChange={(event) => {setnewPassword(event.target.value)}} /> <br></br>
            <button onClick={changePassword}>Save changes</button>
        </div>
    )
}

export default ChangePassword;