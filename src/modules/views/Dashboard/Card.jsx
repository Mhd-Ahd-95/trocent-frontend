import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { colors } from "@mui/material";

function CardDashoard(props) {
  const { title, number, statistic } = props;

  return (
    <Card
      sx={{
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ height: "100%", paddingInline: 4, paddingBlock: 2 }}>
        <Typography
          component="p"
          sx={{ fontSize: 14, pb: 1, color: colors.grey[600] }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          color="text.primary"
          sx={{ fontWeight: 600, pb: 1 }}
        >
          {number}
        </Typography>
        <Typography
          component={"p"}
          fontSize={"13px"}
          sx={{
            color: props.color || "",
            "& svg": {
              fontSize: 22,
            },
          }}
        >
          {statistic} {props.icon && props.icon}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CardDashoard;
