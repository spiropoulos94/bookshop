import {
  Box,
  InputAdornment,
  styled,
  TextField,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Close"; // Import the Clear icon
import { useState } from "react";

interface SearchFilterProps {
  onSearch: (search: string) => void;
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

const SearchFilter = ({ onSearch }: SearchFilterProps) => {
  const [searchValue, setSearchValue] = useState<string>(""); // State for input value

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
      width={{
        xs: "100%",
        md: "400px",
      }}
    >
      <Searchbar
        size="small"
        placeholder="Filter by title..."
        value={searchValue} // Bind the input value to state
        onChange={(e) => {
          setSearchValue(e.target.value); // Update the state
          onSearch(e.target.value); // Notify parent about the search input
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchValue && ( // Conditionally render the clear icon
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchFilter;
