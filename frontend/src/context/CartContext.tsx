"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Book } from "../api";

export interface CartItem extends Book {
  quantity: number;
}

// Define the CartContext data type.
export type CartContextData = {
  cartItems: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  addToCart: (book: Book) => void;
  deleteFromCart: (bookId: string) => void;
  incrementQuantity: (bookId: string) => void;
  decrementQuantity: (bookId: string) => void;
  setQuantity: (bookId: string, quantity: number) => void;
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

// Key for localStorage
const CART_STORAGE_KEY = "cartItems";

// Create the CartContext provider component.
export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  // Persist cart items to localStorage when cartItems change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (book: Book) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...book, quantity: 1 }];
    });
  };

  const deleteFromCart = (bookId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId));
  };

  const incrementQuantity = (bookId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const setQuantity = (bookId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const decrementQuantity = (bookId: string) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.id === bookId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[])
    );
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate total quantity
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const value: CartContextData = {
    cartItems,
    totalPrice,
    totalQuantity,
    addToCart,
    deleteFromCart,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
