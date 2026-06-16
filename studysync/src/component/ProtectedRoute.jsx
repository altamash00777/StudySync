// import { Navigate }
// from "react-router-dom";

// import {
//   useAuth
// } from "../context/AuthContext";

// function ProtectedRoute({
//   children
// }) {

//   const {
//     currentUser
//   } = useAuth();

//   if (!currentUser) {

//     return (
//       <Navigate
//         to="/login"
//       />
//     );
//   }

//   return children;
// }

// export default ProtectedRoute;

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function ProtectedRoute() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>; // or spinner UI
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;