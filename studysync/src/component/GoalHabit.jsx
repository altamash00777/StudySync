import { useState, useEffect } from "react";
import "./GoalHabit.css";

import { db, auth } from "../firebase";
import { deleteDoc } from "firebase/firestore";

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

export default function GoalHabit() {
  const [user, setUser] = useState(null);
  const [habitInput, setHabitInput] = useState("");
  const [habits, setHabits] = useState([]);

  /* 🔐 AUTH */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  /* 🔁 FETCH HABITS */
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(
      collection(db, "users", user.uid, "habits"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHabits(data);
      }
    );

    return () => unsub();
  }, [user]);

  /* ➕ ADD HABIT */
  const addHabit = async () => {
    if (!user || habitInput.trim() === "") return;

    try {
      await addDoc(collection(db, "users", user.uid, "habits"), {
        title: habitInput,
        streak: 0,
        lastCompleted: null,
        createdAt: serverTimestamp(),
      });

      setHabitInput("");
    } catch (err) {
      console.log(err);
    }
  };

  /* 🔥 COMPLETE HABIT (STREAK LOGIC) */
  const completeHabit = async (habit) => {
    const today = new Date().toDateString();

    let newStreak = habit.streak || 0;

    if (habit.lastCompleted !== today) {
      newStreak += 1;
    }

    try {
      await updateDoc(
        doc(db, "users", user.uid, "habits", habit.id),
        {
          streak: newStreak,
          lastCompleted: today,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  /* 🗑 DELETE HABIT */
  const deleteHabit = async (habitId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "habits", habitId));
    } catch (err) {
      console.log(err);
    }
  };

  /* 🚫 LOGIN CHECK */
  if (!user) {
    return <h2>Please login to access habits...</h2>;
  }

  return (
    <div className="habit-container">
      <h1>Habits Tracker 🔁</h1>

      {/* INPUT */}
      <div className="input-box">
        <input
          type="text"
          placeholder="Add a habit (e.g. Study 2h daily)"
          value={habitInput}
          onChange={(e) => setHabitInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
        />

        <button onClick={addHabit}>Add Habit</button>
      </div>

      {/* LIST */}
      <div className="list">
        {habits.length === 0 ? (
          <p className="empty">No habits yet 🔁</p>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="card habit-card">
              <div className="habit-left">
                <span>{habit.title}</span>
                <span className="streak">
                  🔥 {habit.streak || 0}
                </span>
              </div>

              <div className="habit-actions">
                <button
                  className="done-btn"
                  onClick={() => completeHabit(habit)}
                >
                  Done Today
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteHabit(habit.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}