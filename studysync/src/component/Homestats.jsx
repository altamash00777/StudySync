import {
useEffect,
useState
}
from "react";

import {
db,
auth
}
from "../firebase";

import {
doc,
collection,
onSnapshot
}
from
"firebase/firestore";

function HomeStats() {

const [
pendingTasks,
setPendingTasks
] =
useState(0);

const [
completedTasks,
setCompletedTasks
] =
useState(0);

const [
studyHours,
setStudyHours
] =
useState(0);

const [
streak,
setStreak
] =
useState(0);

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

const pending =
tasks.filter(
(task) =>
!task.completed
).length;

const completed =
tasks.filter(
(task) =>
task.completed
).length;

setPendingTasks(
pending
);

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

setStreak(
data.streak || 0
);
}
}
);
}
);

return () =>
unsubscribe();

}, []);

return (

<div className="hero-right">

{/* Pending */}
<div className="hero-stat">
<h2>
{pendingTasks}
</h2>
<p>
Pending
</p>
</div>

{/* Completed */}
<div className="hero-stat">
<h2>
{completedTasks}
</h2>
<p>
Completed
</p>
</div>

{/* Study Hours */}
<div className="hero-stat">
<h2>
{studyHours.toFixed(1)}h
</h2>
<p>
Study Hours
</p>
</div>


</div>
);
}

export default HomeStats;