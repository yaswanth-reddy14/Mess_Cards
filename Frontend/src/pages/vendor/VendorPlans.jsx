import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton";
import ConfirmModal from "../../components/ConfirmModal";

const formatLabel = (value) =>
  String(value || "")
    .toLowerCase()
    .replace("_", " ")
    .replace(/^./, (char) => char.toUpperCase());

export default function VendorPlans() {
  const { messId } = useParams();
  const navigate = useNavigate();

  const [messName, setMessName] = useState("Mess Plans");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingPlanId, setDeletingPlanId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "OWNER") {
      toast.error("Only mess owners can manage plans.");
      navigate("/student");
      return;
    }

    const loadPlans = async () => {
      try {
        setLoading(true);
        const [messRes, plansRes] = await Promise.all([
          api.get(`/messes/${messId}/`),
          api.get(`/messes/${messId}/plans/`),
        ]);
        setMessName(messRes.data?.name || "Mess Plans");
        setPlans(plansRes.data || []);
      } catch {
        toast.error("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [messId, navigate]);

  const togglePlanStatus = async (plan) => {
    try {
      await api.patch(`/messes/${messId}/plans/${plan.id}/`, {
        is_active: !plan.is_active,
      });
      setPlans((prev) =>
        prev.map((item) =>
          item.id === plan.id
            ? { ...item, is_active: !plan.is_active }
            : item
        )
      );
      toast.success(
        !plan.is_active ? "Plan activated" : "Plan hidden from students"
      );
    } catch {
      toast.error("Failed to update plan status");
    }
  };

  const requestDelete = (planId) => {
    setDeletingPlanId(planId);
    setConfirmOpen(true);
  };

  const deletePlan = async () => {
    if (!deletingPlanId) return;
    try {
      await api.delete(`/messes/${messId}/plans/${deletingPlanId}/`);
      setPlans((prev) => prev.filter((plan) => plan.id !== deletingPlanId));
      toast.success("Plan deleted");
    } catch {
      toast.error("Failed to delete plan");
    } finally {
      setConfirmOpen(false);
      setDeletingPlanId(null);
    }
  };

  return (
    <>
      <VendorHeader />
      <div style={pageStyle}>
        <BackButton />

        <div style={headerRow}>
          <div>
            <h2 style={{ margin: 0 }}>{messName}</h2>
            <p style={subText}>Create package options for students</p>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate(`/vendor/${messId}/plans/add`)}
          >
            + Add Plan
          </button>
        </div>

        {loading ? (
          <p className="empty-text">Loading plans...</p>
        ) : plans.length === 0 ? (
          <p className="empty-text">No plans added yet</p>
        ) : (
          <div style={planGrid}>
            {plans.map((plan) => (
              <div key={plan.id} style={planCard}>
                <div style={planHeader}>
                  <h3 style={{ margin: 0 }}>{plan.name}</h3>
                  <span
                    className={`status-badge ${
                      plan.is_active ? "open" : "closed"
                    }`}
                  >
                    {plan.is_active ? "Active" : "Hidden"}
                  </span>
                </div>

                {plan.description ? (
                  <p style={description}>{plan.description}</p>
                ) : (
                  <p style={subText}>No description</p>
                )}

                <div style={metaGrid}>
                  <div>
                    <span style={metaLabel}>Price</span>
                    <strong style={priceText}>Rs {plan.price}</strong>
                  </div>
                  <div>
                    <span style={metaLabel}>Plan Items</span>
                    <p style={metaText}>
                      {Array.isArray(plan.items) ? plan.items.length : 0} items
                    </p>
                  </div>
                  <div>
                    <span style={metaLabel}>Days</span>
                    <p style={metaText}>
                      {(plan.days || []).map(formatLabel).join(", ") || "-"}
                    </p>
                  </div>
                  <div>
                    <span style={metaLabel}>Meals</span>
                    <p style={metaText}>
                      {(plan.meals || []).map(formatLabel).join(", ") || "-"}
                    </p>
                  </div>
                </div>

                <div style={actionRow}>
                  <button
                    className="btn-edit"
                    onClick={() =>
                      navigate(`/vendor/${messId}/plans/${plan.id}/edit`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => togglePlanStatus(plan)}
                  >
                    {plan.is_active ? "Hide" : "Activate"}
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => requestDelete(plan.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete plan?"
        message="Students will no longer see this package option."
        confirmText="Delete"
        danger
        onClose={() => setConfirmOpen(false)}
        onConfirm={deletePlan}
      />
    </>
  );
}

const pageStyle = {
  padding: 24,
  maxWidth: 1200,
  margin: "0 auto",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 20,
};

const subText = {
  fontSize: 14,
  opacity: 0.7,
  marginTop: 6,
};

const planGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 18,
};

const planCard = {
  background: "rgba(15, 23, 42, 0.8)",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const planHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
};

const description = {
  margin: 0,
  color: "#cbd5e1",
  lineHeight: 1.4,
};

const metaGrid = {
  display: "grid",
  gap: 10,
};

const metaLabel = {
  display: "block",
  opacity: 0.7,
  fontSize: 12,
  marginBottom: 2,
};

const metaText = {
  margin: 0,
  fontSize: 14,
};

const priceText = {
  color: "#22c55e",
  fontSize: 18,
};

const actionRow = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};
