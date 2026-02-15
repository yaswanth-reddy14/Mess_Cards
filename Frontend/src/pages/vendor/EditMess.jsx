import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton";
import { toast } from "react-toastify";

// backend base url (http://127.0.0.1:8000 or render)
const BACKEND_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export default function EditMess() {
  const { messId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/messes/${messId}/`)
      .then((res) => {
        setName(res.data.name);
        setAddress(res.data.address);
        setLocation(res.data.location);

        // FIX: make image absolute URL
        if (res.data.image) {
          setCurrentImage(
            res.data.image.startsWith("http")
              ? res.data.image
              : `${BACKEND_URL}${res.data.image}`
          );
        }

        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load mess details");
        navigate("/vendor");
      });
  }, [messId, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("location", location);

      if (image) {
        formData.append("image", image);
      }

      //  DO NOT set headers manually
      await api.patch(`/messes/${messId}/`, formData);

      toast.success("Mess details updated successfully");
      navigate("/vendor");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <>
      <VendorHeader />
      <BackButton />

      <form onSubmit={submit} style={form}>
        <h2 style={{ textAlign: "center" }}>Edit Mess</h2>

        {/* IMAGE PREVIEW */}
        {currentImage && (
          <div style={{ textAlign: "center" }}>
            <img
              src={currentImage}
              alt="Mess"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #6366f1",
                marginBottom: 12,
              }}
            />
          </div>
        )}

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

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
