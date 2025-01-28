import { useEffect, useState } from "react";
import { BACKEND_API_URL } from "../../constants";

type Props = {};

const BooksList = ({}: Props) => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/api/books`); // Mock API URL
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log({ data });
        setBooks(data);
      } catch (error) {
        console.log({ error });
        // setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Books List</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li> // Assuming each book has an id and title
        ))}
      </ul>
    </div>
  );
};

export default BooksList;
