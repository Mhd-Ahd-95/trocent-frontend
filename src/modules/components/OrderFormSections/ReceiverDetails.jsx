import React from 'react'
import { Grid, TextField } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'

export default function ReceiverDetails (props) {
  const { register, errors } = props

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Receiver*'
          variant='outlined'
          fullWidth
          {...register('receiver_details.receiver', {
            required: 'Receiver is a required field'
          })}
          error={!!errors?.receiver_details?.receiver}
          helperText={errors?.receiver_details?.receiver?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Email'
          variant='outlined'
          fullWidth
          {...register('receiver_details.email')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Contact Name'
          variant='outlined'
          fullWidth
          {...register('receiver_details.contact_name')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Phone Number'
          variant='outlined'
          fullWidth
          {...register('receiver_details.phone_number')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <TextInput
          label='Address*'
          variant='outlined'
          fullWidth
          {...register('receiver_details.address', {
            required: 'Address is a required field'
          })}
          error={!!errors?.receiver_details?.address}
          helperText={errors?.receiver_details?.address?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Suite'
          variant='outlined'
          fullWidth
          {...register('receiver_details.suite')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='City*'
          variant='outlined'
          fullWidth
          {...register('receiver_details.city', {
            required: 'City is a required field'
          })}
          error={!!errors?.receiver_details?.city}
          helperText={errors?.receiver_details?.city?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Province/State*'
          variant='outlined'
          fullWidth
          {...register('receiver_details.province', {
            required: 'Province is a required field'
          })}
          error={!!errors?.receiver_details?.province}
          helperText={errors?.receiver_details?.province?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Postal code*'
          variant='outlined'
          fullWidth
          {...register('receiver_details.postal_code', {
            required: 'Postal Code is a required field'
          })}
          error={!!errors?.receiver_details?.postal_code}
          helperText={errors?.receiver_details?.postal_code?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <TextField
          label='Special Instructions'
          variant='outlined'
          {...register('receiver_details.special_instructions')}
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
