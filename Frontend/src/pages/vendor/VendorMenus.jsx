import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
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

export default function VendorMenus() {
  const { messId } = useParams();
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [selectedDay, setSelectedDay] = useState("MONDAY");

  useEffect(() => {
    api
      .get(`messes/${messId}/menus/`)
      .then((res) => setMenus(res.data))
      .catch(() => alert("Failed to load menus"));
  }, [messId]);

  const deleteMenu = async (menuId) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await api.delete(`messes/${messId}/menus/${menuId}/`);
      setMenus((prev) => prev.filter((m) => m.id !== menuId));
    } catch {
      alert("Delete failed");
    }
  };

  const dayFilteredMenus = menus.filter(
    (m) => !m.day || m.day === selectedDay
  );

  const grouped = { BREAKFAST: [], LUNCH: [], DINNER: [] };
  dayFilteredMenus.forEach((m) => grouped[m.meal_type]?.push(m));

  return (
    <>
      <VendorHeader />

      <div style={page}>
        <BackButton />

        {/* HEADER */}
        <div style={header}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Weekly Menu</h2>
            <p style={subText}>Manage menu items day-wise</p>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate(`/vendor/${messId}/add-menu`)}
          >
            + Add Menu
          </button>
        </div>

        {/* DAY SELECTOR */}
        <div style={daySection}>
          {DAYS.map((day) => (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              style={day.key === selectedDay ? activeDayBtn : dayBtn}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* MENU GRID */}
        <div style={mealGrid}>
          {["BREAKFAST", "LUNCH", "DINNER"].map((meal) => (
            <div style={mealCard} key={meal}>
              <h3 style={mealTitle}>{meal}</h3>

              {grouped[meal].length === 0 && (
                <p style={subText}>No items</p>
              )}

              {grouped[meal].map((item) => (
                <div style={menuRow} key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <div style={price}>₹{item.price}</div>
                  </div>

                  <div style={actions}>
                    <button
                      className="btn-edit"
                      onClick={() =>
                        navigate(`/vendor/${messId}/menu/${item.id}/edit`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => deleteMenu(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: "24px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 28,
};

const subText = {
  fontSize: 14,
  opacity: 0.65,
};

const daySection = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 32,
};

const dayBtn = {
  padding: "6px 14px",
  borderRadius: 20,
  border: "1px solid #334155",
  background: "transparent",
  color: "#cbd5f5",
  cursor: "pointer",
  fontWeight: 600,
};

const activeDayBtn = {
  ...dayBtn,
  background: "#6366f1",
  color: "#fff",
  border: "none",
};

const mealGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: 24,
};

const mealCard = {
  background: "rgba(15,23,42,0.75)",
  padding: 20,
  borderRadius: 18,
};

const mealTitle = {
  marginBottom: 16,
};

const menuRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const price = {
  fontSize: 14,
  opacity: 0.7,
};

const actions = {
  display: "flex",
  gap: 8,
};
