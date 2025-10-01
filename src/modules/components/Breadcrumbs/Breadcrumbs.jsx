import { Link } from "react-router-dom";
import { NavigateNext } from "@mui/icons-material";
import { Breadcrumbs, Typography, Skeleton } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { styled } from "@mui/material/styles";

const CustomBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  //   margin: theme.spacing(1),
  fontSize: 14,
  fontWeight: 500,
  "& p": {
    fontSize: 14,
  },
  "& a": {
    color: theme.palette.grey[ 700 ],
    textDecoration: "none",
    fontSize: 14,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

export default function ItemTrace(props) {
  const icon = props.icon || <NavigateNext fontSize="small" />;
  return (
    <CustomBreadcrumbs separator={ icon } aria-label="breadcrumb">
      { props.items.map(({ text, url }) =>
        url && !text.length ? (
          <Skeleton key={ uuidv4() } variant="text" width="100px" />
        ) : url ? (
          <Link key={ uuidv4() } color="inherit" to={ url }>
            { text }
          </Link>
        ) : !text.length || text === " " ? (
          <Skeleton key={ uuidv4() } variant="text" width="100px" />
        ) : (
          <Typography key={ uuidv4() } color="inherit">
            { text }
          </Typography>
        )
      ) }
    </CustomBreadcrumbs>
  );
}
