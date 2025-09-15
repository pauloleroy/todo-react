// src/hooks/useAuth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth(token) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // decodifica JWT
      if (Date.now() >= payload.exp * 1000) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [token, navigate]);
}
