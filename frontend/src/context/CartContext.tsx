"use client";

import { createContext, useContext, useState } from "react";
import { Book } from "../api";

// Define the CartItem interface that extends Book.
export interface CartItem extends Book {
  quantity: number; // New property to manage item quantity in the cart
}

// Define the CartContext data type.
export type CartContextData = {
  cartItems: CartItem[];
  totalPrice: number; // Add totalPrice to the context data
  addToCart: (book: Book) => void;
  deleteFromCart: (bookId: string) => void;
  incrementQuantity: (bookId: string) => void; // New method
  decrementQuantity: (bookId: string) => void; // New method
};

// Create the CartContext.
export const CartContext = createContext<CartContextData | undefined>(
  undefined
);

// Create a custom hook to use the CartContext.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Create the CartContext provider component.
export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (book: Book) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id);
      if (existingItem) {
        // If the item already exists in the cart, increase its quantity
        return prevItems.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Otherwise, add it to the cart with a quantity of 1
      return [...prevItems, { ...book, quantity: 1 }];
    });
  };

  const deleteFromCart = (bookId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Increment the quantity of a specified book in the cart
  const incrementQuantity = (bookId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrement the quantity of a specified book in the cart
  const decrementQuantity = (bookId: string) => {
    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find((item) => item.id === bookId);
      if (itemToUpdate) {
        if (itemToUpdate.quantity > 1) {
          // If quantity is greater than 1, decrease it
          return prevItems.map((item) =>
            item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
          );
        } else {
          // If quantity is 1, remove the item from the cart
          return prevItems.filter((item) => item.id !== bookId);
        }
      }
      return prevItems; // Return unchanged if item not found
    });
  };

  // Calculate the total price once and store it in a variable
  const totalPrice = calculateTotalPrice();

  const value: CartContextData = {
    cartItems,
    totalPrice, // Include totalPrice in the context value
    addToCart,
    deleteFromCart,
    incrementQuantity,
    decrementQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
