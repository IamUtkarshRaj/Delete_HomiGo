
import { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthModern.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset request:", email);
  };

  return (
    <div className="auth-modern">
      {/* Left: Form */}
      <div className="auth-left">
        <div className="auth-form-full">
          <h1 className="auth-heading">Reset Password</h1>
          <p className="auth-sub">Enter your email to receive reset link</p>

          <form onSubmit={handleSubmit} className="scrollable-form">
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">Send Reset Link</button>
          </form>

          <div className="auth-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>

      {/* Right: Animation */}
      <div className="auth-right">
        <div className="hero-content">
          <h2>Password Reset</h2>
          <p>We’ll send you instructions to securely reset your account.</p>
          <div className="grid-anim big">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="grid-tile"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}