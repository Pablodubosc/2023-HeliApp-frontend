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
import { SnackbarProvider } from "notistack";
import Meals from "./screens/Meals";
import { ThemeProvider, createTheme } from "@mui/material";
import Fitness from "./screens/Fitness";


const customTheme = createTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={customTheme}>
    <div className="Home-header" style={{ backgroundColor: "#CECFC7" }}>
      <SnackbarProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="main" element={<Main />} />
          <Route path="meals" element={<Meals />} />
          <Route path="fitness" element={<Fitness />} />
          <Route path="resetPassword" element={<ResetPassword />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="planifier" element={<Planifier />} />
          <Route path="myProfile" element={<MyProfile />} />
        </Routes>
      </SnackbarProvider>
    </div>
    </ThemeProvider>
  );
}
