import "./login_layout.css";
import Buttons from "./components/login_buttons/login_buttons";
import React, { useState } from "react";

export default function Login() {
  return (
    <div className="login_layout_container">
      <div className="side_binder">
        <div className="second_side_binder"></div>
      </div>
      <div className="login_content">
        <div className="title_button_container">
          <div className="title_container">
            <div className="title_rows"></div>
            <div className="title_rows"></div>
          </div>
          <div className="login_button_container">
            <Buttons></Buttons>
          </div>
        </div>
      </div>
    </div>
  );
}
