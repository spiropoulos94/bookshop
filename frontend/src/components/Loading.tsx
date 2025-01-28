import { Box, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"240px"}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
