import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserProvider } from "./contexts/UserContext";
import React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

import { Routes, Route } from "react-router-dom";

export const BASE_URL = import.meta.env.VITE_BASEURL;
export const OPENAI_KEY = import.meta.env.VITE_OPENAIKEY;

const defaultTheme = createTheme();

const App: React.FC = () => {
  return (
    <UserProvider>
      <ThemeProvider theme={defaultTheme}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
