import React from 'react'
import { Grid } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import InputWrapper from '../CustomComponents/InputWrapper'

export default function References (props) {
  const { register, watch, setValue } = props

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <InputWrapper 
          setValue={setValue}
          watch={watch}
          data={watch('references.reference_numbers')}
          field={'references.reference_numbers'}
          textHelper={'Add multiple reference numbers (use comma, or space)'}
          placeholder='Reference Numbers'
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
