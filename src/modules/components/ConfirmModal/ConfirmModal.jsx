import React from 'react'
import { colors, Grid, Typography } from '@mui/material'
import { StyledButton, SubmitButton } from '../../components'
import { DeleteForeverOutlined } from '@mui/icons-material'

export default function ConfirmModal (props) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const handleSubmitStatus = e => {
    e.preventDefault()
    setIsSubmitting(true)
    props.handleSubmit()
    props.handleClose()
  }
  return (
    <Grid container spacing={2} alignItems='center' justifyContent={'center'}>
      <Grid size={'auto'}>
        <DeleteForeverOutlined
          fontSize='large'
          color='error'
          sx={{
            backgroundColor: colors.red[100],
            padding: 1,
            borderRadius: '50%'
          }}
        />
      </Grid>
      <Grid size={12}>
        <Typography variant='body2' color='textPrimary' align='center' fontWeight={600}>
          {props.title}
        </Typography>
      </Grid>
      {props.subtitle && (
        <Grid size={12}>
          <Typography
            component='p'
            color='textSecondary'
            align='center'
            gutterBottom
            fontSize={'13px'}
          >
            {props.subtitle}
          </Typography>
        </Grid>
      )}
      {props.subtitle2 && (
        <Grid size={12}>
          <Typography variant='h5' color='primary' align='center'>
            {props.subtitle2}
          </Typography>
        </Grid>
      )}
      <Grid size={12}>
        <Grid
          container
          spacing={3}
          justifyContent='center'
          alignItems={'center'}
          component='form'
          onSubmit={e => handleSubmitStatus(e)}
        >
          <Grid size='auto'>
            <SubmitButton
              type='submit'
              variant='contained'
              color='error'
              isLoading={isSubmitting}
              fullWidth
              textTransform='capitalize'
            >
              Delete
            </SubmitButton>
          </Grid>
          <Grid size='auto'>
            <StyledButton
              fullWidth
              onClick={props.handleClose}
              color='inherit'
              textTransform='capitalize'
            >
              Cancel
            </StyledButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
