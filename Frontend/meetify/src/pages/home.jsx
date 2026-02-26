import withAuth from "../utils/withAuth";
import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import RestoreIcon from '@mui/icons-material/Restore';

function HomeComponent(){
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = React.useState("");
   const {  addToUserHistory } = React.useContext(AuthContext);
    let handleJoinVedioCall = async () =>{
       await addToUserHistory(meetingCode);
      
       navigate(`/${meetingCode}`)
    }

     return(
        <div className="navBar">
            <div 
style ={{display:"flex", justifyContent:"center", alignItems:"center"}}>

    <h3>Meetify</h3>
</div>
 <div style={{display:"flex",alignItems:"center"}}>
    <IconButton>
        <RestoreIcon/>
        
    </IconButton><p>History</p>
    <Button onClick={()=>{
        localStorage.removeItem("token");
        navigate("/auth");
    }}>
        Logout
    </Button>

 </div>
<div className="meetContainer">
            <div className="leftPanel">
                <div>
                    <h2>Providing Quality VedioCall</h2>
                    <div style={{display:"flex", gap:"10px" }}>

                        <textFeild onChange={(e) => setMeetingCode(e.target.value)}></textFeild>
 <Button onClick={handleJoinVedioCall} variant = 'contained' >Join</Button>
                    </div>
                </div>
            </div>

            <div className="rightPanel">
                <img srcSet="/logo3.png" alt =""></img>
            </div>
        </div>
        </div>
        
    )
}


export default withAuth(HomeComponent);