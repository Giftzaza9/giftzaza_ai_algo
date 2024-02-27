import { createTheme } from "@mui/material";

export const theme = createTheme({
    typography: {
      fontFamily: ['Manrope', 'Inter', 'Roboto'].join(','),
    },
    components: {
    //   MuiTab: {
    //     styleOverrides: {
    //       root: {
    //         "&.Mui-selected": {
    //           color: "#525FE1",
    //           fontWeight: "700",
    //         },
    //         "&.MuiStepIcon-active": { backgoundColor: "red" },
    //         "&.MuiStepIcon-completed": { backgoundColor: "green" },
    //         "&.Mui-disabled .MuiStepIcon-root": { backgoundColor: "cyan" },
    //       },
    //     },
    //   },
    },
  });