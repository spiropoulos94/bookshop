import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Book, GetBooks } from "../../api";
import { Stack } from "@mui/material";
import BookItem from "./BookItem";

type Props = {};

const BooksList = ({}: Props) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    <Stack padding={2} maxWidth={"1200px"} mx={"auto"}>
      {books.map((book) => (
        <BookItem book={book} onAddToCart={addToCart} />
      ))}
    </Stack>
  );
};

export default BooksList;
