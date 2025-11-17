import React from 'react'
import { Grid, TextField } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import SearchableInput from '../CustomComponents/SearchableInput'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useAddressBookMutations } from '../../hooks/useAddressBooks'
import { unstable_batchedUpdates } from 'react-dom'

function ReceiverDetails(props) {

  const { data, isLoading, engine, selectedValue } = props

  const {
    control,
    setValue,
    getValues
  } = useFormContext()

  const { create, patch } = useAddressBookMutations()

  const receiverSelected = useWatch({
    name: 'receiver_id',
    control: control
  })

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
      props.calculationRef?.current?.recalculate()
    })
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <SearchableInput
          name='receiver_id'
          loading={isLoading}
          control={control}
          above
          options={data || []}
          fieldProp='name'
          onSelect={value => handleSelect(value)}
          onBlur={async (value) => await create.mutateAsync({ name: value })}
          rules={{ required: 'Receiver is a required field' }}
          label='Receiver*'
          placeholder='Type name...'
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
              disabled={!receiverSelected}
              id='email'
              type='email'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === receiverSelected) {
                  setValue('shipper_email', value)
                  props.shipperSelectedValue.current[key] = value
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
          name='receiver_contact_name'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Contact Name'
              disabled={!receiverSelected}
              id='contact_name'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === receiverSelected) {
                  setValue('shipper_contact_name', value)
                  props.shipperSelectedValue.current[key] = value
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
          name='receiver_phone_number'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Phone Number'
              disabled={!receiverSelected}
              id='phone_number'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === receiverSelected) {
                  setValue('shipper_phone_number', value)
                  props.shipperSelectedValue.current[key] = value
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
          name='receiver_address'
          rules={{ required: 'Address is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Address*'
              variant='outlined'
              disabled={!receiverSelected}
              id='address'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === receiverSelected) {
                  setValue('shipper_address', value)
                  props.shipperSelectedValue.current[key] = value
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
          name='receiver_suite'
          render={({ field }) => (
            <TextInput
              {...field}
              label='Suite'
              disabled={!receiverSelected}
              id='suite'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === receiverSelected) {
                  setValue('shipper_suite', value)
                  props.shipperSelectedValue.current[key] = value
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
          name='receiver_city'
          rules={{ required: 'City is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='City*'
              disabled={!receiverSelected}
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
                if (shipper_id === receiverSelected) {
                  setValue('shipper_city', value)
                  props.shipperSelectedValue.current[key] = value
                  engine.shipper_city = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: receiverSelected, payload: { [key]: value } })
                }
                props.calculationRef?.current?.recalculate()
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
              disabled={!receiverSelected}
              id='province'
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e.target.value)
                engine.receiverProvince = e.target.value
              }}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === receiverSelected) {
                  setValue('shipper_province', value)
                  props.shipperSelectedValue.current[key] = value
                }
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  selectedValue.current[key] = value
                  patch.mutate({ id: shipperSelected, payload: { [key]: value } })
                }
                props.calculationRef.current?.recalculate()
              }}
              // onBlur={async (e) => {
              //   const { id: key, value } = e.target
              //   if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
              //     const nAB = await patch.mutateAsync({ id: receiverSelected, payload: { [key]: value } })
              //     field.onChange(nAB.province)
              //     engine.receiverProvince = nAB.province
              //     props.calculationRef.current?.recalculate()
              //   }
              // }}
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
              disabled={!receiverSelected}
              variant='outlined'
              id='postal_code'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === receiverSelected) {
                  setValue('shipper_postal_code', value)
                  props.shipperSelectedValue.current[key] = value
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
          name='receiver_special_instructions'
          render={({ field }) => (
            <TextField
              {...field}
              label='Special Instructions'
              variant='outlined'
              disabled={!receiverSelected}
              multiline
              id='special_instructions'
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={(e) => {
                const { id: key, value } = e.target
                const shipper_id = getValues('shipper_id')
                if (shipper_id === receiverSelected) {
                  setValue('shipper_special_instructions', value)
                  props.shipperSelectedValue.current[key] = value
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


export default React.memo(ReceiverDetails)