import "./login_buttons.css";
import { useState, useEffect } from "react";

function LoginButtons() {
  return (
    <div>
      <button className="login_button" id="login">
        Login
      </button>
      <button className="login_button" id="sign_in">
        Sign in
      </button>
    </div>
  );
}
export default LoginButtons;
