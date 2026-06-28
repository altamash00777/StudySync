import "./Signup.css"

import { useState } from "react";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth }
from "../firebase";

import {
  useNavigate
} from "react-router-dom";

import "./Signup.css";

function Signup() {

  const navigate =
    useNavigate();

  const [email,
  setEmail] =
  useState("");

  const [password,
  setPassword] =
  useState("");

  async function handleSignup(e) {

    e.preventDefault();

    try {

      await
      createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/");

    }

    catch (error) {

      alert(error.message);
    }
  }

  return (

    <div className="signup-page">

      <div className="signup-content">

        {/* Left Side */}

        <div className="signup-left">

          <h1>
            Join
            <span>
              TaskPilot
            </span>
          </h1>

          <div className="signup-line"></div>

          <p>
            Create your account
            and organize tasks,
            notes and study
            sessions in one
            place.
          </p>

        </div>

        {/* Right Side */}

        <div className="signup-right">

          <div className="signup-card">

            <h2>
              Signup
            </h2>

            <p className=
            "signup-subtitle">

              Create account 🚀

            </p>

            <form
              onSubmit={
                handleSignup
              }
              className=
              "signup-form"
            >

              <input
                type="email"
                placeholder=
                "Enter Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

              <input
                type="password"
                placeholder=
                "Create Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="submit"
                className=
                "signup-btn"
              >
                Signup
              </button>

            </form>

            <p className=
            "switch-auth">

              Already have
              an account?

              <span
                onClick={() =>
                  navigate(
                    "/login"
                  )
                }
              >
                Login
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;