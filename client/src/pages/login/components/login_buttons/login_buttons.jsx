import "./login_buttons.css";
import { useState, useEffect } from "react";

// const backendURL = "http://localhost:3000";

function LoginButtons() {
  const handleLogin = () => {
    window.location.href = "/auth/login";
  };
  return (
    <div>
      <button onClick={handleLogin} className="login_button" id="login">
        Login
      </button>
      <button className="login_button" id="sign_in">
        Sign in
      </button>
    </div>
  );
}
export default LoginButtons;
