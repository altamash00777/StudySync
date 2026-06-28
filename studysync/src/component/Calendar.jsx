import "./Calendar.css";

import {
  useEffect,
  useState,
} from "react";

import {
  db,
  auth,
} from "../firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";


function Calendar() {

  const [
    currentDate,
    setCurrentDate
  ] = useState(
    new Date()
  );

  const [
    selectedDate,
    setSelectedDate
  ] = useState(null);

  const [
    showModal,
    setShowModal
  ] = useState(false);

  const [
    events,
    setEvents
  ] = useState([]);

  const [
    taskData,
    setTaskData
  ] = useState({
    subject: "",
    task: "",
    duration: "",
    priority:
      "Medium",
    type: "Study",
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  /* ----------------
     REALTIME FETCH
  ---------------- */

  useEffect(() => {

    const unsubscribeAuth =
      auth.onAuthStateChanged(
        (user) => {

          if (!user)
            return;

          const ref =
            collection(
              db,
              "users",
              user.uid,
              "calendar"
            );

          const q =
            query(
              ref,
              orderBy(
                "createdAt",
                "desc"
              )
            );

          const unsubscribe =
            onSnapshot(
              q,
              (snapshot) => {

                const data =
                  snapshot.docs.map(
                    (doc) => ({
                      id:
                        doc.id,
                      ...doc.data(),
                    })
                  );

                setEvents(
                  data
                );
              }
            );

          return () =>
            unsubscribe();
        }
      );

    return () =>
      unsubscribeAuth();

  }, []);

  /* ----------------
      SAVE TASK
  ---------------- */

  const saveTask =
    async () => {

      try {

        const user =
          auth.currentUser;

        if (!user) {
          return alert(
            "User not logged in"
          );
        }

        if (
          !taskData.subject ||
          !taskData.task
        ) {
          return alert(
            "Fill all fields"
          );
        }

        const ref =
          collection(
            db,
            "users",
            user.uid,
            "calendar"
          );

        await addDoc(ref, {
          ...taskData,

          date:
            selectedDate,

          createdAt:
            new Date(),
        });

        // streak update
        updateStreak();

        // reset form
        setTaskData({
          subject: "",
          task: "",
          duration: "",
          priority:
            "Medium",
          type:
            "Study",
        });

        // close modal
        setShowModal(
          false
        );

      } catch (error) {
        console.log(
          error
        );
      }
    };

  /* ----------------
      DELETE TASK
  ---------------- */

  const deleteTask =
    async (id) => {

      try {

        const user =
          auth.currentUser;

        if (!user)
          return;

        await deleteDoc(
          doc(
            db,
            "users",
            user.uid,
            "calendar",
            id
          )
        );

      } catch (error) {
        console.log(
          error
        );
      }
    };

  /* ----------------
      CALENDAR LOGIC
  ---------------- */

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const totalDays =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const previousMonth =
    () => {
      setCurrentDate(
        new Date(
          year,
          month - 1
        )
      );
    };

  const nextMonth =
    () => {
      setCurrentDate(
        new Date(
          year,
          month + 1
        )
      );
    };

  const openModal =
    (day) => {

      const fullDate =
        `${day}-${month + 1}-${year}`;

      setSelectedDate(
        fullDate
      );

      setShowModal(
        true
      );
    };

  const getEventsForDate =
    (date) => {

      return events.filter(
        (event) =>
          event.date ===
          date
      );
    };

  return (
    <div className="calendar-container">

      {/* Header */}
      <div className="calendar-header">

        <button
          onClick={
            previousMonth
          }
        >
          ◀
        </button>

        <h2>
          {
            months[
              month
            ]
          }{" "}
          {year}
        </h2>

        <button
          onClick={
            nextMonth
          }
        >
          ▶
        </button>

      </div>

      {/* Days */}
      <div className="calendar-days">

        {days.map(
          (day) => (
            <div
              key={day}
              className="day-name"
            >
              {day}
            </div>
          )
        )}

      </div>

      {/* Grid */}
      <div className="calendar-grid">

        {Array.from({
          length:
            firstDay,
        }).map(
          (
            _,
            index
          ) => (
            <div
              key={
                index
              }
              className="empty"
            ></div>
          )
        )}

        {Array.from({
          length:
            totalDays,
        }).map(
          (
            _,
            index
          ) => {

            const day =
              index +
              1;

            const fullDate =
              `${day}-${month + 1}-${year}`;

            const dateEvents =
              getEventsForDate(
                fullDate
              );

            return (
              <div
                key={day}
                className="calendar-box"
                onClick={() =>
                  openModal(
                    day
                  )
                }
              >

                <span className="date-number">
                  {day}
                </span>

                <div className="task-preview">

                  {dateEvents
                    .slice(
                      0,
                      2
                    )
                    .map(
                      (
                        event
                      ) => (
                        <div
                          key={
                            event.id
                          }
                          className={`task-chip ${event.priority.toLowerCase()}`}
                        >
                          {
                            event.subject
                          }
                        </div>
                      )
                    )}

                </div>
              </div>
            );
          }
        )}

      </div>

      {/* Modal */}
      {showModal && (

        <div className="modal-overlay">

          <div className="calendar-modal">

            <h3>
              Add Study Plan
            </h3>

            <p>
              {
                selectedDate
              }
            </p>

            <input
              type="text"
              placeholder="Subject"
              value={
                taskData.subject
              }
              onChange={(
                e
              ) =>
                setTaskData(
                  {
                    ...taskData,
                    subject:
                      e
                        .target
                        .value,
                  }
                )
              }
            />

            <input
              type="text"
              placeholder="Task"
              value={
                taskData.task
              }
              onChange={(
                e
              ) =>
                setTaskData(
                  {
                    ...taskData,
                    task:
                      e
                        .target
                        .value,
                  }
                )
              }
            />

            <input
              type="number"
              placeholder="Study Hours"
              value={
                taskData.duration
              }
              onChange={(
                e
              ) =>
                setTaskData(
                  {
                    ...taskData,
                    duration:
                      e
                        .target
                        .value,
                  }
                )
              }
            />

            <select
              value={
                taskData.priority
              }
              onChange={(
                e
              ) =>
                setTaskData(
                  {
                    ...taskData,
                    priority:
                      e
                        .target
                        .value,
                  }
                )
              }
            >
              <option>
                Low
              </option>

              <option>
                Medium
              </option>

              <option>
                High
              </option>

            </select>

            <div className="modal-buttons">

              <button
                onClick={
                  saveTask
                }
              >
                Save
              </button>

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
              >
                Cancel
              </button>

            </div>

            <div className="event-list">

              <h4>
                Tasks
              </h4>

              {getEventsForDate(
                selectedDate
              ).map(
                (
                  event
                ) => (

                  <div
                    key={
                      event.id
                    }
                    className="event-card"
                  >

                    <h5>
                      {
                        event.subject
                      }
                    </h5>

                    <p>
                      {
                        event.task
                      }
                    </p>

                    <span>
                      ⏱️{" "}
                      {
                        event.duration
                      }h
                    </span>

                    <button
                      onClick={() =>
                        deleteTask(
                          event.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default Calendar;