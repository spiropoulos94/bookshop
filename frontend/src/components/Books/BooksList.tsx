import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Book, GetBooks } from "../../api";
import { Stack, Fab } from "@mui/material";
import BookItem from "./BookItem";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchFilter from "../filters/SearchFilter";

type Props = {};

const BooksList = ({}: Props) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { books, error } = await GetBooks();
      if (error) {
        console.error(error);
        setError(error);
        setLoading(false);
        return;
      }
      console.log({ books });
      setBooks(books || []);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const addToCart = (book: Book) => {
    console.log("Adding to cart", book);
  };

  const handleSearch = (query: string) => {
    console.log("Searching for", query);
  };

  return (
    <Stack maxWidth={"1200px"} mx={"auto"} padding={3}>
      <SearchFilter onSearch={handleSearch} />
      <Stack>
        {books.map((book) => (
          <BookItem key={book.id} book={book} onAddToCart={addToCart} />
        ))}
      </Stack>
      {/* Show Back to Top button with smooth transition */}
      <Fab
        color="primary"
        aria-label="scroll back to top"
        onClick={handleScrollToTop}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          opacity: showButton ? 1 : 0,
          visibility: showButton ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Stack>
  );
};

export default BooksList;
