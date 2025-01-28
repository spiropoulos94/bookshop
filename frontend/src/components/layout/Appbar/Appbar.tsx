import {
  Box,
  IconButton,
  AppBar as MUIAppbar,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CartButton from "../cart/CartButton";

interface AppbarProps {}

const Appbar = ({}: AppbarProps) => {
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
          <CartButton
            onItemClick={(item) => console.log(item)}
            items={[
              {
                id: 1,
                name: "Scylla Essentials",
                price: 29.99,
              },
              {
                id: 2,
                name: "Scylla Cookbook",
                price: 39.99,
              },
            ]}
          />
        </Toolbar>
      </MUIAppbar>
    </Box>
  );
};

export default Appbar;
