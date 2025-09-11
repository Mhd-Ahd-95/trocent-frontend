import React from 'react'
import { Grid } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'

export default function References (props) {
  const { register } = props

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <TextInput
          label='Reference Number'
          variant='outlined'
          fullWidth
          {...register('references.reference_number')}
          helperText={
            'Add multiple reference numbers (use Enter, comma, or space)'
          }
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <TextInput
          label='Caller'
          variant='outlined'
          fullWidth
          {...register('references.caller')}
        />
      </Grid>
    </Grid>
  )
}
