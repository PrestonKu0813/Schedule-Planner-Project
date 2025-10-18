const backendURL = import.meta.env.VITE_BACKEND_URL;
import "./save_button.css";

function LogoutButton() {
  return (
    <button
      className="button_container"
      onClick={() => {
        fetch(backendURL + "/auth/logout", {
          method: "GET",
          credentials: "include",
        })
          .then((res) => {
            if (res.ok) {
              window.location.href = "/login"; // Manually redirect after logout
            } else {
              console.error("Logout failed");
            }
          })
          .catch((err) => {
            console.error("Logout error:", err);
          });
      }}
    >
      Logout
    </button>
  );
}
export default LogoutButton;
