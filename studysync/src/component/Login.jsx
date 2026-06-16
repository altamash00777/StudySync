import "./Login.css"


import { useState } from "react";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth }
from "../firebase";

import {
  useNavigate
} from "react-router-dom";

import "./Login.css";

function Login() {

  const navigate =
    useNavigate();

  const [email,
  setEmail] =
  useState("");

  const [password,
  setPassword] =
  useState("");

  async function handleLogin(e) {

    e.preventDefault();

    try {

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      console.log(
        userCredential.user
      );

      navigate("/");

    }

    catch (error) {

      alert("First create account");
    }
  }

return (
  <div className="login-page">

    <div className="login-content">

      {/* Left Side */}

      <div className="login-left">

        <h1>
          Study
          <span>Sync</span>
        </h1>

        <div className="login-line"></div>

        <p>
          Stay productive with
          smart task management,
          notes, pomodoro and
          everything students need
          in one place.
        </p>

      </div>

      {/* Right Side */}

      <div className="login-right">

        <div className="login-card">

          <h2>Login</h2>

          <p className="login-subtitle">
            Welcome back 👋
          </p>

          <form
            onSubmit={handleLogin}
            className="login-form"
          >

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>

          </form>

          <p className="switch-auth">
            Don't have an account?

            <span
              onClick={() =>
                navigate(
                  "/signup"
                )
              }
            >
              Signup
            </span>

          </p>

        </div>

      </div>

    </div>

  </div>
);
}

export default Login;