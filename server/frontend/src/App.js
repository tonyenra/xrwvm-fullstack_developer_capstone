import { Routes, Route, Navigate } from "react-router-dom";
import LoginPanel from "./components/Login/Login";
import Register   from "./components/Register/Register";
import Home      from "./components/Home/Home";   // crea algo simple por ahora

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/login"     element={<LoginPanel />} />
      <Route path="/register"  element={<Register />} />
      {/* catch-all opcional */}
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  );
}
