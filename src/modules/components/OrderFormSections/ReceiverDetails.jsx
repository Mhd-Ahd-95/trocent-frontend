import React from 'react'
import { Grid, TextField } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import SearchableInput from '../CustomComponents/SearchableInput'
import { Controller, useWatch } from 'react-hook-form'
import { useAddressBookMutations, useAddressBooks } from '../../hooks/useAddressBooks'

function ReceiverDetails(props) {

  const { control, setValue } = props

  const { data, isLoading, isError, error } = useAddressBooks()

  const { create, patch } = useAddressBookMutations()

  const selectedValue = React.useRef({})

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      const errorMessage = message ? `${message} - ${status}` : error.message;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [isError, error])

  const receiverSelected = useWatch({
    name: 'receiver_id',
    control: control
  })

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
          onSelect={value => {
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
          }}
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
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Email'
              disabled={!receiverSelected}
              id='email'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: receiverSelected, payload: { [key]: value } })
                  field.onChange(nAB.email)
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
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Contact Name'
              disabled={!receiverSelected}
              id='contact_name'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: receiverSelected, payload: { [key]: value } })
                  field.onChange(nAB.contact_name)
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
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Phone Number'
              disabled={!receiverSelected}
              id='phone_number'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: receiverSelected, payload: { [key]: value } })
                  field.onChange(nAB.phone_number)
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
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: receiverSelected, payload: { [key]: value } })
                  field.onChange(nAB.address)
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
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Suite'
              disabled={!receiverSelected}
              id='suite'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: receiverSelected, payload: { [key]: value } })
                  field.onChange(nAB.suite)
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
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: receiverSelected, payload: { [key]: value } })
                  field.onChange(nAB.city)
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
          name='receiver_province'
          rules={{ required: 'Province/State is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Province*'
              disabled={!receiverSelected}
              id='province'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: receiverSelected, payload: { [key]: value } })
                  field.onChange(nAB.province)
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
          name='receiver_postal_code'
          rules={{ required: 'Postal Code is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Postal Code*'
              disabled={!receiverSelected}
              variant='outlined'
              id='postal_code'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: receiverSelected, payload: { [key]: value } })
                  field.onChange(nAB.postal_code)
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
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Special Instructions'
              variant='outlined'
              disabled={!receiverSelected}
              multiline
              id='special_instructions'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: receiverSelected, payload: { [key]: value } })
                  field.onChange(nAB.special_instructions)
                }
              }}
              minRows={4}
              maxRows={4}
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