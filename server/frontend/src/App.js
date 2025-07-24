import { Routes, Route, Navigate } from "react-router-dom";
import LoginPanel from "./components/Login/Login";
import Register   from "./components/Register/Register";
import Home      from "./components/Home/Home";   // crea algo simple por ahora
import Dealers from './components/Dealers/Dealers';
import DealerDetail from './components/Dealers/DealerDetail';
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/login"     element={<LoginPanel />} />
      <Route path="/register"  element={<Register />} />
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/dealer/:dealer_id/" element={<DealerDetail />} />
      <Route path="/dealer/:id" element={<Dealer />} />
      <Route path="/postreview/:id" element={<PostReview />} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  );
}
