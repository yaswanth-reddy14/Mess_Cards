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
      <div className="vendor-plans-page">
        <BackButton />

        <div className="vendor-plans-header">
          <div>
            <h2 className="vendor-plans-title">{messName}</h2>
            <p className="section-subtitle">Create package options for students</p>
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
          <div className="vendor-plan-grid">
            {plans.map((plan) => (
              <div key={plan.id} className="vendor-plan-card">
                <div className="vendor-plan-card-header">
                  <h3 className="vendor-plan-name">{plan.name}</h3>
                  <span
                    className={`status-badge ${
                      plan.is_active ? "open" : "closed"
                    }`}
                  >
                    {plan.is_active ? "Active" : "Hidden"}
                  </span>
                </div>

                {plan.description ? (
                  <p className="vendor-plan-desc">{plan.description}</p>
                ) : (
                  <p className="section-subtitle">No description</p>
                )}

                <div className="vendor-plan-meta">
                  <div className="vendor-plan-meta-row">
                    <span className="vendor-plan-meta-label">Price</span>
                    <strong className="vendor-plan-price">Rs {plan.price}</strong>
                  </div>
                  <div className="vendor-plan-meta-row">
                    <span className="vendor-plan-meta-label">Plan Items</span>
                    <p className="vendor-plan-meta-value">
                      {Array.isArray(plan.items) ? plan.items.length : 0} items
                    </p>
                  </div>
                  <div className="vendor-plan-meta-row">
                    <span className="vendor-plan-meta-label">Days</span>
                    <p className="vendor-plan-meta-value">
                      {(plan.days || []).map(formatLabel).join(", ") || "-"}
                    </p>
                  </div>
                  <div className="vendor-plan-meta-row">
                    <span className="vendor-plan-meta-label">Meals</span>
                    <p className="vendor-plan-meta-value">
                      {(plan.meals || []).map(formatLabel).join(", ") || "-"}
                    </p>
                  </div>
                </div>

                <div className="vendor-plan-actions">
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
