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
        color: theme.palette.primary.main,
        mb: 2,
        "&:hover": {
          opacity: 0.9,
          "& .MuiTypography-root": {
            textDecoration: "underline", // Apply underline on Typography on MenuItem hover
          },
        },
      }}
    >
      <Typography
        variant="body2"
        color={theme.palette.primary.main}
        sx={{
          transition: "text-decoration 0.3s", // Smooth transition for the underline
        }}
      >
        {item.name} - ${item.price.toFixed(2)}
      </Typography>
    </MenuItem>
  );
};

export default CartItem;
