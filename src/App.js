import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Main from "./screens/Main";
import Planifier from "./screens/Planifier";
import ResetPassword from "./screens/ResetPassword";
import Statistics from "./screens/Statistics";
import MyProfile from './screens/MyProfile'
import "./styles/Home.css";
import { SnackbarProvider, closeSnackbar } from "notistack";
import Meals from "./screens/Meals";
import { ThemeProvider, createTheme } from "@mui/material";
import Fitness from "./screens/Fitness";
import ProtectedRoute from "./ProtectedRoute";


const customTheme = createTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={customTheme}>
    <div className="Home-header" style={{ backgroundColor: "#CECFC7" }}>
      <SnackbarProvider
          action={(snackbarId) => (
            <button
              onClick={() => {
                closeSnackbar(snackbarId);
              }}
            >
              Dismiss
            </button>
          )}
        >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="main" element={ <ProtectedRoute> <Main /> </ProtectedRoute>} />
          <Route path="meals" element={<ProtectedRoute> <Meals /> </ProtectedRoute>} />
          <Route path="fitness" element={<ProtectedRoute> <Fitness /> </ProtectedRoute>} />
          <Route path="resetPassword" element={ <ResetPassword />} />
          <Route path="statistics" element={<ProtectedRoute> <Statistics /> </ProtectedRoute>} />
          <Route path="planifier" element={<ProtectedRoute> <Planifier /> </ProtectedRoute>} />
          <Route path="myProfile" element={<ProtectedRoute> <MyProfile /> </ProtectedRoute>} />
        </Routes>
      </SnackbarProvider>
    </div>
    </ThemeProvider>
  );
}
