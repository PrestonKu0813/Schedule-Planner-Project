import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./contexts/UserContext.jsx";
import { ScheduleProvider } from "./contexts/ScheduleContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ScheduleProvider>
        <App />
      </ScheduleProvider>
    </UserProvider>
  </StrictMode>
);
