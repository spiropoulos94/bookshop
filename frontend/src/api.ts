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
  searchTerm: string = "nosql",
  isNotMature: boolean = false
): Promise<GetBooksResponse> => {
  try {
    let apiUrl = `${BACKEND_API_URL}/api/books?search=${encodeURIComponent(
      searchTerm
    )}&pageSize=${pageSize}&page=${page}`;

    if (isNotMature) {
      apiUrl += "&isNotMature=true"; // Append only if true
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Error with the API response");
    }

    return await response.json();
  } catch (error) {
    console.error("GetBooks API Error:", error);
    return { error: (error as Error).message || "An unknown error occurred" };
  }
};
