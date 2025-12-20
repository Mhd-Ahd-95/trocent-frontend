import React from 'react'
import { Grid, Autocomplete, CircularProgress } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import TextInput from '../CustomComponents/TextInput'
import { useCustomerSearch } from '../../hooks/useCustomers'
import { unstable_batchedUpdates } from 'react-dom'

function ClientInfo(props) {

  const { engine, enqueueSnackbar } = props
  const {
    control,
    getValues,
    setValue
  } = useFormContext()
  const [search, setSearch] = React.useState('')
  const [inputValue, setInputValue] = React.useState('')
  const { data, isLoading, isFetching, isError, error } = useCustomerSearch(search)

  const [selectedCustomer, setSelectedCustomer] = React.useState(null)

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message
      const status = error.response?.status
      const errorMessage = message ? `${message} - ${status}` : error.message
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }, [isError, error, enqueueSnackbar])

  const handleCustomer = React.useCallback(() => {
    const customerId = getValues('customer_id')
    if (props.editMode && customerId) {
      const customer = getValues('customer')
      if (customer) {
        setSelectedCustomer(customer)
        engine.customer = customer
        setValue('customer_number', customer.account_number)
        setValue('customer_language', customer.language || '')
      }
    }
    else {
      setSelectedCustomer(null)
    }
  }, [engine, getValues])

  React.useEffect(() => {
    if (props.editMode) handleCustomer()
  }, [props.editMode, handleCustomer])

  React.useImperativeHandle(props.customerRef, () => ({
    resetCustomer: handleCustomer
  }), [handleCustomer])

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
                options={data || []}
                loading={isLoading || isFetching}
                value={selectedCustomer}
                inputValue={inputValue || ''}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'input') {
                    setInputValue(newInputValue)
                    setSearch(newInputValue)
                  } else if (reason === 'reset') {
                    setInputValue(newInputValue)
                  }
                }}
                onChange={(_, value) => {
                  unstable_batchedUpdates(() => {
                    field.onChange(value?.id || '')
                    setValue('customer_language', value?.language || '')
                    setSelectedCustomer(value)
                    engine.customer = value
                    if (value) {
                      setInputValue(`${value.account_number} - ${value.name}`)
                    }
                    props.accessorialRef.current?.loadRateSheet()
                  })
                }}
                getOptionLabel={option => option ? `${option.account_number} - ${option.name}` : ''}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                filterOptions={(x) => x}
                noOptionsText={
                  search && search.length < 2
                    ? 'Type at least 2 characters to search'
                    : 'No customers found'
                }
                renderInput={params => (
                  <TextInput
                    {...params}
                    label='Customer*'
                    name='customer_id'
                    fullWidth
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(isLoading || isFetching) ? (
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