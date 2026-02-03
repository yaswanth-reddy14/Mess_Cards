import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  // STEP CONTROL
  const [step, setStep] = useState(1); // 1=form, 2=otp

  // FORM FIELDS
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  // OTP
  const [otp, setOtp] = useState("");

  // UI STATE
  const [loading, setLoading] = useState(false);

  /* =========================
     STEP 1: SEND EMAIL OTP
  ========================= */
  const sendOtp = async (e) => {
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

      await api.post("auth/send-otp/", {
        email: email.trim().toLowerCase(),
      });

      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STEP 2: VERIFY OTP + REGISTER
  ========================= */
  const verifyOtpAndRegister = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await api.post("auth/verify-otp-register/", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirm_password: confirmPassword,
        role,
        otp,
      });

      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;

      toast.error(
        data?.error ||
        data?.email?.[0] ||
        data?.confirm_password ||
        data?.password?.[0] ||
        "Invalid or expired OTP"
      );

      // IMPORTANT UX FIX
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-card"
        onSubmit={step === 1 ? sendOtp : verifyOtpAndRegister}
      >
        <h2>{step === 1 ? "Create Account" : "Verify Email OTP"}</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
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
              {loading ? "Sending OTP..." : "Send OTP to Email"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Register"}
            </button>

            <p
              className="auth-footer"
              style={{ cursor: "pointer" }}
              onClick={() => setStep(1)}
            >
              ← Edit details / Resend OTP
            </p>
          </>
        )}
      </form>
    </div>
  );
}
