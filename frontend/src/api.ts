import { BACKEND_API_URL } from "./constants";

// Define the structure of a Book
export interface Book {
  id: string;
  title: string;
  description: string;
  pageCount: number;
  price: number;
  maturityRating: string;
  thumbnail: string;
  isbn?: string; // Optional field
  revisionNumber?: number; // Optional field
}

// Define the structure of the API response
export interface GetBooksResponse {
  data?: Book[]; // The data returned when the request is successful
  error?: string; // The error message if the request fails
}

export const GetBooks = async (
  pageSize: number = 40,
  startIndex: number = 0
): Promise<GetBooksResponse> => {
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/books?pageSize=${pageSize}&startIndex=${startIndex}`
    ); // Mock API URL
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Book[] = await response.json(); // Type the response as Book[]
    return { data }; // Return the data if the fetch is successful
  } catch (error) {
    // Type assertion to assume error is an instance of Error
    return { error: (error as Error).message || "An unknown error occurred" };
  }
};
