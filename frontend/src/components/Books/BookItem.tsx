import { useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add"; // AddIcon for the button
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined"; // Icon for Pages
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Book } from "../../api";

// Placeholder SVG for books without images
export const PlaceholderImage = () => (
  <svg
    width="100"
    height="150"
    viewBox="0 0 100 150"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", margin: "auto" }}
  >
    <rect width="100" height="150" fill="#e0e0e0" />
    <text
      x="50"
      y="75"
      fill="#b0b0b0"
      fontSize="12"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      No Image
    </text>
  </svg>
);

interface BookItemProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

const BookItem = ({ book, onAddToCart }: BookItemProps) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const isAvailable = book.price && book.price > 0;

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Box
      key={book.id}
      border={`1px solid ${theme.palette.divider}`}
      borderRadius={2}
      p={2}
      mb={3}
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      gap={2}
      boxShadow={theme.shadows[2]}
    >
      {/* Thumbnail */}
      <Box
        flexShrink={0}
        width={100}
        height={150}
        overflow="hidden"
        borderRadius={1}
        border={`1px solid ${theme.palette.divider}`}
      >
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            width={100}
            height={150}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <PlaceholderImage />
        )}
      </Box>

      {/* Book Details */}
      <Box flex={1} display="flex" flexDirection="column">
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {book.title}
          {book.revisionNumber && book.revisionNumber > 1 && (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{
                ml: 1,
                fontStyle: "italic",
                fontWeight: 500,
                color: theme.palette.text.secondary,
              }}
            >
              (Rev. {book.revisionNumber})
            </Typography>
          )}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            display: expanded ? "block" : "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {book.description}
        </Typography>
        {book.description && (
          <IconButton
            size="small"
            onClick={handleToggleExpand}
            sx={{ alignSelf: "center" }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
        {book.pageCount > 0 && (
          <Box display="flex" alignItems="center" color="text.secondary" mb={1}>
            <LibraryBooksOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">Pages: {book.pageCount}</Typography>
          </Box>
        )}
        {isAvailable ? (
          <Typography variant="h6" color="primary" fontWeight={700}>
            ${book.price.toFixed(2)}
          </Typography>
        ) : null}
      </Box>

      {/* Add to Cart Button */}
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        width={{ xs: "100%", sm: "auto" }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onAddToCart(book)}
          fullWidth
          disabled={!isAvailable}
          sx={{
            px: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
            "&:hover": {
              boxShadow: theme.shadows[3],
              backgroundColor: isAvailable
                ? theme.palette.secondary.dark
                : theme.palette.action.disabled,
            },
          }}
          startIcon={isAvailable ? <AddIcon /> : null}
        >
          {isAvailable ? "Add to Cart" : "Not available"}
        </Button>
      </Box>
    </Box>
  );
};

export default BookItem;
