import React, { useState } from "react";
import {
  Box,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CartItem as CartItemType,
  useCart,
} from "../../../context/CartContext";
import { PlaceholderImage } from "../../Books/BookItem";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const theme = useTheme();
  const {
    incrementQuantity,
    decrementQuantity,
    setQuantity: updateQuantity,
    deleteFromCart,
  } = useCart();
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState(String(item.quantity));

  const handleIncrement = () => {
    if (item.quantity < 100) {
      incrementQuantity(item.id);
      setInputValue(String(item.quantity + 1));
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      decrementQuantity(item.id);
      setInputValue(String(item.quantity - 1));
      setError(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleBlur = () => {
    let quantity = parseInt(inputValue, 10);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    } else if (quantity > 100) {
      quantity = 100;
    }
    updateQuantity(item.id, quantity);
    setInputValue(String(quantity));
    setError(quantity > 100);
  };

  return (
    <MenuItem
      sx={{
        color: theme.palette.primary.main,
        mb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "default",
        overflow: "hidden",
        "&:hover": { opacity: 0.9 },
      }}
    >
      <IconButton
        size="small"
        onClick={() => deleteFromCart(item.id)}
        sx={{
          p: 0,
          color: theme.palette.error.main,
          "&:hover": { backgroundColor: "transparent" },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Box
        flexShrink={0}
        width={40}
        height={60}
        overflow="hidden"
        borderRadius={1}
        border={`1px solid ${theme.palette.divider}`}
        mx={2}
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

      <Box flex={1}>
        <Typography
          variant="body2"
          color={theme.palette.primary.main}
          sx={{ mb: 0.5, textWrap: "wrap" }}
        >
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          ${item.price.toFixed(2)} x {item.quantity} = $
          {(item.price * item.quantity).toFixed(2)}
        </Typography>

        <Box display="flex" alignItems="center">
          <IconButton
            size="small"
            onClick={handleDecrement}
            sx={{ p: 0, color: theme.palette.primary.main }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>

          <TextField
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            variant="outlined"
            size="small"
            inputProps={{
              style: {
                textAlign: "center",
                width: 30,
                height: 10,
                color: theme.palette.primary.main,
              },
              maxLength: 3,
            }}
            sx={{ mx: 1 }}
          />

          <IconButton
            size="small"
            onClick={handleIncrement}
            sx={{ p: 0, color: theme.palette.primary.main }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
        {error && (
          <Typography variant="body2" color={theme.palette.error.main}>
            Sorry! Number invalid
          </Typography>
        )}
      </Box>
    </MenuItem>
  );
};

export default CartItem;
