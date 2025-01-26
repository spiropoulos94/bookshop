import React, { useState } from "react";
import { Badge, IconButton, Drawer, useTheme } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartDrawerContent from "./CartDrawerContent";

interface CartButtonProps {
  items: { id: number; name: string; price: number }[];
  onItemClick?: (item: { id: number; name: string; price: number }) => void;
}

const CartButton: React.FC<CartButtonProps> = ({ items, onItemClick }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme(); // Get theme from context

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
          badgeContent={items.length}
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
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.primary,
          },
        }}
      >
        <CartDrawerContent
          items={items}
          onItemClick={(item) => onItemClick && onItemClick(item)}
        />
      </Drawer>
    </>
  );
};

export default CartButton;
