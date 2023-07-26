import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

import { Routes, Route } from "react-router-dom";
export const UserContext = React.createContext(null);
export const BASE_URL = import.meta.env.VITE_BASEURL;
export const OPENAI_KEY = import.meta.env.VITE_OPENAIKEY;

const defaultTheme = createTheme();
const App: React.FC = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
