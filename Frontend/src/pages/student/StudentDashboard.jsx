import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../App.css";
import StudentHeader from "../../components/StudentHeader";

export default function StudentDashboard() {
  const [messes, setMesses] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  
  // FETCH MESSES (ALL / FILTERED)
  
  const fetchMesses = async (location = "") => {
    try {
      setLoading(true);
      setMesses([]); 

      const url = location
        ? `messes/?location=${encodeURIComponent(location)}`
        : "messes/";

      const res = await api.get(url);
      setMesses(res.data);
    } catch {
      alert("Failed to load messes");
    } finally {
      setLoading(false);
    }
  };


  // INITIAL LOAD  ALL MESSES
  
  useEffect(() => {
    fetchMesses();
  }, []);


  // SEARCH HANDLER  

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      fetchMesses(); 
    } else {
      fetchMesses(searchLocation); 
    }
  };

  return (
    <>
      <StudentHeader />

      <div className="student-dashboard">
        <h2 className="page-title">Nearby Messes</h2>

        {/* SEARCH BAR */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <button className="btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* MESS LIST */}
        <div className="mess-grid">
          {loading ? (
            <p className="empty-text">Loading messes...</p>
          ) : messes.length === 0 ? (
            <p className="empty-text">No messes found</p>
          ) : (
            messes.map((mess) => (
              <div key={mess.id} className="mess-card">
                <img
                  className="mess-image"
                  src={
                    mess.image ||
                    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
                  }
                  alt={mess.name}
                />

                <div className="mess-info">
                  <h3>{mess.name}</h3>
                  <p>{mess.location || mess.address}</p>

                  <div className="mess-meta">
                    <span>{mess.food_type}</span>
                    <span>₹{mess.monthly_price}/month</span>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() =>
                      navigate(`/student/mess/${mess.id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
