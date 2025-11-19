import React from 'react'
import { Grid, Autocomplete, CircularProgress } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import TextInput from '../CustomComponents/TextInput'
import { useCustomers } from '../../hooks/useCustomers'
import { unstable_batchedUpdates } from 'react-dom'

function ClientInfo(props) {
  const { engine, editMode, enqueueSnackbar } = props
  const { data, isLoading, isError, error } = useCustomers()

  const {
    control,
  } = useFormContext()

  const [selectedCustomer, setSelectedCustomer] = React.useState(null)
  const [customerId, setCustomerId] = React.useState('')
  const isInitialLoad = React.useRef(true)

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message
      const status = error.response?.status
      const errorMessage = message ? `${message} - ${status}` : error.message
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }, [isError, error])

  React.useEffect(() => {
    if (data && customerId) {
      const customer = data.find(c => c.id === Number(customerId))
      if (customer) {
        setSelectedCustomer(customer)
        engine.customer = customer
      }
    }
  }, [data, customerId, engine])

  return (
    <Grid container spacing={3}>
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
                value={data?.find((c) => c.id === Number(field.value)) || null}
                onChange={(_, value) => {
                  unstable_batchedUpdates(async () => {
                    field.onChange(value?.id || '')
                    setCustomerId(value?.id || '')
                    setSelectedCustomer(value)
                    engine.customer = value
                    props.rateSheetRef.current?.loadRateSheet()
                  })
                }}
                getOptionLabel={option =>
                  option ? `${option.account_number} - ${option.name}` : ''
                }
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
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

export default React.memo(ClientInfo)