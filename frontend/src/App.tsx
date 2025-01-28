import Appbar from "./components/layout/Appbar/Appbar";
import Layout from "./components/layout/Layout";
import BooksList from "./components/Books/BooksList";
import { Stack } from "@mui/material";

function App() {
  return (
    <Layout>
      <Appbar />
      <Stack
        maxWidth={"1400px"}
        width={"100%"}
        mx={"auto"}
        px={{
          xs: 2,
          sm: 5,
          md: 10,
        }}
      >
        <BooksList />
      </Stack>
    </Layout>
  );
}

export default App;
