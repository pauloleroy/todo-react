import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dash from "./pages/Dash";

function App() {
  // pega token salvo no localStorage (se existir)
  const [token, setToken] = useState(localStorage.getItem("token"));

  // toda vez que token mudar → sincroniza no localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <Routes>
      {/* passa setToken pro Login */}
      <Route path="/login" element={<Login setToken={setToken} />} />

      {/* rota protegida */}
      <Route
        path="/dashboard"
        element={token ? <Dash /> : <Navigate to="/login" />}
      />

      {/* fallback */}
      <Route
        path="*"
        element={<Navigate to={token ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default App;

