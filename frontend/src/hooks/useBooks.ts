import { useEffect, useState } from "react";
import { Book, GetBooks } from "../api";

const useBooks = (
  initialSearch: string,
  initialPage: number,
  initialPageSize: number
) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [totalPages, setTotalPages] = useState<number>(0);

  const updateUrl = (query: string, page: number, size: number) => {
    const newParams = new URLSearchParams();
    if (query) newParams.set("search", query);
    newParams.set("page", page.toString());
    newParams.set("pageSize", size.toString());

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
    updateUrl(searchQuery, currentPage, pageSize);
    fetchBooks(searchQuery, currentPage, pageSize);
  }, [searchQuery, currentPage, pageSize]);

  return {
    books,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    fetchBooks,
  };
};

export default useBooks;
