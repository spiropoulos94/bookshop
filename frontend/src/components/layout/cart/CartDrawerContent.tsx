import React from "react";
import { List, Typography, Divider, MenuItem } from "@mui/material";
import CartItem from "./CartItem";
import { useTheme } from "@mui/material/styles";

interface CartDrawerContentProps {
  items: { id: number; name: string; price: number }[];
  onItemClick: (item: { id: number; name: string; price: number }) => void;
}

const CartDrawerContent: React.FC<CartDrawerContentProps> = ({
  items,
  onItemClick,
}) => {
  const theme = useTheme(); // Get theme from context

  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  return (
    <List
      sx={{
        width: 250,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
      }}
    >
      {/* Header for Total Price */}
      <Typography variant="h6" sx={{ padding: 2 }}>
        Total: ${totalPrice.toFixed(2)}
      </Typography>
      <Divider sx={{ backgroundColor: theme.palette.secondary.main }} />

      {items.length > 0 ? (
        items.map((item) => (
          <CartItem key={item.id} item={item} onClick={onItemClick} />
        ))
      ) : (
        <MenuItem disabled>
          <Typography variant="body2" color={theme.palette.text.primary}>
            Your cart is empty
          </Typography>
        </MenuItem>
      )}
    </List>
  );
};

export default CartDrawerContent;
