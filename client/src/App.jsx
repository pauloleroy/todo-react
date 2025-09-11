import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dash from "./pages/Dash";

function App() {
  // Checa token direto no localStorage
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard protegido */}
      <Route
        path="/dashboard"
        element={token ? <Dash /> : <Navigate to="/login" />}
      />

      {/* Qualquer outra rota */}
      <Route
        path="*"
        element={<Navigate to={token ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
