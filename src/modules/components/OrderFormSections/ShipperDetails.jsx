import React from 'react'
import { Grid, TextField } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'

export default function ShipperDetails (props) {

    const {register, errors} = props

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Shipper*'
          variant='outlined'
          fullWidth
          {...register('shipper_details.shipper', {
            required: 'Sipper is a required field'
          })}
          error={!!errors?.shipper_details?.shipper}
          helperText={errors?.shipper_details?.shipper?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Email'
          variant='outlined'
          fullWidth
          {...register('shipper.email')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Contact Name'
          variant='outlined'
          fullWidth
          {...register('shipper_details.contact_name')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Phone Number'
          variant='outlined'
          fullWidth
          {...register('shipper_details.phone_number')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <TextInput
          label='Address*'
          variant='outlined'
          fullWidth
          {...register('shipper_details.address', {
            required: 'Address is a required field'
          })}
          error={!!errors?.shipper_details?.address}
          helperText={errors?.shipper_details?.address?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Suite'
          variant='outlined'
          fullWidth
          {...register('shipper_details.suite')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='City*'
          variant='outlined'
          fullWidth
          {...register('shipper_details.city', {
            required: 'City is a required field'
          })}
          error={!!errors?.shipper_details?.city}
          helperText={errors?.shipper_details?.city?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Province/State*'
          variant='outlined'
          fullWidth
          {...register('shipper_details.province', {
            required: 'Province is a required field'
          })}
          error={!!errors?.shipper_details?.province}
          helperText={errors?.shipper_details?.province?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Postal code*'
          variant='outlined'
          fullWidth
          {...register('shipper_details.postal_code', {
            required: 'Postal Code is a required field'
          })}
          error={!!errors?.shipper_details?.postal_code}
          helperText={errors?.shipper_details?.postal_code?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <TextField
          label='Special Instructions'
          variant='outlined'
          {...register('shipper_details.special_instructions')}
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
      </Grid>
    </Grid>
  )
}
