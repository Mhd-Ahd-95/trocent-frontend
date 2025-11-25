import React from 'react'
import { Grid, FormControl, Switch, TextField } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import global from '../../global'
import { Controller, useWatch, useFormContext } from 'react-hook-form'
import SearchableInput from '../CustomComponents/SearchableInput'
import { useAddressBooks, useAddressBookMutations } from '../../hooks/useAddressBooks'
import SearchableAndCreateInput from '../CustomComponents/SearchableAndCreateInput'

function ExtraStop(props) {

  const { data } = useAddressBooks()
  const selectedValue = React.useRef({})

  const {
    control,
    setValue,
    getValues,
  } = useFormContext()

  const isExtraStop = useWatch({
    control,
    name: 'is_extra_stop',
    defaultValue: false
  })

  const handleChange = checked => {
    const address_book = data?.find(ab => ab.name.toLowerCase() === 'messagers')
    if (checked) {
      selectedValue.current = address_book
      setValue('extra_stop_name', address_book.name || '')
      setValue('extra_stop_email', address_book.email || '')
      setValue('extra_stop_contact_name', address_book.contact_name || '')
      setValue('extra_stop_phone_number', address_book.phone_number || '')
      setValue('extra_stop_province', address_book.province || '')
      setValue('extra_stop_city', address_book.city || '')
      setValue('extra_stop_postal_code', address_book.postal_code || '')
      setValue('extra_stop_address', address_book.address || '')
      setValue('extra_stop_suite', address_book.suite || '')
      setValue('extra_stop_special_instructions', address_book.special_instructions || '')
    } else {
      selectedValue.current = {}
      setValue('extra_stop_name', '')
      setValue('extra_stop_email', '')
      setValue('extra_stop_contact_name', '')
      setValue('extra_stop_phone_number', '')
      setValue('extra_stop_province', '')
      setValue('extra_stop_city', '')
      setValue('extra_stop_postal_code', '')
      setValue('extra_stop_suite', '')
      setValue('extra_stop_special_instructions', '')
      setValue('extra_stop_address', '')
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Controller
                name='is_extra_stop'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={Boolean(field.value) || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      handleChange(checked)
                      const accessorials = getValues('customer_accessorials')
                      const index = accessorials.findIndex(acc => acc.charge_name?.trim()?.toLowerCase() === 'extra stop')
                      if (index !== -1) {
                        props.accessorialRef.current?.change(checked, accessorials[index], index)
                      }
                    }}
                  />
                )}
              />
            }
            label='Extra Stop'
          />
        </FormControl>
      </Grid>
      {isExtraStop && (
        <>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <SearchableAndCreateInput
              name='extra_stop_name'
              control={control}
              options={data || []}
              above
              fieldProp='name'
              noID
              onSelect={value => {
                selectedValue.current = value
                setValue('extra_stop_email', value?.email || '')
                setValue('extra_stop_contact_name', value?.contact_name || '')
                setValue('extra_stop_phone_number', value?.phone_number || '')
                setValue('extra_stop_address', value?.address || '')
                setValue('extra_stop_suite', value?.suite || '')
                setValue('extra_stop_city', value?.city || '')
                setValue('extra_stop_province', value?.province || '')
                setValue('extra_stop_postal_code', value?.postal_code || '')
                setValue('extra_stop_special_instructions', value?.special_instructions || '')
              }}
              label='Crossdock'
              rules={isExtraStop ? { required: 'Crossdock is a required field' } : {}}
              placeholder='Type name...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_stop_email'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Email'
                  id='email'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_stop_contact_name'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Contact Name'
                  id='contact_name'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_stop_phone_number'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Phone Number'
                  id='phone_number'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Controller
              control={control}
              name='extra_stop_address'
              rules={{ required: 'Address is a required field' }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Address*'
                  variant='outlined'
                  id='address'
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
              name='extra_stop_suite'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Suite'
                  id='suite'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_stop_city'
              rules={{ required: 'City is a required field' }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='City*'
                  id='city'
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
              name='extra_stop_province'
              rules={{ required: 'Province/State is a required field' }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Province*'
                  id='province'
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
              name='extra_stop_postal_code'
              rules={{ required: 'Postal Code is a required field' }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Postal Code*'
                  variant='outlined'
                  id='postal_code'
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
              name='extra_stop_special_instructions'
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label='Special Instructions'
                  variant='outlined'
                  multiline
                  id='special_instructions'
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
        </>
      )}
    </Grid>
  )
}

export default React.memo(ExtraStop)
