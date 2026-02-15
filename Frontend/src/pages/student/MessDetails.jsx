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

const prettyLabel = (value) =>
  String(value || "")
    .toLowerCase()
    .replace("_", " ")
    .replace(/^./, (char) => char.toUpperCase());

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
  const plans = mess.package_options || [];
  const meals = ["BREAKFAST", "LUNCH", "DINNER"];

  const dayMenus = menuItems.filter((item) => item.day === selectedDay);

  return (
    <div className="mess-details-page">
      <BackButton />

      <div className="mess-header-row">
        <h1 className="mess-title">{mess.name}</h1>
        <span
          className={mess.is_open ? "status-badge open" : "status-badge closed"}
        >
          {mess.is_open ? "Open" : "Closed"}
        </span>
      </div>

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
          <strong>Rs {mess.monthly_price}</strong>
        </div>

        <div className="info-box">
          <span>Food Type</span>
          <strong>{prettyLabel(mess.food_type)}</strong>
        </div>

        <div className="info-box">
          <span>Meals Included</span>
          <strong>{mess.meals_included}</strong>
        </div>
      </div>

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

      <div className="details-card">
        <h3 className="section-title">Available Plans</h3>

        {plans.length === 0 ? (
          <p className="empty-text">No plans available</p>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => (
              <div key={plan.id} className="plan-card">
                <h4>{plan.name}</h4>
                {plan.description && <p className="plan-desc">{plan.description}</p>}

                <div className="plan-meta">
                  <span>Days: {(plan.days || []).map(prettyLabel).join(", ")}</span>
                  <span>Meals: {(plan.meals || []).map(prettyLabel).join(", ")}</span>
                  <strong>Rs {plan.price}</strong>
                </div>

                {Array.isArray(plan.items) && plan.items.length > 0 && (
                  <div className="plan-items-list">
                    {plan.items.map((item, index) => (
                      <div
                        key={`${plan.id}-${item.day}-${item.meal_type}-${item.name}-${index}`}
                        className="plan-item-row"
                      >
                        <span>
                          {prettyLabel(item.day)} | {prettyLabel(item.meal_type)}
                        </span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="day-selector">
        {DAYS.map((day) => (
          <button
            key={day.key}
            onClick={() => setSelectedDay(day.key)}
            className={day.key === selectedDay ? "day-btn active" : "day-btn"}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="details-card">
        <h3 className="section-title">Menu for {prettyLabel(selectedDay)}</h3>

        {dayMenus.length === 0 ? (
          <p className="empty-text">No menu for this day</p>
        ) : (
          <div className="menu-cards three-col">
            {meals.map((meal) => {
              const items = dayMenus.filter((item) => item.meal_type === meal);

              return (
                <div key={meal} className="menu-card">
                  <h4>{prettyLabel(meal)}</h4>

                  {items.length === 0 ? (
                    <p className="empty-text">No items</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="menu-item student-menu">
                        <span>{item.name}</span>
                        <span className="price">Rs {item.price}</span>
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
