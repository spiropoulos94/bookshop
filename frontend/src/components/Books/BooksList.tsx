import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Book, GetBooks } from "../../api";
import { Stack, Fab, Typography, Pagination } from "@mui/material";
import BookItem from "./BookItem";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchFilter from "../filters/SearchFilter";

const BooksList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const [totalPages, setTotalPages] = useState<number>(0); // Total pages state
  const pageSize = 30; // Define the number of books per page

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { books, error, totalPages } = await GetBooks(
        pageSize,
        currentPage
      ); // Fetch books with pagination
      if (error) {
        console.error(error);
        setError(error);
        setLoading(false);
        return;
      }
      setBooks(books || []);
      setTotalPages(totalPages || 0); // Set total pages
      setLoading(false);
    };
    fetchBooks();
    setSearchQuery(""); // Reset search query on page change
  }, [currentPage]); // Fetch books when currentPage changes

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const addToCart = (book: Book) => {
    console.log("Adding to cart", book);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
    console.log("Searching for", query);
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value); // Update current page on pagination change
  };

  return (
    <Stack>
      <SearchFilter onSearch={handleSearch} />
      <Pagination
        count={totalPages} // Use totalPages from API response
        page={currentPage} // Current page state
        onChange={handlePageChange} // Handle page change
        variant="outlined"
        color="primary"
        sx={{
          mb: 2,
        }}
      />
      {loading ? (
        <Loading />
      ) : (
        <Stack>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookItem key={book.id} book={book} onAddToCart={addToCart} />
            ))
          ) : (
            <Typography variant="h6">
              No books found for the search query: "{searchQuery}"
            </Typography>
          )}
        </Stack>
      )}

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
