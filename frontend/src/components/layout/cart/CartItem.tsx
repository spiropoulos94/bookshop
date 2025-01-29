import React from "react";
import { Box, IconButton, MenuItem, Typography, useTheme } from "@mui/material";
import {
  CartItem as CartItemType,
  useCart,
} from "../../../context/CartContext";
import { PlaceholderImage } from "../../Books/BookItem";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const theme = useTheme(); // Get theme from context
  const { incrementQuantity, decrementQuantity } = useCart();

  // Calculate the total price
  const totalPrice = item.price * item.quantity;

  return (
    <MenuItem
      sx={{
        color: theme.palette.primary.main,
        mb: 2,
        display: "flex",
        alignItems: "flex-start",
        "&:hover": {
          opacity: 0.9,
        },
      }}
    >
      {/* Thumbnail */}
      <Box
        flexShrink={0}
        width={40}
        height={60}
        overflow="hidden"
        borderRadius={1}
        border={`1px solid ${theme.palette.divider}`}
        mr={2}
      >
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            width={40}
            height={60}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <PlaceholderImage />
        )}
      </Box>

      {/* Title and Price Information */}
      <Box flex={1}>
        {/* Title */}
        <Typography
          variant="body2"
          color={theme.palette.primary.main}
          sx={{ mb: 0.5 }}
        >
          {item.title}
        </Typography>

        {/* Price, Quantity, and Total */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          ${item.price.toFixed(2)} x {item.quantity} = ${totalPrice.toFixed(2)}
        </Typography>

        {/* Quantity Controls */}
        <Box display="flex" alignItems="center">
          <IconButton
            size="small"
            onClick={() => decrementQuantity(item.id)}
            sx={{
              p: 0,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>

          <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
            {item.quantity}
          </Typography>

          <IconButton
            size="small"
            onClick={() => incrementQuantity(item.id)}
            sx={{
              p: 0,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </MenuItem>
  );
};

export default CartItem;
