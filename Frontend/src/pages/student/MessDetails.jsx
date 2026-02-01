import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "../../App.css";
import BackButton from "../../components/BackButton";

export default function MessDetails() {
  const { messId } = useParams();
  const [mess, setMess] = useState(null);

  useEffect(() => {
    api
      .get(`messes/${messId}/`)
      .then((res) => setMess(res.data))
      .catch(() => alert("Failed to load mess details"));
  }, [messId]);

  if (!mess) return null;

  const menuItems = mess.menu_items || [];
  const meals = ["BREAKFAST", "LUNCH", "DINNER"];

  return (
    <div className="mess-details-page">

      {/* BACK BUTTON */}
      <BackButton />

      {/* HEADER */}
      <h1 className="mess-title">{mess.name}</h1>

      {/* BASIC INFO */}
      <div className="mess-info-grid">
        <div className="info-box">
          <span>Address</span>
          <strong>{mess.address}</strong>
        </div>

        <div className="info-box">
          <span>Location</span>
          <strong>{mess.location}</strong>
        </div>

        <div className="info-box">
          <span>Monthly Price</span>
          <strong>₹{mess.monthly_price}</strong>
        </div>

        <div className="info-box">
          <span>Food Type</span>
          <strong>{mess.food_type}</strong>
        </div>

        <div className="info-box">
          <span>Meals Included</span>
          <strong>{mess.meals_included}</strong>
        </div>
      </div>

      {/* OWNER CONTACT */}
      <div className="details-card">
        <h3 className="section-title">Owner Contact</h3>

        <div className="owner-grid">
          <div>
            <label>Name</label>
            <p>{mess.owner?.name || "Not available"}</p>
          </div>

          <div>
            <label>Email</label>
            <p>{mess.owner?.email || "Not available"}</p>
          </div>

          <div>
            <label>Phone</label>
            <p>{mess.owner?.phone || "Not provided"}</p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="details-card">
        <h3 className="section-title">Mess Menu</h3>

        {menuItems.length === 0 ? (
          <p className="empty-text">No menu added</p>
        ) : (
          <div className="menu-cards three-col">
            {meals.map((meal) => {
              const items = menuItems.filter(
                (item) => item.meal_type === meal
              );

              return (
                <div key={meal} className="menu-card">
                  <h4>{meal}</h4>

                  {items.length === 0 ? (
                    <p className="empty-text">No items</p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="menu-item student-menu"
                      >
                        <span>{item.name}</span>
                        <span className="price">₹{item.price}</span>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
