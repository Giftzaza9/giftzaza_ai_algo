import { CircularProgress, Grid, Box } from "@mui/material";

export const Loader = () => {

  return (
    <Grid container width={"100%"} justifyContent="center" alignItems="center" flexDirection="column" sx={{ position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.11)",
          height: "52px",
          width: "52px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
      <CircularProgress size={52} style={{ color: "#1976d2" }} />
    </Grid>
  );
};