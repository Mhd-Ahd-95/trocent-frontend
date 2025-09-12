import React from 'react'
import { Grid, TextField } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import SearchableInput from '../CustomComponents/SearchableInput'
import { Controller } from 'react-hook-form'

export default function ShipperDetails (props) {
  const { register, control, errors, watch, setValue } = props

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <SearchableInput
          name='shipper_details.shipper'
          control={control}
          onSelect={value => {
            setValue('shipper_details.email', value?.email || '')
            setValue('shipper_details.contact_name', value?.contact_name || '')
            setValue('shipper_details.phone_number', value?.phone_number || '')
            setValue('shipper_details.address', value?.address || '')
            setValue('shipper_details.city', value?.city || '')
            setValue('shipper_details.province', value?.province || '')
            setValue('shipper_details.postal_code', value?.postal_code || '')
            setValue(
              'shipper_details.special_instructions',
              value?.special_instructions || ''
            )
          }}
          rules={{ required: 'Shipper is a required field' }}
          label='Shipper*'
          placeholder='Type name...'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name='shipper_details.email'
          render={({ field, fieldState }) => (
            <TextInput {...field} label='Email' variant='outlined' fullWidth />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name='shipper_details.contact_name'
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Contact Name'
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name='shipper_details.phone_number'
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Phone Number'
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          control={control}
          name='shipper_details.address'
          rules={{ required: 'Address is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Address*'
              variant='outlined'
              fullWidth
              error={!!fieldState?.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name='shipper_details.suite'
          render={({ field, fieldState }) => (
            <TextInput {...field} label='Suite' variant='outlined' fullWidth />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name='shipper_details.city'
          rules={{ required: 'City is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='City*'
              variant='outlined'
              fullWidth
              error={!!fieldState?.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name='shipper_details.province'
          rules={{ required: 'Province/State is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Province*'
              variant='outlined'
              fullWidth
              error={!!fieldState?.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name='shipper_details.postal_code'
          rules={{ required: 'Postal Code is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Postal Code*'
              variant='outlined'
              fullWidth
              error={!!fieldState?.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          control={control}
          name='shipper_details.special_instructions'
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Special Instructions'
              variant='outlined'
              multiline
              minRows={4}
              maxRows={4}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '13px'
                }
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
