import { useEffect, useState } from "react";
import { Book, GetBooks } from "../api";

const useBooks = (
  initialSearch: string,
  initialPage: number,
  initialPageSize: number,
  initialIsNotMature: boolean
) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isNotMature, setIsNotMature] = useState<boolean>(initialIsNotMature);

  const updateUrl = () => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set("search", searchQuery);
    newParams.set("page", currentPage.toString());
    newParams.set("pageSize", pageSize.toString());
    newParams.set("isNotMature", isNotMature.toString());

    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.pushState(null, "", newUrl);
  };

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const { books, error, totalPages } = await GetBooks(
        pageSize,
        currentPage,
        searchQuery,
        isNotMature
      );

      if (error) throw new Error(error);

      setBooks(books || []);
      setTotalPages(totalPages || 0);
    } catch (err) {
      setError((err as Error).message);
      setBooks([]); // Reset books on error
    } finally {
      setLoading(false);
    }
  };

  // Sync URL & Fetch books on state change
  useEffect(() => {
    updateUrl();
    fetchBooks();
  }, [searchQuery, currentPage, pageSize, isNotMature]);

  return {
    books,
    loading,
    error,
    searchQuery,
    setSearchQuery: (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    },
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    fetchBooks,
    isNotMature,
    setIsNotMature,
  };
};

export default useBooks;
