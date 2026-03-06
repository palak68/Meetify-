import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {

  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/home");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Meetify</h2>
        </div>

        <div className="navlist">

          <p onClick={() => navigate("/aljk23")}>
            Join as Guest
          </p>

          <p onClick={handleGetStarted}>
            Register
          </p>

          <div role="button" onClick={() => navigate("/auth")}>
            <p>Login</p>
          </div>

        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#ff9839" }}>Connect</span> with your loved ones
          </h1>
          <p>Cover a distance by Meetify</p>

          <div>
            <button onClick={handleGetStarted} style={{ backgroundColor: "#ff9839" }}>
              Get Started
            </button>
          </div>
        </div>

        <div>
          <img src="/mobile.png" alt="mobile" />
        </div>
      </div>

    </div>
  );
}