import React from 'react'
import { Grid, TextField } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import SearchableInput from '../CustomComponents/SearchableInput'
import { Controller, useWatch } from 'react-hook-form'
import { useAddressBookMutations, useAddressBooks } from '../../hooks/useAddressBooks'

function ShipperDetails(props) {

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

  const shipperSelected = useWatch({
    name: 'shipper_id',
    control: control
  })

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
          onSelect={value => {
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
          }}
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
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Email'
              disabled={!shipperSelected}
              id='email'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: shipperSelected, payload: { [key]: value } })
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
          name='shipper_contact_name'
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Contact Name'
              disabled={!shipperSelected}
              id='contact_name'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: shipperSelected, payload: { [key]: value } })
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
          name='shipper_phone_number'
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Phone Number'
              disabled={!shipperSelected}
              id='phone_number'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: shipperSelected, payload: { [key]: value } })
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
          name='shipper_address'
          rules={{ required: 'Address is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Address*'
              variant='outlined'
              disabled={!shipperSelected}
              id='address'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: shipperSelected, payload: { [key]: value } })
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
          name='shipper_suite'
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Suite'
              disabled={!shipperSelected}
              id='suite'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: shipperSelected, payload: { [key]: value } })
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
          name='shipper_city'
          rules={{ required: 'City is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='City*'
              disabled={!shipperSelected}
              id='city'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: shipperSelected, payload: { [key]: value } })
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
          name='shipper_province'
          rules={{ required: 'Province/State is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Province*'
              disabled={!shipperSelected}
              id='province'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: shipperSelected, payload: { [key]: value } })
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
          name='shipper_postal_code'
          rules={{ required: 'Postal Code is a required field' }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Postal Code*'
              disabled={!shipperSelected}
              variant='outlined'
              id='postal_code'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: shipperSelected, payload: { [key]: value } })
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
          name='shipper_special_instructions'
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Special Instructions'
              variant='outlined'
              disabled={!shipperSelected}
              multiline
              id='special_instructions'
              onBlur={async (e) => {
                const { id: key, value } = e.target
                if (value?.trim()?.toLowerCase() !== selectedValue.current[key]?.trim()?.toLowerCase()) {
                  const nAB = await patch.mutateAsync({ id: shipperSelected, payload: { [key]: value } })
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


export default React.memo(ShipperDetails)