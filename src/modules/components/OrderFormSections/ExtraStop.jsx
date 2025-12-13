import React from 'react'
import { Grid, FormControl, Switch, TextField, Autocomplete, CircularProgress } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useAddressBookSearch } from '../../hooks/useAddressBooks'
import { useQueryClient } from '@tanstack/react-query'

function ExtraStop(props) {

  const { enqueueSnackbar } = props

  const {
    control,
    setValue,
    getValues,
  } = useFormContext()

  const isExtraStop = useWatch({ control, name: 'is_extra_stop' });
  const [inputValue, setInputValue] = React.useState('')
  const [search, setSearch] = React.useState('')
  const queryClient = useQueryClient()
  const { data, isLoading, isFetching, isError, error } = useAddressBookSearch(search)

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message
      const status = error.response?.status
      const errorMessage = message ? `${message} - ${status}` : error.message
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }, [isError, error, enqueueSnackbar])

  const handleChange = checked => {
    requestAnimationFrame(async () => {
      if (checked) {
        const address_book = queryClient.getQueryData(['addressBookByName', 'messagers'])
        if (!address_book) return
        setValue('extra_stop_name', address_book?.name || '')
        setValue('extra_stop_email', address_book?.email || '')
        setValue('extra_stop_contact_name', address_book?.contact_name || '')
        setValue('extra_stop_phone_number', address_book?.phone_number || '')
        setValue('extra_stop_province', address_book?.province || '')
        setValue('extra_stop_city', address_book?.city || '')
        setValue('extra_stop_postal_code', address_book?.postal_code || '')
        setValue('extra_stop_address', address_book?.address || '')
        setValue('extra_stop_suite', address_book?.suite || '')
        setValue('extra_stop_special_instructions', address_book?.special_instructions || '')
      } else {
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
        setInputValue('')
        setSearch('')
      }
    })
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
            <Controller
              name='extra_stop_name'
              control={control}
              rules={{
                required: isExtraStop ? 'Crossdock is a required field' : false,
                validate: (value) => {
                  if (isExtraStop && (!value || value.trim() === '')) {
                    return 'Crossdock is a required field';
                  }
                  return true;
                }
              }}
              render={({ field, fieldState }) => {
                return (
                  <Autocomplete
                    freeSolo
                    options={data || []}
                    value={field.value || ''}
                    inputValue={inputValue || ''}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'reset') {
                        setInputValue(newInputValue)
                        return
                      }
                      else if (reason === 'input') {
                        setInputValue(newInputValue)
                        field.onChange(newInputValue)
                        if (newInputValue?.length >= 2) setSearch(newInputValue)
                        else setSearch('')
                      }
                      else if (reason === 'clear') {
                        field.onChange('')
                        setInputValue('')
                        setSearch('')
                      }
                    }}
                    onChange={(e, value, reason) => {
                      if (typeof value === "string") {
                        field.onChange(value);
                        return;
                      }
                      if (value && typeof value === "object") {
                        field.onChange(value['name'] || "");
                        setValue('extra_stop_email', value?.email || '')
                        setValue('extra_stop_contact_name', value?.contact_name || '')
                        setValue('extra_stop_phone_number', value?.phone_number || '')
                        setValue('extra_stop_address', value?.address || '')
                        setValue('extra_stop_suite', value?.suite || '')
                        setValue('extra_stop_city', value?.city || '')
                        setValue('extra_stop_province', value?.province || '')
                        setValue('extra_stop_postal_code', value?.postal_code || '')
                        setValue('extra_stop_special_instructions', value?.special_instructions || '')
                        return;
                      }
                    }}
                    getOptionLabel={(opt) => typeof opt === "string" ? opt : opt['name'] || ""}
                    filterOptions={(x) => x}
                    noOptionsText={search && search?.length < 2 ? 'Type...' : 'No Address found'}
                    slotProps={{ popper: { placement: 'top-start', }, }}
                    renderInput={params => (
                      <TextInput
                        {...params}
                        label='Crossdock*'
                        placeholder='Type...'
                        name='extra_stop_name'
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
              name='extra_stop_email'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Email'
                  id='email'
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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
                  name='extra_stop_address'
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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
                  name='extra_stop_city'
                  variant='outlined'
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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
                  name='extra_stop_province'
                  variant='outlined'
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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
                  name='extra_stop_postal_code'
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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
