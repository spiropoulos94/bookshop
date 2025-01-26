import React from "react";
import { List, Typography, Divider, MenuItem } from "@mui/material";
import CartItem from "./CartItem";

interface CartDrawerContentProps {
  items: { id: number; name: string; price: number }[];
  onItemClick: (item: { id: number; name: string; price: number }) => void;
}

const CartDrawerContent: React.FC<CartDrawerContentProps> = ({
  items,
  onItemClick,
}) => {
  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  return (
    <List sx={{ width: 250, backgroundColor: "#333", color: "white" }}>
      {/* Header for Total Price */}
      <Typography variant="h6" sx={{ padding: 2 }}>
        Total: ${totalPrice.toFixed(2)}
      </Typography>
      <Divider sx={{ backgroundColor: "white" }} />

      {items.length > 0 ? (
        items.map((item) => (
          <CartItem key={item.id} item={item} onClick={onItemClick} />
        ))
      ) : (
        <MenuItem disabled>
          <Typography variant="body2">Your cart is empty</Typography>
        </MenuItem>
      )}
    </List>
  );
};

export default CartDrawerContent;
