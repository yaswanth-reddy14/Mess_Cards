import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton";

export default function AddMenu() {
  const { messId } = useParams();
  const navigate = useNavigate();

  const [day, setDay] = useState("MONDAY"); // 🔥 UI READY (backend later)
  const [mealType, setMealType] = useState("BREAKFAST");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post(`messes/${messId}/menus/`, {
        meal_type: mealType,
        name,
        price,
        // day, ❌ backend not ready yet (will add later)
      });

      navigate(`/vendor/${messId}/menus`);
    } catch {
      setError("Failed to add menu item");
    }
  };

  return (
    <>
      <VendorHeader />
      <BackButton />

      <div className="page-container">
        <div className="form-card animate-in">
          <h2>Add Menu Item</h2>

          {error && <div className="error">{error}</div>}

          <form onSubmit={submit} className="grid-form">
            {/* DAY (UI READY) */}
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
            >
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
              <option value="SATURDAY">Saturday</option>
              <option value="SUNDAY">Sunday</option>
            </select>

            {/* MEAL TYPE */}
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              required
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
            </select>

            {/* ITEM NAME */}
            <input
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* PRICE */}
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <button className="primary-btn" type="submit">
              Add Menu Item
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
