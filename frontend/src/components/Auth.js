import React, { useState } from "react";
import "../styles/Login.css";

const Auth = ({ closeAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(null);

    const endpoint = isLogin ? "login" : "register";

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        if (isLogin) {
          // Save username in localStorage
          sessionStorage.setItem("username", user);
          setMessage(data.message);
          setSuccess(true);
          
          // Delay briefly, then redirect to VoltGrid
          setTimeout(() => {
            closeAuth();
            window.location.href = "/";
          }, 1000);
        } else {
          // Successful registration — switch to login view
          setIsLogin(true);
          setUser("");
          setPass("");
          setMessage("Registration successful! Please log in.");
          setSuccess(true);
        }
      } else {
        setMessage(data.message);
        setSuccess(false);
      }
    } catch {
      setMessage("Server error");
      setSuccess(false);
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <button className="login-close" onClick={closeAuth}>×</button>
        <h2 className="login-heading">{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="text" 
            value={user} 
            placeholder="Username" 
            onChange={(e) => setUser(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            value={pass} 
            placeholder="Password" 
            onChange={(e) => setPass(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Log In" : "Register"}
          </button>
        </form>
        <p>
          {isLogin ? "No account?" : "Already have an account?"}{" "}
          <button className="toggle-btn" onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
            setSuccess(null);
          }}>
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
        {message && (
          <p className={success ? "success-message" : "error-message"}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
