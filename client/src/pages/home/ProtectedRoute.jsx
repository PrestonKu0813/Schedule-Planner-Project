import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/profile", {
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
