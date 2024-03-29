import "./App.css";
import React, { Fragment, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

//Components
import DashboardUser from "./components/DashboardUser";
import DashboardAdmin from "./components/Admin/DashboardAdmin";
import Login from "./components/Login";
import Register from "./components/Register";
import InfoUser from "./components/InfoUser";
import AdminProducts from "./components/Admin/AdminProducts";
import { UserContext, UserCredentials } from "./components/UserContext";
import AdminStores from "./components/Admin/AdminStores";
import AdminLeaderboard from "./components/Admin/AdminLeaderboard";
import Charts from "./components/Admin/Charts";
import AdminInfo from "./components/Admin/AdminInfo";

function App() {
  //useStates
  const [userCredentials, setUserCredentials] = useState([]);
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
        setRole(checkAuthenticated.user_credentials.user_role);
        setUserCredentials(checkAuthenticated.user_credentials);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  //useEffects
  useEffect(() => {
    checkAuthenticated();
  }, []);

  return (
    <Fragment>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <UserCredentials.Provider
            value={{ userCredentials, setUserCredentials }}
          >
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
                <Route
                  exact
                  path="/infoUser"
                  element={
                    !isAuthenticated ? (
                      <Navigate to="/login" />
                    ) : isAuthenticated && role === 1 ? (
                      <InfoUser />
                    ) : isAuthenticated && role === 0 ? (
                      <InfoUser />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  exact
                  path="/adminproducts"
                  element={
                    !isAuthenticated ? (
                      <Navigate to="/login" />
                    ) : isAuthenticated && role === 1 ? (
                      <AdminProducts />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  exact
                  path="/adminstores"
                  element={
                    !isAuthenticated ? (
                      <Navigate to="/login" />
                    ) : isAuthenticated && role === 1 ? (
                      <AdminStores />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  exact
                  path="/adminleaderboard"
                  element={
                    !isAuthenticated ? (
                      <Navigate to="/login" />
                    ) : isAuthenticated && role === 1 ? (
                      <AdminLeaderboard />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  exact
                  path="/adminchart"
                  element={
                    !isAuthenticated ? (
                      <Navigate to="/login" />
                    ) : isAuthenticated && role === 1 ? (
                      <Charts />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  exact
                  path="/admininfo"
                  element={
                    !isAuthenticated ? (
                      <Navigate to="/login" />
                    ) : isAuthenticated && role === 1 ? (
                      <AdminInfo />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              </Routes>
            </UserContext.Provider>
          </UserCredentials.Provider>
        </Router>
      </LocalizationProvider>
    </Fragment>
  );
}

export default App;
