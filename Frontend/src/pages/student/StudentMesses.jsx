import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import StudentHeader from "../../components/StudentHeader";
import BackButton from "../../components/BackButton";
import "../../App.css";

export default function StudentMesses() {
  const [messes, setMesses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("messes/")
      .then((res) => setMesses(res.data))
      .catch(() => {
        // silent fail – don’t break UI
        setMesses([]);
      });
  }, []);

  return (
    <>
      <StudentHeader />

      <div className="page-container">
        <BackButton />

        <h2 className="page-title">Nearby Messes</h2>

        {messes.length === 0 && (
          <p className="empty-text">No messes available</p>
        )}

        <div className="card-grid">
          {messes.map((mess) => (
            <div
              key={mess.id}
              className="card clickable"
              onClick={() => navigate(`/student/messes/${mess.id}`)}
            >
              <div className="card-body">
                <h3>{mess.name}</h3>
                <p className="muted">{mess.address}</p>

                <span
                  className={`status-badge ${
                    mess.is_open ? "open" : "closed"
                  }`}
                >
                  {mess.is_open ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
