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
    if (!phone.trim()) {
      toast.error("Phone number cannot be empty");
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

  // CHANGE PASSWORD (FULL FIX)
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
    } catch (err) {
      const data = err.response?.data;

      if (data?.old_password?.length) {
        toast.error(data.old_password[0]); // 👈 exact backend message
      } else if (data?.detail) {
        toast.error(data.detail);
      } else if (data?.error) {
        toast.error(data.error);
      } else {
        toast.error("Password change failed");
      }
    }
  };

  if (!user) return null;

  return (
    <>
      <StudentHeader />

      <div className="profile-container">
        <BackButton />

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
          <h3 className="section-title">Contact Info</h3>

          <div className="info-row input-row">
            <label>Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
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

          <h3 className="section-title">Change Password</h3>

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
            Update Password
          </button>
        </div>
      </div>
    </>
  );
}
