// src/components/Home/Home.jsx
import { Navigate } from "react-router-dom";

export default function Home() {
  const username = sessionStorage.getItem("username");

  if (!username) {
    return <Navigate to="/login" replace />;
  }

  return <h1>Bienvenido, {username}!</h1>;
}
