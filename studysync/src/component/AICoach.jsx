import { useState } from "react";
import "./AICoach.css";

import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

import { generateAIPlan } from "../services/aiService";

function AICoach() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const generatePlan = async () => {
    setLoading(true);
    setPlan("");

    try {
      const user = auth.currentUser;

      if (!user) {
        setPlan("❌ Please login first.");
        return;
      }

      const uid = user.uid;

      // ================= TASKS =================
      const taskSnap = await getDocs(
        collection(db, "users", uid, "tasks")
      );

      const tasks = taskSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ================= HABITS =================
      const habitSnap = await getDocs(
        collection(db, "users", uid, "habits")
      );

      const habits = habitSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ================= CALENDAR EVENTS =================
      const eventSnap = await getDocs(
        collection(db, "users", uid, "calendar")
      );

      const events = eventSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ================= EMPTY CHECK =================
      if (!tasks.length && !habits.length && !events.length) {
        setPlan("⚠️ No data found. Add tasks, habits, or calendar events first.");
        return;
      }

      // ================= AI GENERATION =================
      const aiResponse = await generateAIPlan({
        tasks,
        habits,
        events,
      });

      setPlan(aiResponse);
    } catch (error) {
      console.error(error);
      setPlan("❌ Failed to generate AI plan. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // console.log("TASKS:", tasks);

  return (
    <div className="ai-coach-container">
      <h2>🤖 AI  Coach</h2>

      <button
        className="generate-btn"
        onClick={generatePlan}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      <div className="plan-box">
        {plan ? (
          <div className="plan-text">{plan}</div>
        ) : (
          <p>
            Click <b>Generate Plan</b> to create your personalized productivity roadmap.
          </p>
        )}
      </div>
    </div>
  );
}

export default AICoach;