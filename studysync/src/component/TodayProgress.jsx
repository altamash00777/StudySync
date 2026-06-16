import "./TodayProgress.css";

import {
useState,
useEffect
}
from "react";

import {
db,
auth
}
from "../firebase";

import {
collection,
doc,
onSnapshot
}
from
"firebase/firestore";

function TodayProgress() {

const [
completedTasks,
setCompletedTasks
] =
useState(0);

const [
totalTasks,
setTotalTasks
] =
useState(0);

const [
studyHours,
setStudyHours
] =
useState(0);

const [
sessions,
setSessions
] =
useState(0);

const dailyStudyGoal = 5;
const dailyPomodoroGoal = 8;

useEffect(() => {

const unsubscribe =
auth.onAuthStateChanged(
(user) => {

if (!user)
return;

{/* TASKS */}
const taskRef =
collection(
db,
"users",
user.uid,
"tasks"
);

onSnapshot(
taskRef,
(snapshot) => {

const tasks =
snapshot.docs.map(
(doc) => ({
id: doc.id,
...doc.data(),
})
);

setTotalTasks(
tasks.length
);

const completed =
tasks.filter(
(task) =>
task.completed
).length;

setCompletedTasks(
completed
);
}
);

{/* USER DATA */}
const userRef =
doc(
db,
"users",
user.uid
);

onSnapshot(
userRef,
(snapshot) => {

if (
snapshot.exists()
) {

const data =
snapshot.data();

setStudyHours(
(
data.studyMinutes || 0
) / 60
);

setSessions(
data.sessions || 0
);
}
}
);
}
);

return () =>
unsubscribe();

}, []);

const taskProgress =
totalTasks > 0
? (
completedTasks /
totalTasks
) * 100
: 0;

const studyProgress =
(
studyHours /
dailyStudyGoal
) * 100;

const sessionProgress =
(
sessions /
dailyPomodoroGoal
) * 100;

return (

<div className="progress-section">

<h2>
Today's Progress 📈
</h2>

{/* Task */}
<div className="progress-card">

<div className="progress-header">
<h3>
Tasks Progress
</h3>

<span>
{completedTasks}/
{totalTasks}
</span>
</div>

<div className="progress-bar">
<div
className="progress-fill"
style={{
width:
`${taskProgress}%`
}}
></div>
</div>

</div>

{/* Study Hours */}
<div className="progress-card">

<div className="progress-header">
<h3>
Study Goal
</h3>

<span>
{Number(
studyHours
).toFixed(1)}
h /
{dailyStudyGoal}
h
</span>
</div>

<div className="progress-bar">
<div
className="progress-fill study"
style={{
width:
`${Math.min(
studyProgress,
100
)}%`
}}
></div>
</div>

</div>

{/* Pomodoro */}
<div className="progress-card">

<div className="progress-header">
<h3>
Pomodoro Sessions
</h3>

<span>
{sessions}/
{dailyPomodoroGoal}
</span>
</div>

<div className="progress-bar">
<div
className="progress-fill pomo"
style={{
width:
`${Math.min(
sessionProgress,
100
)}%`
}}
></div>
</div>

</div>

</div>
);
}

export default TodayProgress;