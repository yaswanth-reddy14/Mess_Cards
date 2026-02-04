export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  danger = false,
}) {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ marginBottom: 10 }}>{title}</h3>
        <p style={{ opacity: 0.8 }}>{message}</p>

        <div style={actions}>
          <button style={cancelBtn} onClick={onClose}>
            {cancelText}
          </button>

          <button
            style={danger ? dangerBtn : confirmBtn}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* STYLES */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modal = {
  background: "#0f172a",
  padding: 20,
  borderRadius: 14,
  width: "90%",
  maxWidth: 360,
  boxShadow: "0 20px 40px rgba(0,0,0,.5)",
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 20,
};

const cancelBtn = {
  padding: "8px 14px",
  borderRadius: 8,
  background: "#334155",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const confirmBtn = {
  padding: "8px 14px",
  borderRadius: 8,
  background: "#22c55e",
  color: "#022c22",
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

const dangerBtn = {
  ...confirmBtn,
  background: "#ef4444",
  color: "#fff",
};
