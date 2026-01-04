import { useEffect, useState } from "react";
import api from "../../api/axios";
import VendorHeader from "../../components/VendorHeader";
import "../../App.css";

export default function VendorProfile() {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [messesCount, setMessesCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  
  // LOAD PROFILE + MESSES
  
  useEffect(() => {
    api.get("auth/me/")
      .then(res => {
        setUser(res.data);
        setPhone(res.data.phone || "");
      })
      .catch(() => alert("Failed to load profile"));

    api.get("messes/")
      .then(res => setMessesCount(res.data.length))
      .catch(() => {});
  }, []);

  
  // UPDATE PHONE
  
  const updatePhone = async () => {
    if (!phone.trim()) {
      alert("Phone number cannot be empty");
      return;
    }

    try {
      setSaving(true);
      const res = await api.patch("auth/me/", { phone });
      setUser(res.data);
      alert("Phone updated successfully");
    } catch {
      alert("Failed to update phone");
    } finally {
      setSaving(false);
    }
  };


  // CHANGE PASSWORD

  const changePassword = async () => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    alert("All password fields are required");
    return;
  }

  if (newPassword.length < 8) {
    alert("New password must be at least 8 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New password and confirm password do not match");
    return;
  }

  try {
    await api.post("auth/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });

    alert("Password changed successfully");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    alert(err.response?.data?.error || "Password update failed");
  }
};

  // DELETE ACCOUNT
  
  const deleteProfile = async () => {
    if (!window.confirm("This will permanently delete your account. Continue?")) return;

    try {
      await api.delete("auth/me/");
      localStorage.clear();
      window.location.href = "/login";
    } catch {
      alert("Failed to delete account");
    }
  };

  if (!user) return null;

  return (
    <>
      <VendorHeader />

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

        <div className="profile-info">

  {/*  ACCOUNT OVERVIEW */}
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

  {/*  CONTACT INFO */}
  <h3 className="section-title">Contact Information</h3>

  <div className="info-row input-row">
    <label>Phone Number</label>
    <input
      type="text"
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

  {/* SECURITY  */}
  <h3 className="section-title">Security</h3>

  <div className="info-row input-row">
    <label>Old Password</label>
    <input
      type="password"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      placeholder="Enter old password"
    />
  </div>

  <div className="info-row input-row">
    <label>New Password</label>
    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      placeholder="Enter new password"
    />
  </div>

  <div className="info-row input-row">
  <label>Confirm New Password</label>
  <input
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Re-enter new password"
  />
  </div>


  <button className="btn-primary" onClick={changePassword}>
    Change Password
  </button>

  <div className="divider" />

  {/*  DANGER ZONE  */}
  <h3 className="section-title danger">Danger Zone</h3>

  <button className="btn-danger" onClick={deleteProfile}>
    Delete Account
  </button>

</div>

      </div>
    </>
  );
}
