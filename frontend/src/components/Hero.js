import React from "react";
import "../styles/Hero.css";

const Hero = ({ onLoginClick }) => {
  return (
    <div className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <img src="/logo.jpg" alt="VoltGrid Logo" className="hero-logo" />
        <h1 className="hero-title">VoltGrid</h1>
        <p className="hero-tagline">Efficient grid management made easy</p>
        <div className="hero-buttons">
          <button className="hero-btn" onClick={onLoginClick}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
