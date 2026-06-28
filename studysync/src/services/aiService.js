export const generateAIPlan = async ({ tasks = [], habits = [], events = [] }) => {
  try {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const safeHabits = Array.isArray(habits) ? habits : [];
    const safeEvents = Array.isArray(events) ? events : [];

    // ================= NORMALIZE TASKS =================
    const normalizedTasks = safeTasks.map((t) => {
     const title =
  t.text ||
  t.task ||
  t.subject ||
  t.title ||
  "Untitled Task";
      const duration = Number(t.duration || 1);
      const priority = (t.priority || "Medium").toLowerCase();

      let score = 0;

      if (priority === "high") score += 3;
      else if (priority === "medium") score += 2;
      else score += 1;

      if (duration >= 3) score += 2;

      return {
        title,
        duration,
        priority,
        score,
      };
    });

    // Sort by priority score
    normalizedTasks.sort((a, b) => b.score - a.score);

    // ================= HABITS =================
    const habitText = safeHabits.length
      ? safeHabits
          .map((h) => `• Maintain habit: ${h.name || h.title || "Unnamed habit"}`)
          .join("\n")
      : "• No habits added";

    // ================= EVENTS =================
const eventText = safeEvents.length
  ? safeEvents
      .map(
        (e) =>
          `• ${
            e.task ||
            e.subject ||
            e.text ||
            e.title ||
            "Untitled Event"
          }`
      )
      .join("\n")
  : "• No upcoming events";
    // ================= TASK PLAN =================
    const taskPlan = normalizedTasks.length
      ? normalizedTasks
          .map(
            (t, i) =>
              `${i + 1}. ${t.title}\n   ⏱ ${t.duration} hr | Priority: ${t.priority}`
          )
          .join("\n\n")
      : "No tasks available";

    // ================= FINAL OUTPUT =================
    const plan = `
🤖 AI COACH (OFFLINE MODE)

📌 PRIORITY TASK PLAN:
${taskPlan}

📅 EVENTS:
${eventText}

🔁 HABITS:
${habitText}

💡 DAILY STRATEGY:
- Focus on top 2 high-score tasks first
- Use Pomodoro (25-5 rule)
- Avoid multitasking
- Finish hardest task in morning
- Revise at night

🔥 PRODUCTIVITY TIP:
Consistency beats motivation. Keep going daily.
`;

    return plan;
  } catch (error) {
    console.error("Offline AI error:", error);
    return "AI failed to generate offline plan.";
  }
};