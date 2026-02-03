import { useEffect, useState } from "react";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import BackButton from "../../components/BackButton";
import "../../App.css";
import { toast } from "react-toastify";

export default function VendorProfile() {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [messesCount, setMessesCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔥 NEW: delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // LOAD PROFILE + MESSES
  useEffect(() => {
    api.get("auth/me/")
      .then(res => {
        setUser(res.data);
        setPhone(res.data.phone || "");
      })
      .catch(() => toast.error("Failed to load profile"));

    api.get("messes/")
      .then(res => setMessesCount(res.data.length))
      .catch(() => {});
  }, []);

  // UPDATE PHONE
  const updatePhone = async () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setSaving(true);
      const res = await api.patch("auth/me/", { phone });
      setUser(res.data);
      toast.success("Phone updated successfully");
    } catch {
      toast.error("Failed to update phone");
    } finally {
      setSaving(false);
    }
  };

  // CHANGE PASSWORD
  const changePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      await api.post("auth/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // handled globally by axios interceptor
    }
  };

  // DELETE ACCOUNT (PRO FLOW)
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete("auth/me/");
      toast.success("Account deleted successfully");
      localStorage.clear();
      window.location.href = "/login";
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <VendorHeader />
      <BackButton />

      <div className="profile-container">
        {/* LEFT CARD */}
        <div className="profile-card">
          <div className="avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <span className="role-badge">{user.role}</span>

          <button
            className="btn-delete"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="profile-info">
          <h3 className="section-title">Account Overview</h3>

          <div className="info-row">
            <span>Total Messes</span>
            <strong>{messesCount}</strong>
          </div>

          <div className="info-row">
            <span>Account Type</span>
            <strong>Vendor</strong>
          </div>

          <div className="info-row">
            <span>Status</span>
            <strong className="status-active">Active</strong>
          </div>

          <div className="divider" />

          <h3 className="section-title">Contact Information</h3>

          <div className="info-row input-row">
            <label>Phone Number</label>
            <input
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) setPhone(value);
              }}
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <button
            className="btn-primary"
            onClick={updatePhone}
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Phone"}
          </button>

          <div className="divider" />

          <h3 className="section-title">Security</h3>

          <div className="info-row input-row">
            <label>Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="info-row input-row">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="info-row input-row">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={changePassword}>
            Change Password
          </button>

          <div className="divider" />

          <h3 className="section-title danger">Danger Zone</h3>

          <button
            className="btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* 🔥 DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-card danger">
            <h3>Delete Account</h3>
            <p>
              This action is <strong>permanent</strong>.  
              All your data will be deleted.
            </p>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                className="btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
