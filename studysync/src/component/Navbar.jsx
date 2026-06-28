import "./Navbar.css";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth,db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import {doc,getDoc, onSnapshot} from "firebase/firestore"

function Navbar() {

  const [streak,
setStreak] =
useState(0);


  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/Login");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        <h2>Task<span> Pilot</span> </h2>
      </div>

      {/* Hamburger */}
      <div
        className="hamburger"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        ☰
      </div>

      {/* Nav Links */}
      <ul
        className={`nav-links ${
          menuOpen
            ? "active"
            : ""
        }`}
      >
        <li>
          <Link to="/">
            Home
          </Link>
        </li>

        <li>
          <Link to="/Task">
            Task
          </Link>
        </li>

        <li>
          <Link to="/Pomodoro">
            Pomodoro
          </Link>
        </li>

        <li>
          <Link to="/Notes">
            Notes
          </Link>
        </li>

        <li>
          <Link to="/Calendar">
            Calendar
          </Link>
        </li>
        
        <li>
          <Link to="/GoalHabit">
          Goal and Habit
          </Link>
        </li>
       
       
       
       
        <button
          className="signup-btn"
          onClick={
            handleLogout
          }
        >
          Sign Out
        </button>
      </ul>

    </nav>
  );
}

export default Navbar;