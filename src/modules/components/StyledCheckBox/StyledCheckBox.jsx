import * as React from "react";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 4, // slightly rounded like in your screenshot
  width: 17,
  height: 17,
  border: "1px solid " + theme.palette.grey[300],
  backgroundColor: "#fff",
  display: "inline-block",
  ".Mui-focusVisible &": {
    outline: `2px auto ${theme.palette.primary.light}`,
    outlineOffset: 2,
  },
  // "input:hover ~ &": {
  //   backgroundColor: "#f0f0f0",
  // },
  "input:disabled ~ &": {
    borderColor: "#ccc",
    background: "#f5f5f5",
  },
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  "&::before": {
    content: '""',
    display: "block",
    width: "100%",
    height: "100%",
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><polyline points='4,11 8,15 16,6' style='fill:none;stroke:white;stroke-width:2;stroke-linecap:round;stroke-linejoin:round'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
}));

export default function StyledCheckBox(props) {
  return (
    <Checkbox
      // sx={{ "&:hover": { bgcolor: "transparent" } }}
      disableRipple
      color="primary"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ "aria-label": "custom checkbox" }}
      {...props}
    />
  );
}
