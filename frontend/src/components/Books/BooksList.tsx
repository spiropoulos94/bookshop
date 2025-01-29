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

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const pageSize = 30;

  const { addToCart, cartItems } = useCart();

  const updateUrl = (query: string, page: number) => {
    const newParams = new URLSearchParams();

    // Add `search` only if it has a value
    if (query) {
      newParams.set("search", query);
    }

    // Add `page` only if it's greater than 1
    if (page > 1) {
      newParams.set("page", page.toString());
    }

    // Determine if there are any parameters to add
    const paramString = newParams.toString();
    const newUrl = paramString
      ? `${window.location.pathname}?${paramString}`
      : window.location.pathname;

    // Update the URL without reloading the page
    window.history.pushState(null, "", newUrl);
  };

  const fetchBooks = async (query: string, page: number) => {
    setLoading(true);
    const { books, error, totalPages } = await GetBooks(pageSize, page, query);
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
    fetchBooks(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

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
      updateUrl(query, 1); // Update URL accordingly
      fetchBooks(query, 1); // Fetch new results
    }, 300);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    updateUrl(searchQuery, value); // Update URL with new page value
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
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
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
