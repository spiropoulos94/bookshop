import {
  Box,
  IconButton,
  AppBar as MUIAppbar,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CartButton from "../cart/CartButton";
import { useCart } from "../../../context/CartContext";

const Appbar = () => {
  return (
    <Box>
      <MUIAppbar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuBookIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            fontSize={{
              xs: "1rem",
              sm: "1.4rem",
            }}
          >
            ScyllaDB Bookshop
          </Typography>
          {/* Cart Button Here */}
          <CartButton />
        </Toolbar>
      </MUIAppbar>
    </Box>
  );
};

export default Appbar;
