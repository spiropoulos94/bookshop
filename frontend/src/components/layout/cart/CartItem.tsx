import React from "react";
import { MenuItem, Typography, useTheme } from "@mui/material";

interface CartItemProps {
  item: { id: number; name: string; price: number };
  onClick: (item: { id: number; name: string; price: number }) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onClick }) => {
  const theme = useTheme(); // Get theme from context

  return (
    <MenuItem
      onClick={() => onClick(item)}
      sx={{
        "&:hover": {
          backgroundColor: theme.palette.primary.main, // Lighter shade for hover
        },
      }}
    >
      <Typography variant="body2" color={theme.palette.text.primary}>
        {item.name} - ${item.price.toFixed(2)}
      </Typography>
    </MenuItem>
  );
};

export default CartItem;
