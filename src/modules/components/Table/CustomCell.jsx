import { Box, colors } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomCell = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  backgroundColor: '#f7f1e7ff',
  color: theme.palette.primary.main,
  paddingInline: 6,
  paddingBlock: 2,
  borderRadius: "5px",
  fontWeight: 600,
  fontSize: "0.875rem",
  lineHeight: 1.2,
  boxShadow: theme.palette.primary.main + " 0px 0px 0px 1px;",
  fontSize: 12
}));

export default CustomCell