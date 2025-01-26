import React from "react";
import { MenuItem, Typography } from "@mui/material";

interface CartItemProps {
  item: { id: number; name: string; price: number };
  onClick: (item: { id: number; name: string; price: number }) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onClick }) => {
  return (
    <MenuItem
      onClick={() => onClick(item)}
      sx={{
        "&:hover": {
          backgroundColor: "#444",
        },
      }}
    >
      <Typography variant="body2">
        {item.name} - ${item.price.toFixed(2)}
      </Typography>
    </MenuItem>
  );
};

export default CartItem;
