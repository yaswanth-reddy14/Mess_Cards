import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton";

export default function EditMenu() {
  const { messId, menuId } = useParams();
  const navigate = useNavigate();

  const [day, setDay] = useState("MONDAY");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mealType, setMealType] = useState("");

  useEffect(() => {
    api
      .get(`messes/${messId}/menus/`)
      .then((res) => {
        const menu = res.data.find((m) => m.id === menuId);
        if (!menu) {
          alert("Menu not found");
          navigate(-1);
          return;
        }

        setDay(menu.day);
        setName(menu.name);
        setPrice(menu.price);
        setMealType(menu.meal_type);
      })
      .catch(() => alert("Failed to load menu"));
  }, [messId, menuId, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    await api.put(`messes/${messId}/menus/${menuId}/`, {
      day,                 // ✅ FIX
      name,
      price,
      meal_type: mealType,
    });

    navigate(-1);
  };

  return (
    <>
      <VendorHeader />
      <BackButton />

      <div className="page-container">
        <div className="form-card animate-in">
          <h2>Edit Menu Item</h2>

          <form onSubmit={submit} className="grid-form">
            {/* DAY */}
            <select value={day} onChange={(e) => setDay(e.target.value)} required>
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
              <option value="SATURDAY">Saturday</option>
              <option value="SUNDAY">Sunday</option>
            </select>

            <input
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              required
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
            </select>

            <button className="primary-btn" type="submit">
              Update Menu
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
