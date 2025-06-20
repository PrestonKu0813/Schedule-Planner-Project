function LogoutButton() {
  return (
    <div>
      <button
        className="absolute top-0 right-[45%]"
        onClick={() => {
          fetch("/auth/logout", {
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
    </div>
  );
}
export default LogoutButton;
