import App from "./App";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mocking child components
vi.mock("./components/layout/Appbar/Appbar", () => ({
  default: () => <div>Mock Appbar</div>,
}));
vi.mock("./components/layout/Layout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("./components/Books/BooksList", () => ({
  default: () => <div>Mock BooksList</div>,
}));
vi.mock("./context/CartContext", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

describe("App Component", () => {
  it("renders Appbar and BooksList", () => {
    render(<App />);

    // Check if the Appbar is rendered
    expect(screen.getByText("Mock Appbar")).toBeInTheDocument();

    // Check if the BooksList is rendered
    expect(screen.getByText("Mock BooksList")).toBeInTheDocument();
  });

  it("renders Stack with correct properties", () => {
    render(<App />);

    // Check if the Stack element is present
    const stackElement = screen.getByText("Mock BooksList").parentElement;

    expect(stackElement).toBeInTheDocument();
    // You can add more specific assertions here depending on your testing setup
  });

  it("renders Stack with max width of 1400px", () => {
    render(<App />);

    const stackElement = screen.getByText("Mock BooksList").parentElement;

    // Verify that the Stack has the correct style (this might depend on your testing setup)
    expect(stackElement).toHaveStyle("max-width: 1400px");
  });
});
