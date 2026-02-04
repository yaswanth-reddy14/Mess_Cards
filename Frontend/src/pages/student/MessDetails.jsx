import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "../../App.css";
import BackButton from "../../components/BackButton";

const DAYS = [
  { key: "MONDAY", label: "Mon" },
  { key: "TUESDAY", label: "Tue" },
  { key: "WEDNESDAY", label: "Wed" },
  { key: "THURSDAY", label: "Thu" },
  { key: "FRIDAY", label: "Fri" },
  { key: "SATURDAY", label: "Sat" },
  { key: "SUNDAY", label: "Sun" },
];

export default function MessDetails() {
  const { messId } = useParams();
  const [mess, setMess] = useState(null);
  const [selectedDay, setSelectedDay] = useState("MONDAY");

  useEffect(() => {
    api
      .get(`messes/${messId}/`)
      .then((res) => setMess(res.data))
      .catch(() => alert("Failed to load mess details"));
  }, [messId]);

  if (!mess) return null;

  const menuItems = mess.menu_items || [];
  const meals = ["BREAKFAST", "LUNCH", "DINNER"];

  // ✅ day-wise filter (safe)
  const dayMenus = menuItems.filter(
    (item) => item.day === selectedDay
  );

  return (
    <div className="mess-details-page">
      <BackButton />

      {/* HEADER */}
      <div className="mess-header-row">
        <h1 className="mess-title">{mess.name}</h1>

        <span
          className={
            mess.is_open ? "status-badge open" : "status-badge closed"
          }
        >
          {mess.is_open ? "Open" : "Closed"}
        </span>
      </div>

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

      {/* DAY SELECTOR */}
      <div className="day-selector">
        {DAYS.map((day) => (
          <button
            key={day.key}
            onClick={() => setSelectedDay(day.key)}
            className={
              day.key === selectedDay ? "day-btn active" : "day-btn"
            }
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* MENU */}
      <div className="details-card">
        <h3 className="section-title">
          Menu for {selectedDay}
        </h3>

        {dayMenus.length === 0 ? (
          <p className="empty-text">No menu for this day</p>
        ) : (
          <div className="menu-cards three-col">
            {meals.map((meal) => {
              const items = dayMenus.filter(
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
