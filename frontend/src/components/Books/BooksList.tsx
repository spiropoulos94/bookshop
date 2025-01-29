import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Stack, Fab, Typography } from "@mui/material";
import BookItem from "./BookItem";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchFilter from "../filters/SearchFilter";
import PaginationFilter from "../filters/PaginationFilter";
import { useCart } from "../../context/CartContext";
import useBooks from "../../hooks/useBooks"; // Import the hook

const BooksList = () => {
  const params = new URLSearchParams(window.location.search);
  const initialSearch = params.get("search") || "";
  const initialPage = parseInt(params.get("page") || "1", 10);
  const initialPageSize = parseInt(params.get("pageSize") || "10", 10);

  const {
    books,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = useBooks(initialSearch, initialPage, initialPageSize);

  const { addToCart } = useCart();
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
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

  return (
    <Stack>
      <SearchFilter
        onSearch={setSearchQuery}
        defaultValue={searchQuery}
        isLoading={loading}
      />
      <PaginationFilter
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        isLoading={loading}
      />
      {loading ? (
        <Loading />
      ) : (
        <Stack>
          {books.length > 0 ? (
            books.map((book) => (
              <BookItem
                key={book.id}
                book={book}
                onAddToCart={() => addToCart(book)}
              />
            ))
          ) : (
            <Typography variant="h6">No books found.</Typography>
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
