import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton"; //

export default function VendorMesses() {
  const [messes, setMesses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/messes/")
      .then(res => setMesses(res.data))
      .catch(() => alert("Failed to load messes"));
  }, []);

  const deleteMess = async (id) => {
    if (!window.confirm("Delete this mess?")) return;
    await api.delete(`/messes/${id}/`);
    setMesses(messes.filter(m => m.id !== id));
  };

  return (
    <div style={pageStyle}>
      <VendorHeader />

      <div style={headerRow}>
        <h2>Your Messes</h2>
        <button style={addBtn} onClick={() => navigate("/vendor/add-mess")}>
          + Add Mess
        </button>
      </div>

      {messes.length === 0 && (
        <p style={{ opacity: 0.7 }}>No messes created yet.</p>
      )}

      <div style={grid}>
        {messes.map(mess => (
          <div key={mess.id} style={card}>
            <div style={imageWrap}>
              <img
                src={
                  mess.image
                    ? mess.image
                    : "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
                }
                alt={mess.name}
                style={image}
              />
            </div>

            <div style={cardBody}>
              <h3 style={{ marginBottom: 6 }}>{mess.name}</h3>
              <p style={muted}>{mess.address}</p>

              <div style={actions}>
                <button
                  style={viewBtn}
                  onClick={() => navigate(`/vendor/${mess.id}/menus`)}
                >
                  View Menus
                </button>
                <button
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

/*  STYLES */

const pageStyle = {
  padding: "20px",
};

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
  transition: "transform .25s ease",
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

const cardBody = {
  padding: 16,
};

const muted = {
  fontSize: 13,
  opacity: 0.7,
  marginBottom: 12,
};

const actions = {
  display: "flex",
  gap: 10,
};

const viewBtn = {
  flex: 1,
  padding: "8px",
  borderRadius: 8,
  border: "none",
  background: "#22c55e",
  color: "#022c22",
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtn = {
  flex: 1,
  padding: "8px",
  borderRadius: 8,
  border: "none",
  background: "#ef4444",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};


const editBtn = {
  flex: 1,
  padding: "8px",
  borderRadius: 8,
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};
