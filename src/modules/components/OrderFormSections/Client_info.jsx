import React from 'react'
import { Grid, Autocomplete, CircularProgress } from '@mui/material'
import { Controller, useWatch } from 'react-hook-form'
import TextInput from '../CustomComponents/TextInput'
import { useCustomersNames } from '../../hooks/useCustomers'

function ClientInfo(props) {
  const { control } = props

  const { data, isLoading, isError, error } = useCustomersNames()

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      const errorMessage = message ? `${message} - ${status}` : error.message;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [isError])

  const customerId = useWatch({ control, name: 'customer_id' })
  const selectedCustomer = data?.find(c => c.id === Number(customerId))

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name='customer_id'
          control={control}
          rules={{ required: 'Customer is a required field' }}
          render={({ field, fieldState }) => {
            return (
              <Autocomplete
                {...field}
                options={data || []}
                loading={isLoading}
                value={data?.find((c) => c.id === Number(field.value)) || ''}
                onChange={(_, value) => { field.onChange(value?.id) }}
                getOptionLabel={option =>
                  option ? `${option.account_number} - ${option.name}` : ''
                }
                renderInput={params => (
                  <TextInput
                    {...params}
                    label='Customer*'
                    fullWidth
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
              />
            )
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Name'
          disabled
          variant='outlined'
          fullWidth
          value={selectedCustomer?.name || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Email'
          disabled
          variant='outlined'
          fullWidth
          value={(selectedCustomer?.billing_emails && selectedCustomer?.billing_emails[0]) || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <TextInput
          label='Address'
          disabled
          variant='outlined'
          fullWidth
          value={selectedCustomer?.address || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Suite'
          disabled
          variant='outlined'
          fullWidth
          value={selectedCustomer?.suite || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='City'
          disabled
          variant='outlined'
          fullWidth
          value={selectedCustomer?.city || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Province/State'
          disabled
          variant='outlined'
          fullWidth
          value={selectedCustomer?.province || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Postal Code'
          disabled
          variant='outlined'
          fullWidth
          value={selectedCustomer?.postal_code || ''}
        />
      </Grid>
    </Grid>
  )
}

export default ClientInfo
