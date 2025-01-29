import React from "react";
import { Box, Button } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material"; // Import Material-UI icons

interface CustomPaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationFilter: React.FC<CustomPaginationProps> = ({
  currentPage,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1); // Call onPageChange with the previous page
    }
  };

  const handleNext = () => {
    onPageChange(currentPage + 1); // Call onPageChange with the next page
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px",
        maxWidth: {
          xs: "100%",
          sm: "200px",
        },
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrevious}
        disabled={currentPage === 1} // Disable if on the first page
        startIcon={<ArrowBack />} // Add icon for Previous button
        sx={{
          minWidth: "120px",
          borderRadius: "50px",
          textTransform: "none",
          width: isMobile ? "100%" : "auto", // Full-width on mobile
          marginRight: "8px", // Space between buttons
        }}
      >
        Previous
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        startIcon={<ArrowForward />} // Add icon for Next button
        sx={{
          minWidth: "120px",
          borderRadius: "50px",
          textTransform: "none",
          width: isMobile ? "100%" : "auto", // Full-width on mobile
        }}
      >
        Next
      </Button>
    </Box>
  );
};

export default PaginationFilter;
