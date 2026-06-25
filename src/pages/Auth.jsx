import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

function Auth() {
  const [mode, setMode] = useState("signup");
  const { signup, user, logout, login } = useAuth();
  const [error, setError] = useState(null);
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function handleModeChange() {
    setMode((prevMode) => (prevMode === "signup" ? "login" : "signup"));
  }

  function onSubmit(data, e) {
    e.preventDefault();
    setError(null);
    const email = data.email;
    const password = data.password;
    let result = false;
    if (!email || !password) return;
    if (mode === "login") {
      result = login(email, password);
    } else {
      result = signup(email, password);
    }
    if (!result.success) setError(result.message);
    else Navigate("/");
  }

  return (
    <div className="page">
      <div className="container">
        <div className="auth-container">
          <h1 className="page-title">
            {mode === "signup" ? "Sign Up" : "Login"}
          </h1>
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="form-input"
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                className="form-input"
                placeholder="Enter your password"
              />
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>
            <button type="submit" className="btn btn-primary btn-large">
              {mode === "signup" ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="auth-switch">
            {mode === "signup" ? (
              <p>
                Already have an account?{" "}
                <span className="auth-link" onClick={handleModeChange}>
                  Login
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span className="auth-link" onClick={handleModeChange}>
                  Sign Up
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
