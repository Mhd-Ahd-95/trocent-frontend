import React from "react";
import {
  Grid,
  Typography,
  Avatar,
  Menu,
  Button,
  AppBar,
  Toolbar,
  Box,
  OutlinedInput,
  InputAdornment,
  colors,
  IconButton,
  Divider,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AccountCircle, DarkMode, LightMode, Logout, Search, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { AuthContext } from "../../contexts";
import AuthAPI from "../../apis/login.api";

const CustomInput = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: 8,
  fontSize: "16px",
  height: 40, // consistent height
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: colors.grey[ 300 ], // yellow
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: colors.grey[ 500 ], // yellow
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
  },
  ".MuiInputAdornment-root": {
    marginRight: 8,
    marginLeft: 4,
    color: theme.palette.grey[ 500 ],
    svg: {
      fontSize: 20,
    },
  },
  ".MuiOutlinedInput-input": {
    paddingLeft: 8,
  },
}));

export default function Appbar(props) {
  const { open, setOpen } = props;
  const [ anchor, setAnchor ] = React.useState(null);
  const handleClick = (e) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const authContext = React.useContext(AuthContext);

  const handleOpenSide = () => {
    setOpen(!open);
    localStorage.setItem("shrinkMenu", !open);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    AuthAPI.logout()
      .then((res) => {
        if (res.data) authContext.handleAuth(false);
      })
      .catch((err) => {
        console.log("failed to logout");
      });
  };

  return (
    <AppBar
      position="fixed"
      sx={ {
        background: "#fff",
        pl: 1,
        pr: 8,
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;",
      } }
    >
      <Toolbar style={ { minHeight: 65, width: "100%" } }>
        <Grid container width={ "100%" }>
          <Grid size={ 2 }>
            <Grid container spacing={ 2 } sx={ { justifyContent: "space-between", alignItems: "center", width: isMdDown ? '100%' : 270 } }>
              { isMdDown ? (
                <Grid size={ 12 }>{ props.drawer }</Grid>
              ) : (
                <>
                  { !open && (
                    <Grid>
                      <IconButton onClick={ handleOpenSide }>
                        <ArrowForwardIos />
                      </IconButton>
                    </Grid>
                  ) }
                  { open && (
                    <>
                      <Grid>
                        <Typography variant="h6" gutterBottom color="textPrimary" sx={ { fontWeight: 600 } }>
                          Trocent
                        </Typography>
                      </Grid>
                      <Grid>
                        <IconButton onClick={ handleOpenSide }>
                          <ArrowBackIos />
                        </IconButton>
                      </Grid>
                    </>
                  ) }
                </>
              ) }
            </Grid>
          </Grid>
          <Grid size={ 10 }>
            <Grid container spacing={ 2 } sx={ { justifyContent: "flex-end", alignItems: "center" } }>
              { !isSmDown && (
                <Grid>
                  <CustomInput
                    placeholder="Search"
                    type="number"
                    startAdornment={
                      <InputAdornment position="end">
                        <Search />
                      </InputAdornment>
                    }
                  />
                </Grid>
              ) }
              <Grid>
                <Avatar
                  sx={ {
                    color: theme.palette.background.paper,
                    background: theme.palette.common.black,
                    cursor: "pointer  ",
                    fontSize: 15,
                    height: 35,
                    width: 35,
                  } }
                  onClick={ handleClick }
                >
                  SA
                </Avatar>
                <Menu
                  anchorEl={ anchor }
                  open={ Boolean(anchor) }
                  onClose={ handleClose }
                  anchorOrigin={ { vertical: "bottom", horizontal: "right" } }
                  transformOrigin={ { vertical: "top", horizontal: "right" } }
                  PaperProps={ {
                    sx: {
                      // width: 200,
                      // paddingY: 1,
                    },
                  } }
                >
                  <Button
                    fullWidth
                    startIcon={ <AccountCircle /> }
                    sx={ {
                      justifyContent: "flex-start",
                      textTransform: "capitalize",
                      px: 2,
                      color: "text.secondary",
                      "& svg": {
                        color: theme.palette.grey[ 500 ],
                      },
                    } }
                    onClick={ () => console.log("Go to profile") }
                  >
                    Profile
                  </Button>

                  <Divider sx={ { my: 0.5 } } />

                  {/* <Box display="flex" justifyContent="space-between" px={ 2 } gap={ 1 } py={ 0.5 }>
                    <Tooltip title="Enable Light Theme">
                      <IconButton size="small" color="primary">
                        <LightMode fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Enable Dark Theme">
                      <IconButton size="small">
                        <DarkMode fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Divider sx={ { my: 0.5 } } /> */}

                  <Button
                    fullWidth
                    startIcon={ <Logout /> }
                    sx={ {
                      justifyContent: "flex-start",
                      textTransform: "capitalize",
                      px: 2,
                      color: "text.secondary",
                      "& svg": {
                        color: theme.palette.grey[ 500 ],
                      },
                    } }
                    onClick={ (e) => handleLogout(e) }
                  >
                    Sign out
                  </Button>
                </Menu>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
