// src/components/Dealers/Dealers.jsx
import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png";
import { Link } from "react-router-dom";

export default function Dealers() {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates]       = useState([]);

  const LIST_URL  = "/djangoapp/get_dealers/";
  const STATE_URL = "/djangoapp/get_dealers/"; 

  const getDealers = async () => {
    const res = await fetch(LIST_URL);
    if (!res.ok) return console.error("Network error");
    const json = await res.json();
    if (json.status === 200 && Array.isArray(json.dealers)) {
      const all = json.dealers;
      setDealersList(all);
      // extract unique states
      const uniqueStates = Array.from(new Set(all.map(d => d.state)));
      setStates(uniqueStates);
    }
  };

  const filterDealers = async (state) => {
    const url = state === "All"
    ? LIST_URL
    : `${STATE_URL}${encodeURIComponent(state)}/`;
    const res = await fetch(url);
    if (!res.ok) return console.error("Network error");
    const json = await res.json();
    if (json.status === 200 && Array.isArray(json.dealers)) {
      setDealersList(json.dealers);
    }
  };

  useEffect(() => {
    getDealers();
  }, []);

  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  return (
    <div>
      <Header />

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select
                defaultValue=""
                onChange={e => filterDealers(e.target.value)}
              >
                <option value="" disabled hidden>
                  State
                </option>
                <option value="All">All States</option>
                {states.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </th>
            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td>
                <Link to={`/dealer/${dealer.id}`}>{dealer.full_name}</Link>
              </td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state || dealer.st}</td>
              {isLoggedIn && (
                <td>
                  <a href={`/postreview/${dealer.id}`}>
                    <img
                      src={review_icon}
                      className="review_icon"
                      alt="Post Review"
                    />
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
