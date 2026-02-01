import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button className="back-btn" onClick={() => navigate(-1)}>
      <span className="back-arrow">←</span>
      {label}
    </button>
  );
}
