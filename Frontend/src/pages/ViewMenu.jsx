import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ViewMenu() {
  const { messId } = useParams();
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!messId) return;

    api
      .get(`/messes/${messId}/menus/`)
      .then((res) => setMenus(res.data))
      .catch(() => setError("Failed to load menu"));
  }, [messId]);

  return (
    <div>
      <h2>Menus</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {menus.length === 0 && <p>No menus available</p>}

      <ul>
        {menus.map((menu) => (
          <li key={menu.id}>
            <strong>{menu.name}</strong> — ₹{menu.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
