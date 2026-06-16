import { useState, useEffect } from "react";
import "./Task.css";

import { db, auth } from "../firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  query,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

function Task() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  /* 🔐 Auth Listener */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  /* 📡 Real-time Task Fetch */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "tasks")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // incomplete first
      taskList.sort((a, b) => a.completed - b.completed);

      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  /* ➕ Add Task */
  const addTask = async () => {
    if (!user) return;

    if (taskInput.trim() === "") {
      alert("Please enter the task...");
      return;
    }

    try {
      await addDoc(
        collection(db, "users", user.uid, "tasks"),
        {
          text: taskInput,
          completed: false,
          createdAt: serverTimestamp(),
        }
      )
      
      ;

      setTaskInput("");
    } catch (error) {
      console.log(error);
    }
  };

  /* ❌ Delete Task */
  const deleteTask = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(
        doc(db, "users", user.uid, "tasks", id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* 🔄 Toggle Task */
  const toggleTask = async (id, completed) => {
    if (!user) return;

    try {
      const taskRef = doc(
        db,
        "users",
        user.uid,
        "tasks",
        id
      );

      await updateDoc(taskRef, {
        completed: !completed,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /* 🚫 UI if not logged in */
  if (!user) {
    return <h3>Please login to access your tasks...</h3>;
  }

  return (
    <div className="task-container">
      <h1>Task Manager</h1>

      {/* Stats */}
      <div className="task-card">
        <h3>Total Tasks</h3>
        <p>{tasks.length}</p>
      </div>

      {/* Input */}
      <div className="task-input-box">
        <input
          type="text"
          placeholder="Add your task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.length === 0 ? (
          <h3 className="empty">No tasks yet 🚀</h3>
        ) : (
          tasks.map((task) => (
            <div
              className={`task-item ${
                task.completed ? "done" : ""
              }`}
              key={task.id}
            >
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    toggleTask(task.id, task.completed)
                  }
                />

                <span
                  className={
                    task.completed ? "completed" : ""
                  }
                >
                  {task.text}
                </span>
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Task;