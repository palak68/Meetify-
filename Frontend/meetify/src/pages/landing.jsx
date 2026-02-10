import React from "react";
import "../App.css";
export default function LandingPage() {

    return(
        <div className="landingPageContainer">
          <nav>
            <div className="navHeader">
                <h2>Meetify</h2>
            </div>
             <div className="navlist">

                <p> Join as guest</p>
                <p>register</p>
                <div role="button">
                    <p>login</p>
                </div>
             </div>

          </nav>
          <div className="landingMainContainer">
            <div>
                <h1><span style={{color:"#ff9839"}}>Connect</span> with your loved ones</h1>
              <p>Cover a distance by Meetify</p>
              <div>
               <a href="/home">Get started</a>
              </div>
            </div>
            <div>
                <img src="/mobile.png"/>
            </div>
          </div>

        </div>
    )
}