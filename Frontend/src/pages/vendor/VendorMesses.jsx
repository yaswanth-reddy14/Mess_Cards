import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton";
import { toast } from "react-toastify";

// backend base (http://127.0.0.1:8000)
const BACKEND_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe";

export default function VendorMesses() {
  const [messes, setMesses] = useState([]);
  const [togglingId, setTogglingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/messes/")
      .then((res) => setMesses(res.data))
      .catch(() => toast.error("Failed to load messes"));
  }, []);

  const getImageUrl = (image) => {
    if (!image) return FALLBACK_IMAGE;

    // already absolute URL (local / render / prod)
    if (image.startsWith("http")) return image;

    // relative media path
    if (image.startsWith("/media")) return `${BACKEND_URL}${image}`;

    return FALLBACK_IMAGE;
  };

  const deleteMess = async (id) => {
    if (!window.confirm("Delete this mess permanently?")) return;

    try {
      await api.delete(`/messes/${id}/`);
      setMesses((prev) => prev.filter((m) => m.id !== id));
      toast.success("Mess deleted");
    } catch {
      toast.error("Failed to delete mess");
    }
  };

  const toggleStatus = async (id) => {
    if (togglingId === id) return;

    try {
      setTogglingId(id);
      const res = await api.patch(`/messes/${id}/toggle-status/`);

      setMesses((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, is_open: res.data.is_open } : m
        )
      );

      toast.success(res.data.is_open ? "Mess is now Open" : "Mess is now Closed");
    } catch {
      toast.error("Failed to update mess status");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div style={pageStyle}>
      <VendorHeader />
      <BackButton />

      <div style={headerRow}>
        <h2>Your Messes</h2>
        <button style={addBtn} onClick={() => navigate("/vendor/add-mess")}>
          + Add Mess
        </button>
      </div>

      <div style={grid}>
        {messes.map((mess) => (
          <div key={mess.id} style={card}>
            {/* IMAGE */}
            <div style={imageWrap}>
              <img
                src={getImageUrl(mess.image)}
                alt={mess.name}
                style={image}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </div>

            {/* CONTENT */}
            <div style={cardBody}>
              <h3 style={{ marginBottom: 6 }}>{mess.name}</h3>
              <p style={muted}>{mess.address}</p>

              <button
                style={mess.is_open ? openBtn : closedBtn}
                disabled={togglingId === mess.id}
                onClick={() => toggleStatus(mess.id)}
              >
                {mess.is_open ? "Open" : "Closed"}
              </button>

              <div style={actions}>
                <button
                  style={viewBtn}
                  onClick={() => navigate(`/vendor/${mess.id}/menus`)}
                >
                  View Menus
                </button>

                <button
                  style={editBtn}
                  onClick={() => navigate(`/vendor/${mess.id}/edit`)}
                >
                  Edit
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => deleteMess(mess.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* STYLES */

const pageStyle = { padding: "20px" };

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const addBtn = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "linear-gradient(135deg,#6366f1,#4338ca)",
  color: "#fff",
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 20,
};

const card = {
  background: "rgba(15,23,42,0.75)",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
};

const imageWrap = {
  height: 160,
  overflow: "hidden",
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardBody = { padding: 16 };
const muted = { fontSize: 13, opacity: 0.7, marginBottom: 12 };
const actions = { display: "flex", gap: 10 };

const viewBtn = { background: "#22c55e" };
const editBtn = { background: "#3b82f6", color: "#fff" };
const deleteBtn = { background: "#ef4444", color: "#fff" };
const openBtn = { background: "#22c55e" };
const closedBtn = { background: "#ef4444", color: "#fff" };
