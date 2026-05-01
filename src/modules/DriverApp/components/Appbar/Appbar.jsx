import React from 'react';
import { Avatar, Menu, IconButton, useTheme, Box, Divider, Tooltip, Button } from '@mui/material';
import useStyles from './Appbar.styles'
import globalVariables from '../../../global';
import { AuthContext, ThemeContext } from '../../../contexts';
import { AccountCircle, DarkMode, LightMode, Logout } from '@mui/icons-material';
import AuthAPI from "../../../apis/login.api";

export default function Appbar() {

    const { classes } = useStyles();
    const { avatar } = globalVariables.methods
    const [anchor, setAnchor] = React.useState(null);
    const handleClick = (e) => setAnchor(e.currentTarget);
    const handleClose = () => setAnchor(null);
    const authContext = React.useContext(AuthContext);
    const authedUser = JSON.parse(localStorage.getItem('authedUser'))
    const { themeState } = React.useContext(ThemeContext);

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

    const theme = useTheme()

    return (
        <div className={classes.topBar}>
            <div className={classes.logoMark}>
                Trocent
            </div>
            <div>
                <Avatar
                    className={classes.avatarRing}
                    onClick={handleClick}
                >
                    {avatar(authedUser?.username)}
                </Avatar>
                <Menu
                    anchorEl={anchor}
                    open={Boolean(anchor)}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                        sx: {
                            width: 200,
                            paddingY: 1,
                        },
                    }}
                >
                    {/* <Button
                        fullWidth
                        startIcon={<AccountCircle />}
                        sx={{
                            justifyContent: "flex-start",
                            textTransform: "capitalize",
                            px: 2,
                            color: "text.secondary",
                            "& svg": {
                                color: theme.palette.grey[500],
                            },
                        }}
                        onClick={() => console.log("Go to profile")}
                    >
                        Profile
                    </Button>

                    <Divider sx={{ my: 0.5 }} />

                    <Box display="flex" justifyContent="space-between" px={2} gap={1} py={0.5}>
                        <Tooltip title="Enable Light Theme">
                            <IconButton size="small"
                                color={themeState.palette.mode === "light" ? "primary" : "default"}
                            // onClick={() => themeState.palette.mode === "dark" ? handleToggleMode() : undefined}
                            >
                                <LightMode fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Enable Dark Theme">
                            <IconButton size="small"
                                color={themeState.palette.mode === "dark" ? "primary" : "default"}
                            // onClick={() => themeState.palette.mode === "light" ? handleToggleMode() : undefined}
                            >
                                <DarkMode fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Divider sx={{ my: 0.5 }} /> */}

                    <Button
                        fullWidth
                        startIcon={<Logout />}
                        sx={{
                            justifyContent: "flex-start",
                            textTransform: "capitalize",
                            px: 2,
                            color: "text.secondary",
                            "& svg": {
                                color: theme.palette.grey[500],
                            },
                        }}
                        onClick={(e) => handleLogout(e)}
                    >
                        Sign out
                    </Button>
                </Menu>
            </div>
        </div>
    );
}