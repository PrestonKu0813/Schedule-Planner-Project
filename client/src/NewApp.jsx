import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
import Home from "./pages/home/Home";

function NewApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/home" element={<Home />} />
        {/* <Route path="*" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default NewApp;
