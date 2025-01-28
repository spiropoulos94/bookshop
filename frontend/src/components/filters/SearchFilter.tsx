import {
  Box,
  InputAdornment,
  styled,
  TextField,
  IconButton,
  Button,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface SearchFilterProps {
  onSearch: (search: string) => void;
  defaultValue?: string;
}

const Searchbar = styled(TextField)(() => ({
  marginLeft: "auto",
  borderRadius: "50px",
  overflow: "hidden",
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    color: "black",
    "& fieldset": {
      borderColor: "#E5E5E5",
    },
    "&:hover fieldset": {
      borderColor: "#E5E5E5",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#E5E5E5",
    },
  },
}));

const SearchFilter = ({ onSearch, defaultValue = "" }: SearchFilterProps) => {
  const [searchValue, setSearchValue] = useState<string>(defaultValue);
  const isMobile = useMediaQuery("(max-width:600px)"); // Detect mobile screen size

  const handleSearchClick = () => {
    onSearch(searchValue); // Trigger the search action
  };

  const handleClear = () => {
    setSearchValue(""); // Clear the input
    onSearch(""); // Notify parent about the cleared input
  };

  return (
    <Box
      pt={"24px"}
      pb={"16px"}
      ml={"auto"}
      mb={"20px"}
      display="flex"
      flexDirection={isMobile ? "column" : "row"} // Stack on mobile, row on larger screens
      gap="8px" // Add spacing between elements
      alignItems="center"
      width={{
        xs: "100%",
        md: "400px",
      }}
    >
      <Searchbar
        size="small"
        placeholder="Search books"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)} // Only update state, no immediate search
        InputProps={{
          endAdornment: searchValue && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearchClick} // Trigger search on click
        startIcon={<SearchIcon />} // Add the search icon inside the button
        sx={{
          minWidth: "120px",
          borderRadius: "50px",
          textTransform: "none",
          width: isMobile ? "100%" : "auto", // Full-width on mobile
        }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchFilter;
