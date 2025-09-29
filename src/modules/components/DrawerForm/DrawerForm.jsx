import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import {
  Drawer,
  Grid,
  IconButton,
  Typography,
  colors,
  useMediaQuery,
  Box
} from '@mui/material'
import { Close } from '@mui/icons-material'

const CustomDrawer = styled(Drawer)(({ theme, ismddown }) => ({
  width: ismddown === 'true' ? '100%' : '50%',
  flexShrink: 0,
  overflow: 'hidden'
}))

const DrawerPaper = styled('div', {
  shouldForwardProp: prop => prop !== 'myProp'
})(({ theme, myProp }) => ({
  width: myProp === 'true' ? '100%' : '50%',
  backgroundColor: colors.grey[50],
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden'
}))

const DrawerHeader = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1
}))

const DrawerContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
}))

export default function DrawerComponent (props) {
  const { open, setOpen, children } = props
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <CustomDrawer
      ismddown={isMdDown ? 'true' : 'false'}
      variant={'temporary'}
      onClose={() => setOpen(!open)}
      open={open}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        component: DrawerPaper,
        myProp: isMdDown ? 'true' : 'false'
      }}
      anchor='right'
      // aria-hidden={!open}
    >
      <DrawerHeader>
        <Grid
          container
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ paddingInline: 3, paddingBlock: 2 }}
        >
          <Grid size='auto'>
            <Typography
              component={'h2'}
              sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}
            >
              {props.title}
            </Typography>
          </Grid>
          <Grid size='auto'>
            <IconButton
              onClick={() => setOpen(!open)}
              size='small'
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Close fontSize='small' />
            </IconButton>
          </Grid>
        </Grid>
      </DrawerHeader>
      <DrawerContent>{children}</DrawerContent>
    </CustomDrawer>
  )
}
