import React, { useState, useEffect } from "react";
import "./Login.css";
import Header from "../Header/Header";
import { useNavigate, useLocation } from "react-router-dom";

const Login = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Si entran a la URL principal "/", redirige a /login
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  const login_url = `${window.location.origin}/djangoapp/login`;

  const login = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch(login_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userName: userName,
          username: userName,
          password: password,
        }),
      });

      const json = await res.json();
      console.log("LOGIN RESPONSE:", json);

      if (json.status === "Authenticated") {
        sessionStorage.setItem(
          "username",
          json.userName || json.username || userName
        );
        sessionStorage.setItem("firstname", json.first_name || "");
        sessionStorage.setItem("lastname", json.last_name || "");
        setOpen(false); // luego redirigimos abajo
      } else {
        setErr("The user could not be authenticated.");
      }
    } catch (e) {
      console.error(e);
      setErr("Network error.");
    }
  };

  // Cuando open pasa a false (login ok o cancelar), redirige a /dealers
  if (!open) {
    navigate("/dealers", { replace: true });
    return null;
  }

  return (
    <div>
      <Header />
      <div onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} className="modalContainer">
          <form className="login_panel" onSubmit={login}>
            <div>
              <span className="input_field">Username </span>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input_field"
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div>
              <span className="input_field">Password </span>
              <input
                name="psw"
                type="password"
                placeholder="Password"
                className="input_field"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {err && <p style={{ color: "red" }}>{err}</p>}
            <div>
              <input className="action_button" type="submit" value="Login" />
              <input
                className="action_button"
                type="button"
                value="Cancel"
                onClick={() => setOpen(false)}
              />
            </div>
            <a className="loginlink" href="/register">
              Register Now
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
