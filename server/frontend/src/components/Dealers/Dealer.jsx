import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../Header/Header";

export default function Dealer() {
  const { id } = useParams();              // el lab usa :id
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  useEffect(() => {
    const load = async () => {
      try {
        // detalles del dealer
        const dRes = await fetch(`/djangoapp/dealer/${id}/`);
        const dJson = await dRes.json();
        if (dJson.status === 200) {
          const d = Array.isArray(dJson.dealer) ? dJson.dealer[0] : dJson.dealer;
          setDealer(d);
        }
        // reviews
        const rRes = await fetch(`/djangoapp/reviews/dealer/${id}/`);
        const rJson = await rRes.json();
        if (rJson.status === 200 && Array.isArray(rJson.reviews)) {
          setReviews(rJson.reviews);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div><Header/><p>Cargando...</p></div>;
  if (!dealer) return <div><Header/><p>No se encontró el dealer.</p></div>;

  return (
    <div>
      <Header />
      <div style={{ margin: "2rem" }}>
        <h1>{dealer.full_name}</h1>
        <p>
          <strong>City:</strong> {dealer.city} | <strong>Address:</strong> {dealer.address} |{" "}
          <strong>Zip:</strong> {dealer.zip} | <strong>State:</strong> {dealer.state}
        </p>

        {isLoggedIn && (
          <p>
            <Link to={`/postreview/${dealer.id}/`} className="postreview">
              Post Review
            </Link>
          </p>
        )}

        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No hay reviews.</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reviews.map((r, i) => (
            <li key={i} style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
              <p><strong>{r.name}</strong></p>
              <p>{r.review}</p>
              {r.sentiment && <p><em>Sentiment: {r.sentiment}</em></p>}
            </li>
          ))}
        </ul>

        <p><Link to="/dealers/">← Volver</Link></p>
      </div>
    </div>
  );
}
