import React from 'react'
import { Modal, Fade } from '@mui/material'
import { styled } from '@mui/material/styles'

const CustomModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const CustomPaper = styled('div')(({ theme, size }) => ({
  display: 'flex',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  paddingBlock: theme.spacing(2),
  paddingInline: theme.spacing(2),
  maxWidth: size === 'large' ? '50%' : '40%',
  minWidth: size=== 'large' ? '40%' : '20%',
  minHeight: '15%',
  maxHeight: '85%',
  overflowY: 'auto',
  borderRadius: 4,
//   backgroundImage: 'url(/assets/images/logo/d-logo-15.png)',
//   backgroundRepeat: 'no-repeat',
//   backgroundSize: '40%',
//   backgroundPosition: 'bottom -60px left -40px'
}))

export default function TransitionsModal (props) {

  return (
    <div onClick={e => e.stopPropagation()}>
      <CustomModal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        disableEnforceFocus={false}
      >
        <Fade in={props.open}>
          <CustomPaper size={props.size || 'small'}>{props.children}</CustomPaper>
        </Fade>
      </CustomModal>
    </div>
  )
}
