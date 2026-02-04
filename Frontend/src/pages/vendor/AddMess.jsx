import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton";

export default function AddMess() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [foodType, setFoodType] = useState("VEG");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [mealsIncluded, setMealsIncluded] = useState("");
  const [image, setImage] = useState(null); // ✅ NEW

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData(); //  REQUIRED
    formData.append("name", name);
    formData.append("address", address);
    formData.append("location", location);
    formData.append("food_type", foodType);
    formData.append("monthly_price", monthlyPrice);
    formData.append("meals_included", mealsIncluded);

    if (image) {
      formData.append("image", image); // IMAGE SENT
    }

    await api.post("messes/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    navigate("/vendor");
  };

  return (
    <>
      <VendorHeader />
      <BackButton />

      <div className="page-container">
        <div className="form-card animate-in">
          <h2>Add Mess</h2>

          <form onSubmit={submit} className="grid-form">
            <input
              placeholder="Mess Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <input
              placeholder="Monthly Price"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
              required
            />

            <input
              placeholder="Meals Included (B/L/D)"
              value={mealsIncluded}
              onChange={(e) => setMealsIncluded(e.target.value)}
              required
            />

            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            >
              <option value="VEG">Veg</option>
              <option value="NON_VEG">Non-Veg</option>
              <option value="BOTH">Both</option>
            </select>

            {/*  IMAGE UPLOAD */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button className="primary-btn" type="submit">
              Add Mess
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
