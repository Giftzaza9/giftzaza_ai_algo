import React from "react";
import Router from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material";

const App: React.FC = () => {
  const theme = createTheme({
    typography: {
      fontFamily: ["DM Sans", "sans-serif"].join(","),
    },
    components: {
      MuiTab: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              color: "#525FE1",
              fontWeight: "700",
            },
            "&.MuiStepIcon-active": { backgoundColor: "red" },
            "&.MuiStepIcon-completed": { backgoundColor: "green" },
            "&.Mui-disabled .MuiStepIcon-root": { backgoundColor: "cyan" },
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Router />

        <ToastContainer
          progressStyle={{ color: "#4318FF" }}
          bodyStyle={{ color: "#00000", fontWeight: "400" }}
          theme="colored"
          hideProgressBar
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
