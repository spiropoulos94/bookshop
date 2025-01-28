import { Box, InputAdornment, styled, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
      //   maxWidth={"400px"}
    >
      <Searchbar
        size="small"
        placeholder="Search by title..."
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchFilter;
