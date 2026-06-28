import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar";
import Dashboard from "./component/Dashboard";
import Task from "./component/Task";
import Notes from "./component/Notes";
import Pomodoro from "./component/Pomodoro";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Calendar from "./component/Calendar";
import GoalHabit from "./component/GoalHabit";
import ProtectedRoute from "./component/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />

          <Route
            path="/task"
            element={
              <>
                <Navbar />
                <Task />
              </>
            }
          />

          <Route
            path="/notes"
            element={
              <>
                <Navbar />
                <Notes />
              </>
            }
          />

          <Route
            path="/pomodoro"
            element={
              <>
                <Navbar />
                <Pomodoro />
              </>
            }
          />

          <Route
            path="/calendar"
            element={
              <>
                <Navbar />
                <Calendar />
              </>
            }
          />

          <Route
            path="/goalhabit"
            element={
              <>
                <Navbar />
                <GoalHabit />
              </>
            }
          />


        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;