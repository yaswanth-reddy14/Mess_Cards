import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../App.css";
import StudentHeader from "../../components/StudentHeader";
import BackButton from "../../components/BackButton";
import { toast } from "react-toastify";

export default function StudentProfile() {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //  Delete account modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // LOAD PROFILE
  useEffect(() => {
    api.get("auth/me/")
      .then((res) => {
        setUser(res.data);
        setPhone(res.data.phone || "");
      })
      .catch(() => toast.error("Failed to load profile"));
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
      // handled globally
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

      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      
    }
  };

  // DELETE ACCOUNT 
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
      <StudentHeader />
      <BackButton />

      <div className="profile-container">
        {/* LEFT CARD */}
        <div className="profile-card">
          <div className="avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <span className="role-badge">Student</span>

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

      {/*  DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-card danger">
            <h3>Delete Account</h3>
            <p>
              This action is <strong>permanent</strong>.  
              Your account and data will be deleted.
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
