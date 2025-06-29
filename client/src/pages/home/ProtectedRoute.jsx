import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function ProtectedRoute({ children }) {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(backendURL + "/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          setLoading(false);
          setUser(null);
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data) setUser(data);
        setLoading(false);
        console.log(data);
      })
      .catch(() => {
        setLoading(false);
        setUser(null);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  return children;
}
