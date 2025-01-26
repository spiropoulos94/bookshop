import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Your primary color
    },
    secondary: {
      main: "#1e88e5", // A lighter shade for hover effects
    },
    background: {
      default: "#f5f5f5", // Default background color
    },
    text: {
      primary: "#FFFFFF", // Text color for dark backgrounds
    },
  },
});

export default theme;
