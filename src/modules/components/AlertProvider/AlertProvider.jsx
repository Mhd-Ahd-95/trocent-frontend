import React from 'react'
import { SnackbarProvider } from 'notistack'
import { IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Close as CloseIcon } from '@mui/icons-material'

const CustomSnackbarProvider = styled(SnackbarProvider)(({ theme }) => ({
  pointerEvents: 'auto',
  marginBlock: theme.spacing(0.5),
}))

const AlertProvider = props => {
  const notistackRef = React.createRef()
  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key)
  }
  return (
    <CustomSnackbarProvider
      ref={notistackRef}
    //   variant='success'
      maxSnack={5}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      action={key => (
        <IconButton
          size='small'
          aria-label='close'
          color='inherit'
          onClick={onClickDismiss(key)}
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      )}
    >
      {props.children}
    </CustomSnackbarProvider>
  )
}

export default AlertProvider
