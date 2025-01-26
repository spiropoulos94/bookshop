import { Stack } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../styles/theme";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Stack
        height={"100vh"}
        width={"100vw"}
        boxSizing={"border-box"}
        minWidth={"330px"}
      >
        {children}
      </Stack>
    </ThemeProvider>
  );
};

export default Layout;
