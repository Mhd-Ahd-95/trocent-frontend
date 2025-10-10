import { Box, colors, Paper, Typography, Link, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";

export default function AuthLayout(props) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      minHeight={"100vh"}
      bgcolor={theme.palette.background.paper}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={2} sx={{ p: 7, borderRadius: 5, width: isSmDown ? '100%' : 400 }}>
          <Typography
            variant="h6"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Trocent
          </Typography>
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            {props.title}
          </Typography>
          <div style={{ paddingTop: 10 }}>{props.children}</div>
        </Paper>
      </Box>
      <Box
        textAlign="center"
        pb={3}
        width="100%"
        fontSize={14}
        color="gray"
        sx={{
          "& a": {
            color: colors.grey[700],
          },
        }}
      >
        © 2025{" "}
        <Link href="https://www.iamcorp.ca" color="textPrimary">
          IAM INC.
        </Link>{" "}
        All rights reserved. v2.0
      </Box>
    </Box>
  );
}
