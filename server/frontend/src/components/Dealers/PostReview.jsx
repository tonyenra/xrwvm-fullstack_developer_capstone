import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../Header/Header";

export default function PostReview() {
  const { id } = useParams();            // dealer id
  const navigate = useNavigate();
  const isLogged = Boolean(sessionStorage.getItem("username"));

  const [dealer, setDealer] = useState(null);
  const [cars, setCars] = useState([]);
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [review, setReview] = useState("");
  const [err, setErr] = useState("");

  // Nombre del usuario a mostrar
  const defaultName = (() => {
    const fn = sessionStorage.getItem("firstname");
    const ln = sessionStorage.getItem("lastname");
    if (fn && ln && fn !== "null" && ln !== "null" && fn !== "" && ln !== "")
      return `${fn} ${ln}`;
    return sessionStorage.getItem("username") || "";
  })();
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (!isLogged) {
      navigate("/login", { replace: true });
      return;
    }
    // dealer
    fetch(`/djangoapp/dealer/${id}/`)
      .then(r => r.json())
      .then(j => {
        if (j.status === 200) {
          const d = Array.isArray(j.dealer) ? j.dealer[0] : j.dealer;
          setDealer(d);
        }
      });

    // autos
    fetch(`/djangoapp/get_cars/`)
      .then(r => r.json())
      .then(j => {
        if (j.CarModels) setCars(j.CarModels);
      });
  }, [id, isLogged, navigate]);

  const makes = [...new Set(cars.map(c => c.CarMake))];
  const filteredModels = cars.filter(c => c.CarMake === carMake);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!review.trim() || !carMake || !carModel || !carYear || !purchaseDate) {
      setErr("Todos los campos son obligatorios.");
      return;
    }

    const payload = {
      name,
      dealership: parseInt(id, 10),
      review,
      purchase: true,
      purchase_date: purchaseDate,
      car_make: carMake,
      car_model: carModel,
      car_year: parseInt(carYear, 10),
    };

    try {
      const res = await fetch(`/djangoapp/add_review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === 200) {
        navigate(`/dealer/${id}`, { replace: true });
      } else {
        setErr(data.message || "Error al publicar la reseña");
      }
    } catch {
      setErr("Error de red");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ margin: "2rem" }}>
        <h1>{dealer ? dealer.full_name : "Cargando..."}</h1>
        <p><Link to={`/dealer/${id}`}>Volver a reviews</Link></p>

        <form onSubmit={handleSubmit} className="review-form">
          <label>
            Nombre:
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Review:
            <textarea
              cols="50"
              rows="5"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </label>

          <label>
            Fecha de compra:
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </label>

          <label>
            Marca:
            <select
              value={carMake}
              onChange={(e) => {
                setCarMake(e.target.value);
                setCarModel("");
              }}
              required
            >
              <option value="" disabled hidden>Elige Marca</option>
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>

          <label>
            Modelo:
            <select
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              disabled={!carMake}
              required
            >
              <option value="" disabled hidden>Elige Modelo</option>
              {filteredModels.map(cm => (
                <option key={cm.CarModel} value={cm.CarModel}>{cm.CarModel}</option>
              ))}
            </select>
          </label>

            <label>
              Año:
              <input
                type="number"
                value={carYear}
                min="1990"
                max="2025"
                onChange={(e) => setCarYear(e.target.value)}
                required
              />
            </label>

          {err && <p style={{ color: "red" }}>{err}</p>}

          <button type="submit" className="postreview">Publicar Review</button>
        </form>
      </div>
    </div>
  );
}
