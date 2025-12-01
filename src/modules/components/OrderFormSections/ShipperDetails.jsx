import React from 'react'
import { Grid, TextField } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import SearchableInput from '../CustomComponents/SearchableInput'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useAddressBookMutations } from '../../hooks/useAddressBooks'
import { unstable_batchedUpdates } from 'react-dom'

function ShipperDetails(props) {

  const { data, isLoading, engine, selectedValue } = props

  const {
    control,
    setValue,
    getValues,
  } = useFormContext()

  const { create, patch } = useAddressBookMutations()

  const shipperSelected = useWatch({
    name: 'shipper_id',
    control: control
  })

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

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <SearchableInput
          name='shipper_id'
          above
          loading={isLoading}
          control={control}
          options={data || []}
          fieldProp='name'
          onSelect={value => handleSelect(value)}
          onBlur={async (value) => await create.mutateAsync({ name: value })}
          rules={{ required: 'Shipper is a required field' }}
          label='Shipper*'
          placeholder='Type name...'
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
              disabled={!shipperSelected}
              id='email'
              type='email'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === shipperSelected) {
                  setValue('receiver_email', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: shipperSelected, payload: { [key]: value } })
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
              disabled={!shipperSelected}
              id='contact_name'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === shipperSelected) {
                  setValue('receiver_contact_name', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: shipperSelected, payload: { [key]: value } })
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
              disabled={!shipperSelected}
              id='phone_number'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === shipperSelected) {
                  setValue('receiver_phone_number', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: shipperSelected, payload: { [key]: value } })
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
              disabled={!shipperSelected}
              id='address'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === shipperSelected) {
                  setValue('receiver_address', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: shipperSelected, payload: { [key]: value } })
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
              disabled={!shipperSelected}
              id='suite'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === shipperSelected) {
                  setValue('receiver_suite', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: shipperSelected, payload: { [key]: value } })
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
              disabled={!shipperSelected}
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
                if (receiver_id === shipperSelected) {
                  setValue('receiver_city', value)
                  engine.receiver_city = value
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: shipperSelected, payload: { [key]: value } })
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
              disabled={!shipperSelected}
              id='province'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === shipperSelected) {
                  setValue('receiver_province', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: shipperSelected, payload: { [key]: value } })
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
              disabled={!shipperSelected}
              variant='outlined'
              id='postal_code'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === shipperSelected) {
                  setValue('receiver_postal_code', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: shipperSelected, payload: { [key]: value } })
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
              disabled={!shipperSelected}
              multiline
              id='special_instructions'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const receiver_id = getValues('receiver_id')
                if (receiver_id === shipperSelected) {
                  setValue('receiver_special_instructions', value)
                  props.receiverSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: shipperSelected, payload: { [key]: value } })
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