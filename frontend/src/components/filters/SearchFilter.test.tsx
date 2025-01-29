import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi } from "vitest"; // Import from vitest
import SearchFilter from "./SearchFilter"; // Adjust the import based on your file structure

describe("SearchFilter Component", () => {
  const mockOnSearch = vi.fn(); // Use vi.fn() to create a mock function

  beforeEach(() => {
    render(<SearchFilter onSearch={mockOnSearch} defaultValue="Test" />);
  });

  it("renders the search input and button", () => {
    // Check if the search input is in the document
    const input = screen.getByPlaceholderText(/search books/i);
    expect(input).toBeInTheDocument();
  });

  it("allows user to type in the search input", () => {
    const input = screen.getByPlaceholderText(/search books/i);

    // Simulate typing in the input field
    fireEvent.change(input, { target: { value: "New Search" } });
    expect(input).toHaveValue("New Search");
  });

  it("triggers onSearch with the input value when search button is clicked", () => {
    const input = screen.getByPlaceholderText(/search books/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    // Change input value
    fireEvent.change(input, { target: { value: "New Search" } });

    // Simulate button click
    fireEvent.click(searchButton);
    expect(mockOnSearch).toHaveBeenCalledWith("New Search"); // Check if onSearch is called with the input value
  });
});
