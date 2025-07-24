import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const Header = () => {
  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();
    const logout_url = `${window.location.origin}/djangoapp/logout`;

    try {
      const res = await fetch(logout_url, {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();

      if (json) {
        const username = sessionStorage.getItem("username");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("firstname");
        sessionStorage.removeItem("lastname");
        alert("Logging out " + username + "...");
        navigate("/login", { replace: true });
      } else {
        alert("The user could not be logged out.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error during logout.");
    }
  };

  const curr_user = sessionStorage.getItem("username");

  const home_page_items =
    curr_user && curr_user !== "" ? (
      <div className="input_panel">
        <span className="username">{curr_user}</span>
        <button className="nav_item btn btn-link" onClick={logout}>
          Logout
        </button>
      </div>
    ) : (
      <div></div>
    );

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ backgroundColor: "darkturquoise", height: "1in" }}
      >
        <div className="container-fluid">
          <h2 style={{ paddingRight: "5%" }}>Dealerships</h2>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  style={{ fontSize: "larger" }}
                  aria-current="page"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  style={{ fontSize: "larger" }}
                  href="/about"
                >
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  style={{ fontSize: "larger" }}
                  href="/contact"
                >
                  Contact Us
                </a>
              </li>
            </ul>
            <span className="navbar-text">
              <div className="loginlink" id="loginlogout">
                {home_page_items}
              </div>
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
