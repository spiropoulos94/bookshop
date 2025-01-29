import React, { useState } from "react";
import { Badge, IconButton, Drawer, useTheme } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartDrawerContent from "./CartDrawerContent";
import {
  CartItem as CartItemType,
  useCart,
} from "../../../context/CartContext";

const CartButton = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cartItems: items, totalQuantity } = useCart();
  const theme = useTheme();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        aria-label="my cart"
        sx={{
          color: "inherit",
        }}
      >
        <Badge
          badgeContent={totalQuantity}
          color="secondary"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.75rem",
              height: 18,
              minWidth: 18,
            },
          }}
        >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <CartDrawerContent items={items} />
      </Drawer>
    </>
  );
};

export default CartButton;
