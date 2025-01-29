import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Book, GetBooks } from "../../api";
import { Stack, Fab, Typography } from "@mui/material";
import BookItem from "./BookItem";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchFilter from "../filters/SearchFilter";
import PaginationFilter from "../filters/PaginationFilter";
import { useCart } from "../../context/CartContext";

let debounceTimeout: NodeJS.Timeout;

const BooksList = () => {
  const params = new URLSearchParams(window.location.search);
  const initialSearch = params.get("search") || "";
  const initialPage = parseInt(params.get("page") || "1", 10);
  const initialPageSize = parseInt(params.get("pageSize") || "10", 10); // Initialize page size

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize); // New state for page size
  const [_, setTotalPages] = useState<number>(0);

  const { addToCart, cartItems } = useCart();

  const updateUrl = (query: string, page: number, size: number) => {
    const newParams = new URLSearchParams();

    if (query) {
      newParams.set("search", query);
    }
    if (page > 1) {
      newParams.set("page", page.toString());
    }
    if (size !== 10) {
      // Only add pageSize if it's not the default value
      newParams.set("pageSize", size.toString());
    }

    const paramString = newParams.toString();
    const newUrl = paramString
      ? `${window.location.pathname}?${paramString}`
      : window.location.pathname;

    window.history.pushState(null, "", newUrl);
  };

  const fetchBooks = async (query: string, page: number, size: number) => {
    setLoading(true);
    const { books, error, totalPages } = await GetBooks(size, page, query);
    if (error) {
      console.error(error);
      setError(error);
      setLoading(false);
      return;
    }
    setBooks(books || []);
    setTotalPages(totalPages || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks(searchQuery, currentPage, pageSize);
  }, [searchQuery, currentPage, pageSize]); // Add pageSize to the dependency array

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      updateUrl(query, 1, pageSize); // Update URL accordingly
      fetchBooks(query, 1, pageSize); // Fetch new results
    }, 300);
  };

  const handlePageChange = (value: number) => {
    setCurrentPage(value);
    updateUrl(searchQuery, value, pageSize); // Update URL with new page value
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page on page size change
    updateUrl(searchQuery, 1, size); // Update URL with new page size
    fetchBooks(searchQuery, 1, size); // Fetch new results
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleAddToCart = (book: Book) => {
    if (cartItems.find((item) => item.id === book.id)) {
      return;
    }
    addToCart(book);
  };

  return (
    <Stack>
      <SearchFilter onSearch={handleSearch} defaultValue={searchQuery} />
      <PaginationFilter
        currentPage={currentPage}
        pageSize={pageSize} // Pass pageSize to PaginationFilter
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange} // Pass handler for page size change
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
                onAddToCart={handleAddToCart}
              />
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
