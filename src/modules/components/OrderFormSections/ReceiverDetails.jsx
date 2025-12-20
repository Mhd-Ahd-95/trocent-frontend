import React from 'react'
import { Grid, TextField, Autocomplete, CircularProgress } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import { Controller, useFormContext } from 'react-hook-form'
import { useAddressBookMutations, useAddressBookSearch } from '../../hooks/useAddressBooks'
import { unstable_batchedUpdates } from 'react-dom'

function ReceiverDetails(props) {

  const { engine, selectedValue, enqueueSnackbar } = props

  const {
    control,
    setValue,
    getValues
  } = useFormContext()

  const { create, patch } = useAddressBookMutations()
  const [search, setSearch] = React.useState('')
  const [inputValue, setInputValue] = React.useState('')
  const [selectedReceiver, setSelectedReceiver] = React.useState(props.editMode ? {
    id: getValues('receiver_id'),
    name: getValues('receiver_name'),
    email: getValues('receiver_email'),
    contact_name: getValues('receiver_contact_name'),
    phone_number: getValues('receiver_phone_number'),
    address: getValues('receiver_address'),
    suite: getValues('receiver_suite'),
    city: getValues('receiver_city'),
    province: getValues('receiver_province'),
    postal_code: getValues('receiver_postal_code'),
    special_instructions: getValues('receiver_special_instructions'),
  } : null)

  const { data, isLoading, isFetching, isError, error } = useAddressBookSearch(search)

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message
      const status = error.response?.status
      const errorMessage = message ? `${message} - ${status}` : error.message
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }, [isError, error, enqueueSnackbar])

  const handleSelect = (value) => {
    unstable_batchedUpdates(() => {
      selectedValue.current = value
      setValue('receiver_email', value?.email || '')
      setValue('receiver_contact_name', value?.contact_name || '')
      setValue('receiver_phone_number', value?.phone_number || '')
      setValue('receiver_address', value?.address || '')
      setValue('receiver_suite', value?.suite || '')
      setValue('receiver_city', value?.city || '')
      setValue('receiver_province', value?.province || '')
      setValue('receiver_postal_code', value?.postal_code || '')
      setValue('receiver_special_instructions', value?.special_instructions || '')
      setValue('delivery_time_from', value?.op_time_from || null)
      setValue('delivery_time_to', value?.op_time_to || null)
      setValue('delivery_appointment', value?.requires_appointment || false)
      setValue('receiver_no_waiting_time', value?.no_waiting_time || false)
      engine.receiver_city = value?.city || ''
      engine.receiverProvince = value?.province || ''
      props.accessorialRef.current?.loadRateSheet()
    })
  }

  const handleSelectedReceiver = React.useCallback((value) => {
    requestAnimationFrame(() => {
      setSelectedReceiver(value)
      setInputValue(value?.name)
    })
  }, [selectedReceiver, inputValue])

  React.useImperativeHandle(props.crossdockReceiverRef, () => ({
    loadReceiver: handleSelectedReceiver,
    resetReceiver: () => {
      setSelectedReceiver({
        id: getValues('receiver_id'),
        name: getValues('receiver_name'),
        email: getValues('receiver_email'),
        contact_name: getValues('receiver_contact_name'),
        phone_number: getValues('receiver_phone_number'),
        address: getValues('receiver_address'),
        suite: getValues('receiver_suite'),
        city: getValues('receiver_city'),
        province: getValues('receiver_province'),
        postal_code: getValues('receiver_postal_code'),
        special_instructions: getValues('receiver_special_instructions'),
      })
    }
  }))

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='receiver_id'
          control={control}
          rules={{ required: 'Receiver is a required field' }}
          render={({ field, fieldState }) => {
            return (
              <Autocomplete
                freeSolo
                options={data || []}
                loading={isLoading || isFetching}
                value={selectedReceiver}
                inputValue={inputValue || ''}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'reset') {
                    if (!newInputValue || newInputValue === 'undefined' || newInputValue === 'null') {
                      setInputValue('')
                    } else {
                      setInputValue(newInputValue)
                    }
                    return
                  }
                  else if (reason === 'input') {
                    setInputValue(newInputValue)
                    if (newInputValue?.length >= 2) setSearch(newInputValue)
                    else setSearch('')
                  }
                  else if (reason === 'clear') {
                    setInputValue('')
                    setSearch('')
                  }
                }}
                onChange={(_, value) => {
                  if (value && typeof value === 'object') {
                    unstable_batchedUpdates(() => {
                      field.onChange(value?.id || '')
                      setSelectedReceiver(value)
                      setInputValue(`${value.name}`)
                      handleSelect(value)
                    })
                  } else {
                    setSelectedReceiver(null)
                    field.onChange('')
                    handleSelect({})
                  }
                }}
                onBlur={async () => {
                  if (inputValue && !selectedReceiver) {
                    try {
                      const existingReceiver = data?.find(c => c.name?.trim().toLowerCase() === inputValue.trim().toLowerCase())
                      if (existingReceiver) {
                        unstable_batchedUpdates(() => {
                          field.onChange(existingReceiver?.id || '')
                          setSelectedReceiver(existingReceiver)
                          setInputValue(`${existingReceiver.name}`)
                          handleSelect(existingReceiver)
                        })
                      } else {
                        const newReceiver = await create.mutateAsync({ name: inputValue })
                        if (newReceiver && newReceiver.id) {
                          unstable_batchedUpdates(() => {
                            field.onChange(newReceiver.id)
                            setSelectedReceiver(newReceiver)
                            setInputValue(`${newReceiver.name}`)
                            handleSelect(newReceiver)
                          })
                        }
                      }
                    } catch (error) {
                      console.error('Error creating address book:', error)
                      setInputValue('')
                    }
                  }
                }}
                getOptionLabel={option => option ? `${option.name}` : ''}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                filterOptions={(x) => x}
                noOptionsText={search && search.length < 2 ? 'Type...' : 'No Address found'}
                slotProps={{ popper: { placement: 'top-start' } }}
                renderInput={params => (
                  <TextInput
                    {...params}
                    label='Receiver*'
                    placeholder='Type...'
                    fullWidth
                    name='receiver_id'
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
        <Controller
          control={control}
          name='receiver_email'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Email'
              disabled={!selectedReceiver?.id}
              id='email'
              type='email'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === selectedReceiver?.id) {
                  setValue('shipper_email', value)
                  props.shipperSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedReceiver?.id, payload: { [key]: value } })
                }
              }}
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name='receiver_contact_name'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Contact Name'
              disabled={!selectedReceiver?.id}
              id='contact_name'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === selectedReceiver?.id) {
                  setValue('shipper_contact_name', value)
                  props.shipperSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedReceiver?.id, payload: { [key]: value } })
                }
              }}
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name='receiver_phone_number'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Phone Number'
              disabled={!selectedReceiver?.id}
              id='phone_number'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === selectedReceiver?.id) {
                  setValue('shipper_phone_number', value)
                  props.shipperSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedReceiver?.id, payload: { [key]: value } })
                }
              }}
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          control={control}
          name='receiver_address'
          rules={{ required: 'Address is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Address*'
              variant='outlined'
              disabled={!selectedReceiver?.id}
              id='address'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === selectedReceiver?.id) {
                  setValue('shipper_address', value)
                  props.shipperSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedReceiver?.id, payload: { [key]: value } })
                }
              }}
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
          name='receiver_suite'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Suite'
              disabled={!selectedReceiver?.id}
              value={field.value || ''}
              id='suite'
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === selectedReceiver?.id) {
                  setValue('shipper_suite', value)
                  props.shipperSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedReceiver?.id, payload: { [key]: value } })
                }
              }}
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name='receiver_city'
          rules={{ required: 'City is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='City*'
              disabled={!selectedReceiver?.id}
              id='city'
              value={field.value || ''}
              onChange={(e) => {
                const value = e.target.value
                field.onChange(value)
                engine.receiver_city = value
              }}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === selectedReceiver?.id) {
                  setValue('shipper_city', value)
                  props.shipperSelectedValue.current[key] = value
                  engine.shipper_city = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedReceiver?.id, payload: { [key]: value } })
                }
                props.accessorialRef.current?.loadRateSheet()
              }}
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
          name='receiver_province'
          rules={{
            required: 'Province/State is a required field',
            maxLength: {
              value: 2,
              message: 'Province must be 2 Character'
            },
            validate: value => {
              value > 2 ? 'Province must be 2 Character' : true
            }
          }}
          inputProps={{ maxLength: 2 }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Province*'
              disabled={!selectedReceiver?.id}
              id='province'
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e.target.value)
                engine.receiverProvince = e.target.value
              }}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === selectedReceiver?.id) {
                  setValue('shipper_province', value)
                  props.shipperSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedReceiver?.id, payload: { [key]: value } })
                }
                props.calculationRef.current?.recalculate()
              }}
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
          name='receiver_postal_code'
          rules={{ required: 'Postal Code is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Postal Code*'
              disabled={!selectedReceiver?.id}
              variant='outlined'
              id='postal_code'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === selectedReceiver?.id) {
                  setValue('shipper_postal_code', value)
                  props.shipperSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedReceiver?.id, payload: { [key]: value } })
                }
              }}
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
          name='receiver_special_instructions'
          render={({ field }) => (
            <TextField
              {...field}
              label='Special Instructions'
              variant='outlined'
              disabled={!selectedReceiver?.id}
              multiline
              id='special_instructions'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === selectedReceiver?.id) {
                  setValue('shipper_special_instructions', value)
                  props.shipperSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: receiverSelected, payload: { [key]: value } })
                }
              }}
              minRows={2}
              maxRows={2}
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


export default React.memo(ReceiverDetails)