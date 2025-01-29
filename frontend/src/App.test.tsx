import App from "./App";
import { render, screen } from "@testing-library/react";

// Mocking child components
vi.mock("./components/layout/Appbar/Appbar", () => ({
  default: () => <div>Mock Appbar</div>,
}));
vi.mock("./components/layout/Layout", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("./components/Books/BooksList", () => ({
  default: () => <div>Mock BooksList</div>,
}));
vi.mock("./context/CartContext", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("App Component", () => {
  it("renders Appbar and BooksList", () => {
    render(<App />);

    expect(screen.getByText("Mock Appbar")).toBeInTheDocument();

    expect(screen.getByText("Mock BooksList")).toBeInTheDocument();
  });

  it("renders Stack with correct properties", () => {
    render(<App />);

    const stackElement = screen.getByText("Mock BooksList").parentElement;

    expect(stackElement).toBeInTheDocument();
  });

  it("renders Stack with max width of 1400px", () => {
    render(<App />);

    const stackElement = screen.getByText("Mock BooksList").parentElement;

    expect(stackElement).toHaveStyle("max-width: 1400px");
  });
});
