import React from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select"; // Import SelectChangeEvent

interface CustomPaginationProps {
  currentPage: number;
  pageSize: number; // Add pageSize prop
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void; // New prop for page size change
}

const PaginationFilter: React.FC<CustomPaginationProps> = ({
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    // Update to SelectChangeEvent<number>
    onPageSizeChange(event.target.value as number);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px",
        maxWidth: {
          xs: "100%",
        },
      }}
    >
      <Box
        display={"flex"}
        gap={{
          xs: "8px",
          sm: "16px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          startIcon={<ArrowBack />}
          size="small"
          sx={{
            minWidth: "120px",
            borderRadius: "50px",
            textTransform: "none",
            width: { xs: "100%", sm: "fit-content" },
            marginRight: "8px",
          }}
        >
          Previous
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleNext}
          startIcon={<ArrowForward />}
          sx={{
            minWidth: "120px",
            borderRadius: "50px",
            textTransform: "none",
            width: { xs: "100%", sm: "fit-content" },
          }}
        >
          Next
        </Button>
      </Box>
      {/* Page Size Selector */}
      <FormControl variant="outlined" sx={{ minWidth: 40 }} size="small">
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          sx={{ color: "black" }}
        >
          {[5, 10, 20, 30].map((size) => (
            <MenuItem key={size} value={size} sx={{ color: "black" }}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default PaginationFilter;
