import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton";
import { toast } from "react-toastify";

// backend root (http://127.0.0.1:8000 OR render url)
const BACKEND_ROOT = import.meta.env.VITE_API_URL.replace("/api", "");

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe";

export default function VendorMesses() {
  const [messes, setMesses] = useState([]);
  const [togglingId, setTogglingId] = useState(null);

  // delete modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/messes/")
      .then((res) => setMesses(res.data))
      .catch(() => toast.error("Failed to load messes"));
  }, []);

  // resolve image safely
  const resolveImage = (image) => {
    if (!image) return FALLBACK_IMAGE;
    if (typeof image === "string" && image.startsWith("http")) return image;
    if (typeof image === "string" && image.startsWith("/media"))
      return `${BACKEND_ROOT}${image}`;
    return FALLBACK_IMAGE;
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
      toast.success(res.data.is_open ? "Mess is Open" : "Mess is Closed");
    } catch {
      toast.error("Failed to update mess status");
    } finally {
      setTogglingId(null);
    }
  };

  // REAL DELETE (called after confirm)
  const confirmDelete = async () => {
    try {
      await api.delete(`/messes/${deletingId}/`);
      setMesses((prev) => prev.filter((m) => m.id !== deletingId));
      toast.success("Mess deleted successfully");
    } catch {
      toast.error("Failed to delete mess");
    } finally {
      setShowDeleteConfirm(false);
      setDeletingId(null);
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
                src={resolveImage(mess.image)}
                alt={mess.name}
                style={image}
                loading="lazy"
                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
              />
            </div>

            {/* CONTENT */}
            <div style={cardBody}>
              <h3>{mess.name}</h3>
              <p style={muted}>{mess.address}</p>

              {/* STATUS */}
              <button
                style={mess.is_open ? openBtn : closedBtn}
                disabled={togglingId === mess.id}
                onClick={() => toggleStatus(mess.id)}
              >
                {mess.is_open ? "Open" : "Closed"}
              </button>

              {/* ACTIONS */}
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
                  onClick={() => {
                    setDeletingId(mess.id);
                    setShowDeleteConfirm(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*  DELETE CONFIRM MODAL (SAME AS PROFILE) */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-card danger">
            <h3>Delete Mess</h3>
            <p>
              This action is <strong>permanent</strong>.  
              This mess and all its menus will be deleted.
            </p>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingId(null);
                }}
              >
                Cancel
              </button>

              <button className="btn-danger" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES  */

const pageStyle = { padding: 20 };

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
  flexWrap: "wrap",
  gap: 10,
};

const addBtn = {
  padding: "10px 16px",
  borderRadius: 12,
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
  background: "#0f172a",
  borderRadius: 18,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
};

const imageWrap = {
  height: 170,
  width: "100%",
  overflow: "hidden",
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const cardBody = {
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const muted = {
  fontSize: 13,
  opacity: 0.7,
};

const actions = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 10,
};

const viewBtn = {
  padding: "8px",
  borderRadius: 10,
  border: "none",
  background: "#22c55e",
  color: "#022c22",
  fontWeight: 600,
  cursor: "pointer",
};

const editBtn = {
  padding: "8px",
  borderRadius: 10,
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtn = {
  padding: "8px",
  borderRadius: 10,
  border: "none",
  background: "#ef4444",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const openBtn = {
  width: "100%",
  background: "#22c55e",
  border: "none",
  padding: "6px",
  borderRadius: 20,
  fontWeight: 700,
  cursor: "pointer",
};

const closedBtn = {
  width: "100%",
  background: "#ef4444",
  border: "none",
  padding: "6px",
  borderRadius: 20,
  fontWeight: 700,
  cursor: "pointer",
};
