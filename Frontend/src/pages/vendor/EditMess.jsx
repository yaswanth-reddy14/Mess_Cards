import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";

export default function EditMess() {
  const { messId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/messes/${messId}/`)
      .then((res) => {
        setName(res.data.name);
        setAddress(res.data.address);
        setLocation(res.data.location);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load mess");
        navigate("/vendor");
      });
  }, [messId, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/messes/${messId}/`, {
        name,
        address,
        location,
      });

      navigate("/vendor");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <>
      <VendorHeader />

      <form onSubmit={submit} style={form}>
        <h2 style={{ textAlign: "center" }}>Edit Mess</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mess Name"
          required
        />

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          required
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (Area/City)"
          required
        />

        <button type="submit">Update Mess</button>
      </form>
    </>
  );
}

const form = {
  maxWidth: 480,
  margin: "60px auto",
  padding: 28,
  background: "rgba(15,23,42,0.85)",
  borderRadius: 18,
  display: "flex",
  flexDirection: "column",
  gap: 16,
  boxShadow: "0 20px 50px rgba(0,0,0,.4)",
};
