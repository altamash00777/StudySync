// import {useState,useEffect,} from "react";

// import "./Notes.css";

// import { db } from "../firebase";

// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";

// function Notes() {
//   const [title, setTitle] = useState("");

//   const [noteText,setNoteText,] = useState("");

//   const [date, setDate] =useState("");

//   const [notes, setNotes] =useState([]);

//   // Fetch Notes
//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const fetchNotes =
//     async () => {
//       try {
//         const querySnapshot =
//           await getDocs(
//             collection(
//               db,
//               "notes"
//             )
//           );

//         const notesList =
//           querySnapshot.docs.map(
//             (doc) => ({
//               id: doc.id,
//               ...doc.data(),
//             })
//           );

//         setNotes(
//           notesList
//         );
//       } catch (error) {
//         console.log(error);
//       }
//     };

//   // Add Note
//   const addNote =
//     async () => {
//       if (
//         !title ||
//         !noteText ||
//         !date
//       ) {
//         alert(
//           "Please add note"
//         );
//         return;
//       }

//       try {
//         await addDoc(
//           collection(
//             db,
//             "notes"
//           ),
//           {
//             title:
//               title,
//             text:
//               noteText,
//             date:
//               date,
//             createdAt:
//               new Date(),
//           }
//         );

//         setTitle("");
//         setNoteText("");
//         setDate("");

//         fetchNotes();
//       } catch (error) {
//         console.log(error);
//       }
//     };

//   // Delete Note
//   const deleteNote =
//     async (id) => {
//       try {
//         await deleteDoc(
//           doc(
//             db,
//             "notes",
//             id
//           )
//         );

//         fetchNotes();
//       } catch (error) {
//         console.log(error);
//       }
//     };

//   return (
//     <div className="notes-container">
//       <h1>
//         Study Notes
//       </h1>

//       {/* Input Box */}
//       <div className="notes-form">
//         <input
//           type="text"
//           placeholder="Enter note title"
//           value={
//             title
//           }
//           onChange={(
//             e
//           ) =>
//             setTitle(
//               e.target.value
//             )
//           }
//         />

//         <input
//           type="date"
//           value={date}
//           onChange={(
//             e
//           ) =>
//             setDate(
//               e.target.value
//             )
//           }
//         />

//         <textarea
//           placeholder="Write your notes here..."
//           value={
//             noteText
//           }
//           onChange={(
//             e
//           ) =>
//             setNoteText(
//               e.target.value
//             )
//           }
//         ></textarea>

//         <button
//           onClick={
//             addNote
//           }
//         >
//           Add Note
//         </button>
//       </div>

//       {/* Notes List */}
//       <div className="notes-grid">
//         {notes.length ===
//         0 ? (
//           <h3 className="empty-note">
//             No notes added yet
//             📝
//           </h3>
//         ) : (
//           notes.map(
//             (note) => (
//               <div
//                 className="note-card"
//                 key={
//                   note.id
//                 }
//               >
//                 <div className="note-top">
//                   <h2>
//                     {
//                       note.title
//                     }
//                   </h2>

//                   <span>
//                     {
//                       note.date
//                     }
//                   </span>
//                 </div>

//                 <p>
//                   {
//                     note.text
//                   }
//                 </p>

//                 <button
//                   onClick={() =>
//                     deleteNote(
//                       note.id
//                     )
//                   }
//                 >
//                   Delete
//                 </button>
//               </div>
//             )
//           )
//         )}
//       </div>
//     </div>
//   );
// }

// export default Notes;


import { useState, useEffect } from "react";
import "./Notes.css";

import { db, auth } from "../firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

function Notes() {
  const [title, setTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);

  /* 🔐 Auth Listener */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  /* 📡 Real-time Notes Fetch */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "notes")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(notesList);
    });

    return () => unsubscribe();
  }, [user]);

  /* ➕ Add Note */
  const addNote = async () => {
    if (!user) return;

    if (!title || !noteText || !date) {
      alert("Please add note");
      return;
    }

    try {
      await addDoc(
        collection(db, "users", user.uid, "notes"),
        {
          title,
          text: noteText,
          date,
          createdAt: serverTimestamp(),
        }
      );
updateStreak();
      setTitle("");
      setNoteText("");
      setDate("");
    } catch (error) {
      console.log(error);
    }
  };

  /* ❌ Delete Note */
  const deleteNote = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(
        doc(db, "users", user.uid, "notes", id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* 🚫 Not logged in UI */
  if (!user) {
    return <h3>Please login to access your notes...</h3>;
  }

  return (
    <div className="notes-container">
      <h1>Study Notes</h1>

      {/* Input Box */}
      <div className="notes-form">
        <input
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <textarea
          placeholder="Write your notes here..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        ></textarea>

        <button onClick={addNote}>Add Note</button>
      </div>

      {/* Notes List */}
      <div className="notes-grid">
        {notes.length === 0 ? (
          <h3 className="empty-note">
            No notes added yet 📝
          </h3>
        ) : (
          notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-top">
                <h2>{note.title}</h2>
                <span>{note.date}</span>
              </div>

              <p>{note.text}</p>

              <button onClick={() => deleteNote(note.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;