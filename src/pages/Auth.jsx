import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "signup" && !name.trim()) {
      return;
    }

    if (!email.trim() || !password.trim()) {
      return;
    }

    /*
     * Demo authentication.
     * Later this will connect to your backend.
     */
    localStorage.setItem(
      "careermatch-user",
      JSON.stringify({
        name: name || "Tanvee",
        email,
      })
    );

    localStorage.setItem(
      "careermatch-auth",
      "true"
    );

    navigate("/");
  };

  return (
    <div className="auth-page">

      {/* Background glow */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      {/* Logo */}
      <div className="auth-logo">
        <div className="auth-logo-icon">✦</div>

        <span>
          CareerMatch <strong>AI</strong>
        </span>
      </div>

      {/* Main card */}
      <div className="auth-container">

        <div className="auth-heading">

          <span className="auth-eyebrow">
            YOUR CAREER, CONNECTED
          </span>

          <h1>
            {mode === "login"
              ? "Welcome back."
              : "Start your journey."}
          </h1>

          <p>
            {mode === "login"
              ? "Continue where you left off."
              : "Build your path with CareerMatch AI."}
          </p>

        </div>


        {/* Login / Signup switch */}
        <div className="auth-switch">

          <button
            className={
              mode === "login"
                ? "auth-switch-active"
                : ""
            }
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>

          <button
            className={
              mode === "signup"
                ? "auth-switch-active"
                : ""
            }
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign up
          </button>

        </div>


        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {mode === "signup" && (
            <div className="auth-field">

              <label>Name</label>

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>
          )}


          <div className="auth-field">

            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          <div className="auth-field">

            <div className="password-label">

              <label>Password</label>

              {mode === "login" && (
                <button
                  type="button"
                  className="forgot-password"
                >
                  Forgot password?
                </button>
              )}

            </div>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          <button
            type="submit"
            className="auth-submit"
          >
            <span>
              {mode === "login"
                ? "Continue"
                : "Create account"}
            </span>

            <span className="auth-arrow">
              ↗
            </span>

          </button>

        </form>


        <div className="auth-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>


        <button
          className="demo-login"
          type="button"
          onClick={() => {
            localStorage.setItem(
              "careermatch-user",
              JSON.stringify({
                name: "Tanvee",
                email: "demo@careermatch.ai",
              })
            );

            localStorage.setItem(
              "careermatch-auth",
              "true"
            );

            navigate("/");
          }}
        >
          Continue as demo student
        </button>


        <p className="auth-footer">
          By continuing, you agree to use
          CareerMatch AI for your learning journey.
        </p>

      </div>

    </div>
  );
}