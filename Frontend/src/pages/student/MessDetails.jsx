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
const MEAL_ORDER = ["BREAKFAST", "LUNCH", "DINNER"];

const prettyLabel = (value) =>
  String(value || "")
    .toLowerCase()
    .replace("_", " ")
    .replace(/^./, (char) => char.toUpperCase());

const getPlanCellItems = (plan, day, mealType) => {
  if (!Array.isArray(plan.items)) return [];
  return plan.items
    .filter((item) => item.day === day && item.meal_type === mealType)
    .map((item) => item.name)
    .filter(Boolean);
};

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
                <h4 className="plan-name">{plan.name}</h4>
                {plan.description && <p className="plan-desc">{plan.description}</p>}

                <div className="plan-meta">
                  <div className="plan-meta-row">
                    <span className="plan-meta-label">Days</span>
                    <span className="plan-meta-value">
                      {(plan.days || []).map(prettyLabel).join(", ")}
                    </span>
                  </div>
                  <div className="plan-meta-row">
                    <span className="plan-meta-label">Meals</span>
                    <span className="plan-meta-value">
                      {(plan.meals || []).map(prettyLabel).join(", ")}
                    </span>
                  </div>
                  <div className="plan-meta-row">
                    <span className="plan-meta-label">Price</span>
                    <strong className="plan-price">Rs {plan.price}</strong>
                  </div>
                </div>

                {Array.isArray(plan.items) && plan.items.length > 0 && (
                  <div className="plan-schedule-wrap">
                    <div className="plan-schedule-table">
                      <div className="plan-schedule-head day-col">Day</div>
                      {MEAL_ORDER.map((meal) => (
                        <div key={`${plan.id}-head-${meal}`} className="plan-schedule-head">
                          {prettyLabel(meal)}
                        </div>
                      ))}

                      {DAYS.filter((day) => (plan.days || []).includes(day.key)).map((day) => (
                        <div key={`${plan.id}-${day.key}-row`} className="plan-schedule-row">
                          <div className="plan-schedule-day">
                            {prettyLabel(day.key)}
                          </div>
                          {MEAL_ORDER.map((meal) => {
                            const names = getPlanCellItems(plan, day.key, meal);
                            return (
                              <div
                                key={`${plan.id}-${day.key}-${meal}`}
                                className="plan-schedule-cell"
                              >
                                {names.length > 0 ? names.join(", ") : "—"}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
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
