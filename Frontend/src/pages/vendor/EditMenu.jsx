import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";

export default function EditMenu() {
  const { messId, menuId } = useParams();
  const navigate = useNavigate();

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

        setName(menu.name);
        setPrice(menu.price);
        setMealType(menu.meal_type);
      })
      .catch(() => alert("Failed to load menu"));
  }, [messId, menuId, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    await api.put(`messes/${messId}/menus/${menuId}/`, {
      name,
      price,
      meal_type: mealType,
    });

    navigate(-1);
  };

  return (
  <>
    <VendorHeader />

    <div className="page-container">
      <div className="form-card animate-in">
        <h2>Edit Menu Item</h2>

        <form onSubmit={submit} className="grid-form">

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

          {/* MEAL TYPE */}
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            required
          >
            <option value="">Select Meal</option>
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
