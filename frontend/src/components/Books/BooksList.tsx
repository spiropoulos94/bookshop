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
  // Extract query parameters
  const params = new URLSearchParams(window.location.search);
  const initialSearch = params.get("search") || "";
  const initialPage = parseInt(params.get("page") || "1", 10);
  const initialPageSize = parseInt(params.get("pageSize") || "10", 10);
  const initialIsNotMature = params.get("isNotMature") === "true";

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
    isNotMature,
    setIsNotMature,
    fetchBooks, // Expose fetchBooks to re-fetch when toggling mature filter
  } = useBooks(initialSearch, initialPage, initialPageSize, initialIsNotMature);

  const { addToCart } = useCart();
  const [showButton, setShowButton] = useState<boolean>(false);

  // Scroll event listener to show/hide "scroll to top" button
  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to handle "scroll to top"
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Effect to update book list when maturity filter changes
  useEffect(() => {
    fetchBooks();
  }, [isNotMature]);

  const handleToggleMature = (v: boolean) => {
    setIsNotMature(v);
    console.log("Toggled mature filter:", v);
  };

  return (
    <Stack spacing={2}>
      {/* Search Filter */}
      <SearchFilter
        onSearch={setSearchQuery}
        defaultValue={searchQuery}
        isLoading={loading}
      />

      {/* Pagination & Mature Content Filter */}
      <PaginationFilter
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        isLoading={loading}
        isNotMature={isNotMature}
        onToggleMature={(v) => handleToggleMature(v)}
      />

      {/* Book List or Loading Indicator */}
      {loading ? (
        <Loading />
      ) : books.length > 0 ? (
        <Stack spacing={2}>
          {books.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              onAddToCart={() => addToCart(book)}
            />
          ))}
        </Stack>
      ) : (
        <Typography variant="h6">No books found.</Typography>
      )}

      {error && <Typography color="error">Error: {error}</Typography>}

      {/* Scroll to Top Button */}
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
