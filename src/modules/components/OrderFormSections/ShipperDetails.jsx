import React from 'react'
import { Grid, TextField, Autocomplete, CircularProgress } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import { Controller, useFormContext } from 'react-hook-form'
import { useAddressBookMutations, useAddressBookSearch } from '../../hooks/useAddressBooks'
import { unstable_batchedUpdates } from 'react-dom'

function ShipperDetails(props) {

  const { engine, selectedValue, enqueueSnackbar } = props

  const {
    control,
    setValue,
    getValues,
  } = useFormContext()

  const { create, patch } = useAddressBookMutations()
  const [search, setSearch] = React.useState('')
  const [inputValue, setInputValue] = React.useState('')
  const [selectedShipper, setSelectedShipper] = React.useState(getValues('shipper_id') ? {
    id: getValues('shipper_id'),
    name: getValues('shipper_name'),
    email: getValues('shipper_email'),
    contact_name: getValues('shipper_contact_name'),
    phone_number: getValues('shipper_phone_number'),
    address: getValues('shipper_address'),
    suite: getValues('shipper_suite'),
    city: getValues('shipper_city'),
    province: getValues('shipper_province'),
    postal_code: getValues('shipper_postal_code'),
    special_instructions: getValues('shipper_special_instructions'),
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
      setValue('shipper_email', value?.email || '')
      setValue('shipper_contact_name', value?.contact_name || '')
      setValue('shipper_phone_number', value?.phone_number || '')
      setValue('shipper_address', value?.address || '')
      setValue('shipper_suite', value?.suite || '')
      setValue('shipper_city', value?.city || '')
      setValue('shipper_province', value?.province || '')
      setValue('shipper_postal_code', value?.postal_code || '')
      setValue('shipper_special_instructions', value?.special_instructions || '')
      setValue('pickup_time_from', value?.op_time_from || null)
      setValue('pickup_time_to', value?.op_time_to || null)
      setValue('pickup_appointment', value?.requires_appointment || false)
      setValue('shipper_no_waiting_time', value?.no_waiting_time || false)
      engine.shipper_city = value?.city || ''
      props.accessorialRef.current?.loadRateSheet()
    })
  }

  const handleSelectedShipper = React.useCallback((value) => {
    requestAnimationFrame(() => {
      setSelectedShipper(value)
      setInputValue(value?.name)
    })
  }, [selectedShipper, inputValue])

  React.useImperativeHandle(props.crossdockShipperRef, () => ({
    loadShipper: handleSelectedShipper,
    resetShipper: () => {
      setSelectedShipper({
        id: getValues('shipper_id') || '',
        name: getValues('shipper_name') || '',
        email: getValues('shipper_email') || '',
        contact_name: getValues('shipper_contact_name') || '',
        phone_number: getValues('shipper_phone_number') || '',
        address: getValues('shipper_address') || '',
        suite: getValues('shipper_suite') || '',
        city: getValues('shipper_city') || '',
        province: getValues('shipper_province') || '',
        postal_code: getValues('shipper_postal_code') || '',
        special_instructions: getValues('shipper_special_instructions') || '',
      })
    }
  }))

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='shipper_id'
          control={control}
          rules={{ required: 'Shipper is a required field' }}
          render={({ field, fieldState }) => {
            return (
              <Autocomplete
                freeSolo
                options={data || []}
                loading={isLoading || isFetching}
                value={selectedShipper}
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
                      setSelectedShipper(value)
                      setInputValue(`${value.name}`)
                      handleSelect(value)
                    })
                  } else {
                    setSelectedShipper(null)
                    field.onChange('')
                    handleSelect({})
                  }
                }}
                onBlur={async () => {
                  if (inputValue && !selectedShipper) {
                    console.log(inputValue);
                    try {
                      const existingShipper = data?.find(c => c.name?.trim().toLowerCase() === inputValue.trim().toLowerCase())
                      if (existingShipper) {
                        unstable_batchedUpdates(() => {
                          field.onChange(existingShipper?.id || '')
                          setSelectedShipper(existingShipper)
                          setInputValue(`${existingShipper.name}`)
                          handleSelect(existingShipper)
                        })
                      } else {
                        const newShipper = await create.mutateAsync({ name: inputValue })
                        if (newShipper && newShipper.id) {
                          unstable_batchedUpdates(() => {
                            field.onChange(newShipper.id)
                            setSelectedShipper(newShipper)
                            setInputValue(`${newShipper.name}`)
                            handleSelect(newShipper)
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
                noOptionsText={search && search?.length < 2 ? 'Type...' : 'No Address found'}
                slotProps={{ popper: { placement: 'top-start', }, }}
                renderInput={params => (
                  <TextInput
                    {...params}
                    label='Shipper*'
                    name='shipper_id'
                    placeholder='Type...'
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
        <Controller
          control={control}
          name='shipper_email'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Email'
              disabled={!selectedShipper?.id}
              id='email'
              type='email'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === selectedShipper?.id) {
                  setValue('receiver_email', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedShipper?.id, payload: { [key]: value } })
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
          name='shipper_contact_name'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Contact Name'
              disabled={!selectedShipper?.id}
              id='contact_name'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === selectedShipper?.id) {
                  setValue('receiver_contact_name', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedShipper?.id, payload: { [key]: value } })
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
          name='shipper_phone_number'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Phone Number'
              disabled={!selectedShipper?.id}
              id='phone_number'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === selectedShipper?.id) {
                  setValue('receiver_phone_number', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedShipper?.id, payload: { [key]: value } })
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
          name='shipper_address'
          rules={{ required: 'Address is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Address*'
              variant='outlined'
              disabled={!selectedShipper?.id}
              id='address'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === selectedShipper?.id) {
                  setValue('receiver_address', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  console.log('object');
                  patch.mutate({ id: selectedShipper?.id, payload: { [key]: value } })
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
          name='shipper_suite'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Suite'
              disabled={!selectedShipper?.id}
              id='suite'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === selectedShipper?.id) {
                  setValue('receiver_suite', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedShipper?.id, payload: { [key]: value } })
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
          name='shipper_city'
          rules={{ required: 'City is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='City*'
              disabled={!selectedShipper?.id}
              id='city'
              value={field.value || ''}
              onChange={(e) => {
                const value = e.target.value
                field.onChange(value)
                engine.shipper_city = value
              }}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === selectedShipper?.id) {
                  setValue('receiver_city', value)
                  engine.receiver_city = value
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedShipper?.id, payload: { [key]: value } })
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
          name='shipper_province'
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
              disabled={!selectedShipper?.id}
              id='province'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === selectedShipper?.id) {
                  setValue('receiver_province', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedShipper?.id, payload: { [key]: value } })
                }
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
          name='shipper_postal_code'
          rules={{ required: 'Postal Code is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Postal Code*'
              disabled={!selectedShipper?.id}
              variant='outlined'
              id='postal_code'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === selectedShipper?.id) {
                  setValue('receiver_postal_code', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedShipper?.id, payload: { [key]: value } })
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
          name='shipper_special_instructions'
          render={({ field }) => (
            <TextField
              {...field}
              label='Special Instructions'
              variant='outlined'
              disabled={!selectedShipper?.id}
              multiline
              id='special_instructions'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === selectedShipper?.id) {
                  setValue('receiver_special_instructions', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: selectedShipper?.id, payload: { [key]: value } })
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


export default React.memo(ShipperDetails)