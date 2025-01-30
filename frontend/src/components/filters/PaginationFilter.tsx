import React from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select"; // Import SelectChangeEvent

interface CustomPaginationProps {
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

const PaginationFilter: React.FC<
  CustomPaginationProps & {
    isNotMature: boolean;
    onToggleMature: (value: boolean) => void;
  }
> = ({
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading,
  isNotMature,
  onToggleMature,
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
    onPageSizeChange(event.target.value as number);
  };

  return (
    <>
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
            disabled={currentPage === 1 || isLoading}
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
            disabled={isLoading}
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
        <Box>
          {/* Page Size Selector */}
          <FormControl
            variant="outlined"
            sx={{ minWidth: 40 }}
            size="small"
            disabled={isLoading}
          >
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
      </Box>
      {/* Not Mature Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={isNotMature}
            onChange={(event) => onToggleMature(event.target.checked)}
          />
        }
        label="Not mature only"
      />
    </>
  );
};

export default PaginationFilter;
