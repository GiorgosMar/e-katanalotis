import "./App.css";
import React, { Fragment, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//Components
import DashboardUser from "./components/DashboardUser";
import DashboardAdmin from "./components/DashboardAdmin";
import Login from "./components/Login";
import Register from "./components/Register";
import { UserContext } from "./components/UserContext";

function App() {
  //useStates
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const checkAuthenticated = async () => {
    try {
      const resAuth = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: { token: localStorage.token },
      });

      const checkAuthenticated = await resAuth.json();

      if (checkAuthenticated.auth === true) {
        setIsAuthenticated(true);
        setRole(checkAuthenticated.user_credentials);
      } else {
        setIsAuthenticated(false);
        setRole(checkAuthenticated.user_credentials);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  //useEffects
  useEffect(() => {
    checkAuthenticated();
  });

  return (
    <Fragment>
      <Router>
        <UserContext.Provider
          value={{
            isAuthenticated,
            setIsAuthenticated,
            role,
            setRole,
          }}
        >
          <Routes>
            <Route
              index
              path="/"
              element={
                !isAuthenticated ? (
                  <Navigate to="/login" />
                ) : isAuthenticated && role === 1 ? (
                  <Navigate to="/dashboardAdmin" />
                ) : isAuthenticated && role === 0 ? (
                  <Navigate to="/dashboardUser" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              exact
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login />
                ) : isAuthenticated && role === 1 ? (
                  <Navigate to="/dashboardAdmin" />
                ) : isAuthenticated && role === 0 ? (
                  <Navigate to="/dashboardUser" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              exact
              path="/register"
              element={
                !isAuthenticated ? <Register /> : <Navigate to="/login" />
              }
            />
            <Route
              exact
              path="/dashboardUser"
              element={
                !isAuthenticated ? (
                  <Navigate to="/login" />
                ) : isAuthenticated && role === 1 ? (
                  <Navigate to="/dashboardAdmin" />
                ) : isAuthenticated && role === 0 ? (
                  <DashboardUser />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              exact
              path="/dashboardAdmin"
              element={
                !isAuthenticated ? (
                  <Navigate to="/login" />
                ) : isAuthenticated && role === 1 ? (
                  <DashboardAdmin />
                ) : isAuthenticated && role === 0 ? (
                  <Navigate to="/dashboardUser" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </UserContext.Provider>
      </Router>
    </Fragment>
  );
}

export default App;
