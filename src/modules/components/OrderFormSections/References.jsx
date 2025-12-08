import React from 'react'
import { Grid } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import InputWrapper from '../CustomComponents/InputWrapper'
import { useFormContext, Controller } from 'react-hook-form'

export default function References(props) {

  const {
    setValue,
    register,
    control
  } = useFormContext()

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name='reference_numbers'
          control={control}
          render={({ field }) => (
            <InputWrapper
              shrinkOut='true'
              setValue={setValue}
              data={field.value || []}
              field='reference_numbers'
              placeholder='Type and Press Comma or space'
              textHelper={'Add multiple reference numbers (use comma, or space)'}
              label='Reference Numbers'
            />
          )}
        />
        {/* <InputWrapper
          setValue={setValue}
          watch={watch}
          data={watch('reference_numbers') || []}
          field={'reference_numbers'}
          textHelper={'Add multiple reference numbers (use comma, or space)'}
          placeholder='Reference Numbers'
        /> */}
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name='caller'
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              value={field.value || ''}
              label='Caller'
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
