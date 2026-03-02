import React from "react";
import "../App.css";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
const router = useNavigate();
    return(
        <div className="landingPageContainer">
          <nav>
            <div className="navHeader">
                <h2>Meetify</h2>
            </div>
             <div className="navlist">

                <p onClick={() => {
    router("/aljk23")
}}>
    Join as Guest
</p>
                <p onClick={() => {
    router("/auth")
}}>
    Register
</p>
                <div role="button" onClick={() => {
    router("/auth")
}}>
    <p>Login</p>
</div>
             </div>

          </nav>
          <div className="landingMainContainer">
            <div>
                <h1><span style={{color:"#ff9839"}}>Connect</span> with your loved ones</h1>
              <p>Cover a distance by Meetify</p>
              <div>
               <p onClick={() => router("/auth")}>Get Started</p>
              </div>
            </div>
            <div>
                <img src="/mobile.png"/>
            </div>
          </div>

        </div>
    )
}