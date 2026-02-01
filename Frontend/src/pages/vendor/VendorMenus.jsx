import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton";

export default function VendorMenus() {
  const { messId } = useParams();
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);

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

  const grouped = { BREAKFAST: [], LUNCH: [], DINNER: [] };

  menus.forEach((menu) => {
    if (grouped[menu.meal_type]) grouped[menu.meal_type].push(menu);
  });

  return (
    <>
      <VendorHeader />

      <div className="page-container vendor-page">
        <BackButton />

        {/* PAGE HEADER */}
        <div className="page-header">
  <div className="page-title">
    <h2>Menus</h2>
  </div>

  <div className="page-actions">
    <button
      className="btn-primary"
      onClick={() => navigate(`/vendor/${messId}/add-menu`)}
    >
      + Add Menu
    </button>
  </div>
</div>


        {/* CONTENT */}
        <div className="menu-cards three-col">
          {["BREAKFAST", "LUNCH", "DINNER"].map((meal) => (
            <div className="menu-card" key={meal}>
              <h3>{meal}</h3>

              {grouped[meal].length === 0 && <p>No items</p>}

              {grouped[meal].map((item) => (
                <div className="menu-item" key={item.id}>
                  <span>
                    {item.name} – ₹{item.price}
                  </span>

                  <div className="menu-actions">
                    <button
                      className="btn-edit"
                      onClick={() =>
                        navigate(`/vendor/${messId}/menu/${item.id}/edit`)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => deleteMenu(item.id)}
                    >
                      🗑️ Delete
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
