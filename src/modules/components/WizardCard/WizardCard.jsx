import React from "react";
import { Paper, Typography, Divider, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

const PaperWrapper = styled(Paper)(({ theme, minheight }) => ({
  width: "100%",
  height: '100%',
  borderTop: "2.5px solid " + theme.palette.primary.main,
  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
  minHeight: minheight ? minheight || 400 : 'auto',
  display: 'flex',
  flexDirection: 'column',
  "& .header": {
    "& h6": {
      paddingInline: theme.spacing(3),
      paddingBlock: theme.spacing(2),
      fontWeight: 600,
    },
  },
  "& .content": {
    paddingInline: theme.spacing(3),
    paddingBlock: theme.spacing(2),
    flexGrow: 1
  },
}));

export default function WizardCard(props) {
  return (
    <PaperWrapper elevation={2} minheight={props.minHeight}>
      <Grid container>
        <Grid size={12} className="header">
          <Typography variant="h6">{props.title}</Typography>
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={12} className="content">
          {props.children}
        </Grid>
      </Grid>
    </PaperWrapper>
  );
}
