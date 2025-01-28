import Appbar from "./components/layout/Appbar/Appbar";
import Layout from "./components/layout/Layout";
import BooksList from "./components/Books/BooksList";

function App() {
  return (
    <Layout>
      <Appbar />
      <BooksList />
    </Layout>
  );
}

export default App;
