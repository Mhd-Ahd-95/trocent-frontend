import React from 'react'
import { Grid, Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'
import TextInput from '../CustomComponents/TextInput'
import global from '../../global'

export default function ClientInfo (props) {
  const { setValue, control } = props
  const customerData = global.static.customers

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name='client_info.customer'
          control={control}
          rules={{ required: 'Customer is a required field' }}
          render={({ field, fieldstate }) => {
            return (
              <Autocomplete
                {...field}
                options={customerData}
                onChange={(_, value) => {
                  field.onChange(value)
                  setValue('client_info.customer_id', value?.id || '')
                  setValue('client_info.name', value?.name || '')
                  setValue('client_info.email', value?.email || '')
                  setValue('client_info.address', value?.address || '')
                  setValue('client_info.suite', value?.suite || '')
                  setValue('client_info.city', value?.city || '')
                  setValue('client_info.province', value?.province || '')
                  setValue('client_info.postal_code', value?.postal_code || '')
                }}
                getOptionLabel={option =>
                  option ? `${option.account_number} - ${option.name}` : ''
                }
                // isOptionEqualToValue={(option, value) =>
                //   option.id === value?.id
                // }
                renderInput={params => (
                  <TextInput
                    {...params}
                    label='Customer'
                    fullWidth
                    error={!!fieldstate?.error}
                    helperText={fieldstate?.error?.message}
                  />
                )}
              />
            )
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='client_info.name'
          control={control}
          rules={{ required: 'Name is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Name*'
              variant='outlined'
              fullWidth
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='client_info.email'
          control={control}
          render={({ field, fieldState }) => (
            <TextInput {...field} label='Email' variant='outlined' fullWidth />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name='client_info.address'
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Address'
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='client_info.suite'
          control={control}
          render={({ field, fieldState }) => (
            <TextInput {...field} label='Suite' variant='outlined' fullWidth />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='client_info.city'
          control={control}
          render={({ field, fieldState }) => (
            <TextInput {...field} label='City' variant='outlined' fullWidth />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='client_info.province'
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Province/State'
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='client_info.postal_code'
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Postal Code'
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
