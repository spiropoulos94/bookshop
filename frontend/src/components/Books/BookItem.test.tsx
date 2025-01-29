import { render, screen } from "@testing-library/react";
import BookItem from "./BookItem"; // Adjust the import path as necessary
import { Book } from "../../api";

// Mock book data
const mockBook: Book = {
  id: "1",
  title: "Test Book",
  description: "This is a test description for the Test Book.",
  price: 19.99,
  pageCount: 300,
  revisionNumber: 1,
  thumbnail: "",
  maturityRating: "NOT_MATURE",
};

// Mock function for adding to cart
const mockAddToCart = vi.fn();

describe("BookItem Component", () => {
  it("renders book details correctly", () => {
    render(<BookItem book={mockBook} onAddToCart={mockAddToCart} />);

    // Check book title
    expect(screen.getByText("Test Book")).toBeInTheDocument();

    // Check book description
    expect(screen.getByText(/This is a test description/i)).toBeInTheDocument();

    // Check price
    expect(screen.getByText("$19.99")).toBeInTheDocument();

    // Check page count
    expect(screen.getByText("Pages: 300")).toBeInTheDocument();

    // Check that the placeholder image is rendered
    expect(screen.getByText("No Image")).toBeInTheDocument();
  });
});
