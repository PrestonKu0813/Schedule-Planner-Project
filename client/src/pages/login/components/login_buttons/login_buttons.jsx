import "./login_buttons.css";
const backendURL = import.meta.env.VITE_BACKEND_URL;

function LoginButtons() {
  const handleLogin = () => {
    window.location.href = backendURL + "/auth/login";
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
