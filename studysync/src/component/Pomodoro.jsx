import {
  useState,
  useEffect
} from "react";

import "./Pomodoro.css";

import {
  db,
  auth
} from "../firebase";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from
"firebase/firestore";


function Pomodoro() {

  const [minutes,
    setMinutes] =
    useState(25);

  const [seconds,
    setSeconds] =
    useState(0);

  const [isRunning,
    setIsRunning] =
    useState(false);

  const [customTime,
    setCustomTime] =
    useState("");

  const [studyMinutes,
    setStudyMinutes] =
    useState(0);

  const [sessions,
    setSessions] =
    useState(0);

  const quotes = [
    "Stay focused. Success takes time.",
    "Small progress is still progress.",
    "One session closer to your goal.",
    "Discipline beats motivation.",
  ];

  const randomQuote =
    quotes[
      Math.floor(
        Math.random() *
        quotes.length
      )
    ];

  /* -------------------
      LOAD FIREBASE DATA
  ------------------- */

  useEffect(() => {

    const unsubscribe =
      auth.onAuthStateChanged(
        async (user) => {

          if (!user)
            return;

          const pomodoroRef =
            doc(
              db,
              "users",
              user.uid
            );

          const snap =
            await getDoc(
              pomodoroRef
            );

          if (
            snap.exists()
          ) {

            const data =
              snap.data();

            setStudyMinutes(
              data.studyMinutes
              || 0
            );

            setSessions(
              data.sessions
              || 0
            );
          }
        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* -------------------
      TIMER
  ------------------- */

  useEffect(() => {

    let timer;

    if (isRunning) {

      timer =
        setInterval(
          async () => {

            if (
              seconds > 0
            ) {

              setSeconds(
                (prev) =>
                  prev - 1
              );
            }

            if (
              seconds === 0
            ) {

              if (
                minutes === 0
              ) {

                clearInterval(
                  timer
                );

                setIsRunning(
                  false
                );

                const user =
                  auth.currentUser;

                if (
                  user
                ) {

                  const userRef =
                    doc(
                      db,
                      "users",
                      user.uid
                    );

                  const sessionTime =
                    Number(
                      customTime
                      || 25
                    );

                  // update firebase
                  await setDoc(
                    userRef,
                    {
                      studyMinutes:
                        increment(
                          sessionTime
                        ),

                      sessions:
                        increment(
                          1
                        ),
                    },
                    {
                      merge:
                        true
                    }
                  );

                  // UI update
                  setStudyMinutes(
                    (
                      prev
                    ) =>
                      prev +
                      sessionTime
                  );

                  setSessions(
                    (
                      prev
                    ) =>
                      prev +
                      1
                  );

                  // streak
                  updateStreak();
                }

                // sound
                const audio =
                  new Audio(
                    "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
                  );

                audio.play();

                alert(
                  "Session Completed 🎉"
                );

              } else {

                setMinutes(
                  (
                    prev
                  ) =>
                    prev - 1
                );

                setSeconds(
                  59
                );
              }
            }

          },
          1000
        );
    }

    return () =>
      clearInterval(
        timer
      );

  }, [
    isRunning,
    seconds,
    minutes,
    customTime
  ]);

  /* -------------------
      FUNCTIONS
  ------------------- */

  const handleSetTime =
    () => {

      const time =
        Number(
          customTime
        );

      if (
        time > 0
      ) {

        setMinutes(
          time
        );

        setSeconds(
          0
        );
      }
    };

  const resetTimer =
    () => {

      setIsRunning(
        false
      );

      setMinutes(
        Number(
          customTime
        ) || 25
      );

      setSeconds(
        0
      );
    };

  const presets = [
    25,
    45,
    60,
    90
  ];

  return (
    <div className="pomodoro-container">

      <h1>
        Study Timer ⏰
      </h1>

      {/* Quote */}
      <div className="quote-box">
        <p>
          {
            randomQuote
          }
        </p>
      </div>

      {/* Stats */}
      <div className="pomodoro-stats">

        <div className="stat-card">
          <h2>
            {sessions}
          </h2>
          <p>
            Sessions
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {(
              studyMinutes /
              60
            ).toFixed(
              1
            )}h
          </h2>
          <p>
            Study Hours
          </p>
        </div>

      </div>

      {/* Timer */}
      <div className="timer">

        {String(
          minutes
        ).padStart(
          2,
          "0"
        )}

        :

        {String(
          seconds
        ).padStart(
          2,
          "0"
        )}

      </div>

      {/* Input */}
      <input
        type="number"
        placeholder="Set custom time"
        value={
          customTime
        }
        onChange={(e) =>
          setCustomTime(
            e.target
              .value
          )
        }
      />

      {/* Presets */}
      <div className="preset-buttons">

        {presets.map(
          (time) => (

            <button
              key={time}
              onClick={() => {

                setMinutes(
                  time
                );

                setSeconds(
                  0
                );

                setCustomTime(
                  time
                );
              }}
            >
              {time}
              min
            </button>
          )
        )}

      </div>

      <button
        className="set-time-btn"
        onClick={
          handleSetTime
        }
      >
        Set Time
      </button>

      {/* Controls */}
      <div className="buttons">

        <button
          onClick={() =>
            setIsRunning(
              true
            )
          }
        >
          Start
        </button>

        <button
          onClick={() =>
            setIsRunning(
              false
            )
          }
        >
          Pause
        </button>

        <button
          onClick={
            resetTimer
          }
        >
          Reset
        </button>

      </div>
    </div>
  );
}

export default Pomodoro;