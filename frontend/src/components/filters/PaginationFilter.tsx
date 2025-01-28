import { PaginationProps, Pagination as MUIPagination } from "@mui/material";

interface CustomPaginationProps extends PaginationProps {}

const PaginationFilter = (props: CustomPaginationProps) => {
  return (
    <MUIPagination
      {...props}
      variant="outlined"
      color="primary"
      sx={{
        mb: 2,
        "& .MuiPaginationItem-root": {
          color: "black", // Change the color of the pagination numbers to red
        },
        "& .MuiPaginationItem-ellipsis": {
          color: "black", // Change color of ellipsis
        },
      }}
    />
  );
};

export default PaginationFilter;
