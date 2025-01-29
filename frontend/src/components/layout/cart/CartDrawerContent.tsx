import React from "react";
import { List, Typography, Divider, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CartItem as CartItemType,
  useCart,
} from "../../../context/CartContext";
import CartItem from "./CartItem";

interface CartDrawerContentProps {
  items: CartItemType[];
}

const CartDrawerContent: React.FC<CartDrawerContentProps> = ({ items }) => {
  const theme = useTheme(); // Get theme from context

  const { totalPrice } = useCart();

  // Calculate total price

  return (
    <List
      sx={{
        width: 250,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
      }}
    >
      {/* Header for Total Price */}
      <Typography variant="h6" sx={{ padding: 2 }}>
        Total: ${totalPrice.toFixed(2)}
      </Typography>
      <Divider
        sx={{
          backgroundColor: theme.palette.primary.main,
          mb: 1,
        }}
      />

      {items.length > 0 ? (
        items.map((item) => <CartItem key={item.id} item={item} />)
      ) : (
        <Box p={2} width={"100%"} textAlign={"center"}>
          <Typography
            component={"div"}
            width={"100%"}
            color={theme.palette.primary.main}
          >
            Your cart is empty
          </Typography>
        </Box>
      )}
    </List>
  );
};

export default CartDrawerContent;
