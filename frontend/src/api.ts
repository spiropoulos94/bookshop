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
  books?: Book[]; // The data returned when the request is successful
  error?: string; // The error message if the request fails
  totalPages?: number; // The total number of pages
  currentPage?: number; // The current page number
  pageSize?: number; // The number of books per page
}

export const GetBooks = async (
  pageSize: number = 10,
  page: number = 1,
  searchTerm?: string, // Make searchTerm optional
  isNotMature: boolean = false
): Promise<GetBooksResponse> => {
  try {
    const url = new URL(`${BACKEND_API_URL}/api/books`);

    url.searchParams.append("pageSize", pageSize.toString());
    url.searchParams.append("page", page.toString());

    if (searchTerm) url.searchParams.append("search", searchTerm); // Only add if searchTerm has a value
    if (isNotMature) url.searchParams.append("isNotMature", "true"); // Only add if true

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Error fetching books");
    }

    return await response.json();
  } catch (error) {
    console.error("GetBooks API Error:", error);
    return {
      books: [],
      totalPages: 0,
      error: (error as Error).message || "An unknown error occurred",
    };
  }
};
