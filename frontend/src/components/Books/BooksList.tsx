import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Book, GetBooks } from "../../api";
import { Stack, Fab } from "@mui/material";
import BookItem from "./BookItem";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type Props = {};

const BooksList = ({}: Props) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { data, error } = await GetBooks();
      if (error) {
        console.error(error);
        setError(error);
        setLoading(false);
        return;
      }
      console.log({ data });
      setBooks(data || []);
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

  return (
    <>
      <Stack padding={2} maxWidth={"1200px"} mx={"auto"}>
        {books.map((book) => (
          <BookItem key={book.id} book={book} onAddToCart={addToCart} />
        ))}
      </Stack>
      {/* Show Back to Top button only if user scrolled down */}
      {showButton && (
        <Fab
          color="primary"
          aria-label="scroll back to top"
          onClick={handleScrollToTop}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </>
  );
};

export default BooksList;
