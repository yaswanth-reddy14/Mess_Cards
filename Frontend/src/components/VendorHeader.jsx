import { useNavigate } from "react-router-dom";

export default function VendorHeader() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="vendor-header">
      <h1>Mess Cards</h1>

      <div className="vendor-actions">
        <button className="ghost-btn" onClick={() => navigate("/vendor")}>
          Dashboard
        </button>
        <button className="danger-btn" onClick={logout}>
          Logout
        </button>
        <button className="btn-secondary" onClick={() => navigate("/vendor/profile")}>
          Profile
        </button>
      </div>
    </header>
  );
}
