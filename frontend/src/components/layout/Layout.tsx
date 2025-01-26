import { Stack } from "@mui/material";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Stack
      height={"100vh"}
      width={"100vw"}
      boxSizing={"border-box"}
      minWidth={"330px"}
    >
      {children}
    </Stack>
  );
};

export default Layout;
