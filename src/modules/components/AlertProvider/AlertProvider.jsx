import React from "react";
import { SnackbarProvider } from "notistack";
import { IconButton, Alert, Box, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { makeStyles } from 'tss-react/mui';

const SnackbarAlert = React.forwardRef(function SnackbarAlert(props, ref) {
  const { id, message, variant, action } = props;

  return (
    <Alert ref={ref} severity={variant} action={action ? action(id) : null}>
      <Typography variant="body2" fontWeight={"500"}>{message}</Typography>
    </Alert>
  );
});

const useStyles = makeStyles(() => ({
  snackbarContainer: {
    zIndex: 9999,
  },
}));

const AlertProvider = (props) => {
  const notistackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current?.closeSnackbar(key);
  };
  const classes = useStyles()
  return (
    <SnackbarProvider
      ref={notistackRef}
      //   variant='success'
      maxSnack={5}
      domRoot={document.body}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      classes={{
        containerRoot: classes.snackbarContainer
      }}
      style={{
        '.MuiSnackbar-root': {
          zIndex: '99999 !important'
        }
      }}
      action={(key) => (
        <IconButton size="small" aria-label="close" color="inherit" onClick={onClickDismiss(key)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}

      Components={{
        success: (props) => <SnackbarAlert {...props} />,
        error: (props) => <SnackbarAlert {...props} />,
        warning: (props) => <SnackbarAlert {...props} />,
        info: (props) => <SnackbarAlert {...props} />,
      }}
    >
      <Box sx={{ pointerEvents: "auto", mb: 1 }}>{props.children}</Box>
    </SnackbarProvider>
  );
};

export default AlertProvider;
