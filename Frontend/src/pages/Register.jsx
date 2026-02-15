import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  // FORM FIELDS
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  // UI STATE
  const [loading, setLoading] = useState(false);

  const registerDirectly = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("auth/register/", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirm_password: confirmPassword,
        role,
      });

      toast.success("Registration successful");
      navigate("/login");
    } catch {
      // error handled globally by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={registerDirectly}>

        {/* BACK BUTTON */}
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/login")}
        >
          ← Back to Login
        </button>

        <h2>Create Account</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="STUDENT">Student</option>
          <option value="OWNER">Mess Owner</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
