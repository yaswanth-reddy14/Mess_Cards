import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../App.css";
import StudentHeader from "../../components/StudentHeader";

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
      .then(res => {
        setUser(res.data);
        setPhone(res.data.phone || "");
      })
      .catch(() => alert("Failed to load profile"));
  }, []);

  // UPDATE PHONE
  const updatePhone = async () => {
    if (!phone.trim()) return alert("Phone cannot be empty");

    try {
      setSaving(true);
      const res = await api.patch("auth/me/", { phone });
      setUser(res.data);
      alert("Phone updated");
    } catch {
      alert("Failed to update phone");
    } finally {
      setSaving(false);
    }
  };

  // CHANGE PASSWORD
  const changePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return alert("Fill all fields");

    if (newPassword !== confirmPassword)
      return alert("Passwords do not match");

    try {
      await api.post("auth/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      alert("Password changed");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.error || "Password change failed");
    }
  };

  if (!user) return null;

  return (
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

        <h3 className="section-title">Contact Info</h3>

        <div className="info-row input-row">
          <label>Phone</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
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
        

        <div className="divider"></div>

        <h3 className="section-title">Change Password</h3>

        <div className="info-row input-row">
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
          />
        </div>

        <div className="info-row input-row">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <div className="info-row input-row">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={changePassword}>
          Update Password
        </button>

      </div>
    </div>
  );
}
