import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "./Hero";
import Auth from "./Auth";
import "../styles/Landing.css";

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const welcomeRef = useRef(null);
  const navigate = useNavigate();

  const openLogin = () => setShowLogin(true);

  const closeLogin = () => {
    setShowLogin(false);
    const storedUser = sessionStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
      setTimeout(() => {
        welcomeRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("username"); 
    setUsername(""); 
    setShowLogin(false); 
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">VoltGrid</div>
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          {username ? (
            <>
              <li><a href="#projects">Projects</a></li>
              <li><button className="logout-btn" onClick={handleLogout}>Log Out</button></li>
            </>
          ) : null}
          <li><a href="#about">About</a></li>
        </ul>
      </nav>

      {/* Show Hero only when user is not logged in */}
      {!username && <Hero onLoginClick={openLogin} />}

      {username && (
        <div ref={welcomeRef} className="user-welcome">
          <h2 className="welcome-message">Hey, {username}!</h2>
          <button
            className="project-button"
            onClick={() => navigate("/voltgrid")}
          >
            Go to My Project
          </button>
        </div>
      )}

      <motion.section
  id="about"
  className="intro-section about-enhanced"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  viewport={{ once: true }}
>
  <h2 className="about-title">About VoltGrid</h2>
  <div className="about-grid">
    <div className="about-text">
      <p>
        VoltGrid is a <strong>smart energy management platform</strong> that empowers energy
        providers to monitor and control grid performance in real time.
      </p>
      <p>
        Our mission is to <strong>maximize efficiency</strong> and <strong>minimize outages</strong>
        using cutting-edge tools for visualization, prioritization, and optimization.
      </p>
      <p>
        Built for engineers, institutions, and researchers — VoltGrid provides complete control
        over energy distribution with live analytics and node priority management.
      </p>
    </div>

    <div className="about-features">
      <motion.div
        className="feature-card"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        ⚡ <h4>Real-Time Monitoring</h4>
        <p>Track power flows, supply-demand gaps, and outages instantly.</p>
      </motion.div>
      <motion.div
        className="feature-card"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        📊 <h4>Visual Analytics</h4>
        <p>Interactive graphs, node stats, and grid performance reports.</p>
      </motion.div>
      <motion.div
        className="feature-card"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        🧠 <h4>Smart Prioritization</h4>
        <p>Control critical nodes like hospitals & schools with ease.</p>
      </motion.div>
    </div>
  </div>
</motion.section>


      {showLogin && <Auth closeAuth={closeLogin} />}
    </div>
  );
};

export default Landing;
