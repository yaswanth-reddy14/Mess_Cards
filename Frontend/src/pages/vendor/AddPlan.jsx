import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton";

const DAY_OPTIONS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

const MEAL_OPTIONS = [
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "LUNCH", label: "Lunch" },
  { value: "DINNER", label: "Dinner" },
];

const createEmptyItem = () => ({
  day: "MONDAY",
  meal_type: "BREAKFAST",
  name: "",
});

export default function AddPlan() {
  const { messId, planId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(planId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [planItems, setPlanItems] = useState([createEmptyItem()]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "OWNER") {
      toast.error("Only mess owners can edit plans.");
      navigate("/student");
      return;
    }

    if (!isEdit) return;

    const loadPlan = async () => {
      try {
        const res = await api.get(`/messes/${messId}/plans/${planId}/`);
        const plan = res.data;

        setName(plan.name || "");
        setDescription(plan.description || "");
        setPrice(plan.price || "");
        setIsActive(Boolean(plan.is_active));

        const loadedItems = Array.isArray(plan.items) ? plan.items : [];
        if (loadedItems.length > 0) {
          setPlanItems(
            loadedItems.map((item) => ({
              day: item.day || "MONDAY",
              meal_type: item.meal_type || "BREAKFAST",
              name: item.name || "",
            }))
          );
        } else {
          setPlanItems([createEmptyItem()]);
        }
      } catch {
        toast.error("Failed to load plan");
        navigate(`/vendor/${messId}/plans`);
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [isEdit, messId, navigate, planId]);

  const updateItem = (index, field, value) => {
    setPlanItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItemRow = () => {
    setPlanItems((prev) => [...prev, createEmptyItem()]);
  };

  const removeItemRow = (index) => {
    setPlanItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)
    );
  };

  const submit = async (event) => {
    event.preventDefault();

    const cleanedItems = planItems
      .map((item) => ({
        day: item.day,
        meal_type: item.meal_type,
        name: item.name.trim(),
      }))
      .filter((item) => item.name.length > 0);

    if (cleanedItems.length === 0) {
      toast.error("Add at least one plan menu item.");
      return;
    }

    const days = [...new Set(cleanedItems.map((item) => item.day))];
    const meals = [...new Set(cleanedItems.map((item) => item.meal_type))];

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      days,
      meals,
      is_active: isActive,
      plan_items: cleanedItems,
    };

    try {
      setSaving(true);
      if (isEdit) {
        await api.patch(`/messes/${messId}/plans/${planId}/`, payload);
        toast.success("Plan updated");
      } else {
        await api.post(`/messes/${messId}/plans/`, payload);
        toast.success("Plan created");
      }
      navigate(`/vendor/${messId}/plans`);
    } catch {
      toast.error(isEdit ? "Failed to update plan" : "Failed to create plan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <VendorHeader />
        <div style={{ padding: 24 }}>
          <BackButton />
          <p className="empty-text">Loading plan...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <VendorHeader />
      <BackButton />

      <div className="page-container">
        <div className="form-card animate-in">
          <h2>{isEdit ? "Edit Plan" : "Add Plan"}</h2>

          <form onSubmit={submit} className="grid-form">
            <input
              placeholder="Plan Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />

            <label style={switchWrap}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
              Active (visible to students)
            </label>

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              style={textareaStyle}
            />

            <div style={planItemsWrap}>
              <div style={planItemsHeader}>
                <p style={choiceTitle}>Plan Menu Items</p>
                <button type="button" className="btn-primary" onClick={addItemRow}>
                  + Add Item
                </button>
              </div>

              {planItems.map((item, index) => (
                <div key={index} style={planRow}>
                  <select
                    value={item.day}
                    onChange={(event) =>
                      updateItem(index, "day", event.target.value)
                    }
                  >
                    {DAY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={item.meal_type}
                    onChange={(event) =>
                      updateItem(index, "meal_type", event.target.value)
                    }
                  >
                    {MEAL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <input
                    placeholder="Item name (e.g. Dal Fry)"
                    value={item.name}
                    onChange={(event) =>
                      updateItem(index, "name", event.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => removeItemRow(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button className="primary-btn" type="submit" disabled={saving}>
              {saving
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Plan"
                : "Create Plan"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const switchWrap = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "rgba(2, 6, 23, 0.65)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  padding: "12px 14px",
};

const textareaStyle = {
  gridColumn: "span 3",
  minHeight: 90,
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(2, 6, 23, 0.65)",
  color: "#fff",
  resize: "vertical",
};

const planItemsWrap = {
  gridColumn: "span 3",
  background: "rgba(2, 6, 23, 0.65)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  padding: 14,
  display: "grid",
  gap: 12,
};

const planItemsHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const planRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 2fr auto",
  gap: 10,
};

const choiceTitle = {
  margin: 0,
  fontWeight: 600,
};
