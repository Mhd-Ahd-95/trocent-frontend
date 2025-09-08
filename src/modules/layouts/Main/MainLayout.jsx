import React from "react";
import { Appbar, SideMenu, MobileDrawer, StyledButton } from "../../components";
import { Helmet, HelmetProvider } from "@dr.pogodin/react-helmet";
import { Menu } from "@mui/icons-material";
import { IconButton, useMediaQuery, Grid, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { styled } from "@mui/material/styles";

const Root = styled("div")(({ theme, noPadding }) => ({
  display: "flex",
  paddingTop: theme.spacing(6),
  backgroundColor: theme.palette.mode === "light" ? "#f9f9f9" : "#494949",
}));

const MainContent = styled("main")(({ theme, noPadding }) => ({
  flexGrow: 1,
  // minHeight: 800,
  // flex: 1,
  paddingInline: theme.spacing(4),
  paddingBlock: theme.spacing(4),
  overflowX: "hidden",
  backgroundColor: theme.palette.mode === "light" ? "#f9f9f9" : "#494949",
}));

export default function MainLayout(props) {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const { title } = props;
  const Breadcrumbs = props.breadcrumbs;
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openSide, setOpenSide] = React.useState(
    localStorage.getItem("shrinkMenu")
      ? localStorage.getItem("shrinkMenu") === "false"
        ? false
        : true
      : false
  );

  return (
    <React.Fragment>
      <HelmetProvider>
        <Helmet>
          <title>Trocent | {title}</title>
        </Helmet>
      </HelmetProvider>
      <Appbar
        open={openSide}
        setOpen={setOpenSide}
        drawer={
          isMdDown ? (
            <IconButton
              aria-label="open-drawer"
              edge="start"
              onClick={() => setOpenDrawer(!openDrawer)}
              disableRipple
            >
              <Menu color="inherit" />
            </IconButton>
          ) : null
        }
      />

      <Root noPadding={props.noPadding ? "true" : "false"}>
        {isMdDown && (
          <MobileDrawer
            open={openDrawer}
            handleClose={() => setOpenDrawer(false)}
            active={props.activeDrawer.active}
          />
        )}
        {!isMdDown && (
          <SideMenu open={openSide} active={props.activeDrawer.active} />
        )}
        <Grid container sx={{ width: "100%" }}>
          <Grid size={12}>
            <MainContent noPadding={props.noPadding ? "true" : "false"}>
              <Grid
                container
                spacing={props.noPadding ? 0 : 1}
                direction={"column"}
              >
                <Grid size="auto">{Breadcrumbs && Breadcrumbs}</Grid>
                <Grid size={12}>
                  <Grid
                    container
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Grid>
                      <Typography
                        variant="h5"
                        color="textPrimary"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          marginBottom: -0.2,
                        }}
                      >
                        {props.title}
                      </Typography>
                    </Grid>
                    {props.button && (
                      <Grid>
                        <StyledButton
                          color="primary"
                          py={1}
                          variant="contained"
                          textTransform="capitalize"
                          size="small"
                          onClick={props.btnProps.onClick}
                        >
                          {props.btnProps.label}
                        </StyledButton>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid
                  sx={
                    props.grid
                      ? { display: "grid", paddingTop: 3 }
                      : { paddingTop: 3 }
                  }
                >
                  {props.children}
                </Grid>
              </Grid>
            </MainContent>
          </Grid>
        </Grid>
      </Root>
    </React.Fragment>
  );
}
