import { useNavigate } from "react-router-dom";
import "../App.css";

export default function StudentHeader() {
  const navigate = useNavigate();

  return (
    <div className="vendor-header">
      <h1>Mess Cards</h1>

      <div className="vendor-actions">
        <button
          className="ghost-btn"
          onClick={() => navigate("/student")}
        >
          Dashboard
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/student/profile")}
        >
          Profile
        </button>

        <button
          className="danger-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
