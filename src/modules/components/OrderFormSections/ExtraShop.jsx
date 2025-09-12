import React from 'react'
import { Grid, FormControl, Switch } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import global from '../../global'
import { Controller, useWatch } from 'react-hook-form'
import SearchableInput from '../CustomComponents/SearchableInput'

function ExtraShop (props) {
  const address_book = global.static.address_book[0]
  const { register, setValue, control } = props

  const isExtraShop = useWatch({
    control,
    name: 'extra_shop.extra_shop',
    defaultValue: false
  })

  const handleChange = checked => {
    if (checked) {
      setValue('extra_shop.crossdock', address_book.company_location)
      setValue('extra_shop.email', address_book.email_address)
      setValue('extra_shop.contact_name', address_book.contact_name)
      setValue('extra_shop.phone_number', address_book.phone_number)
      setValue('extra_shop.province', address_book.province)
      setValue('extra_shop.city', address_book.city)
      setValue('extra_shop.postal_code', address_book.postal_code)
      setValue('extra_shop.address', address_book.street_address)
    } else {
      setValue('extra_shop.crossdock', '')
      setValue('extra_shop.email', '')
      setValue('extra_shop.contact_name', '')
      setValue('extra_shop.phone_number', '')
      setValue('extra_shop.province', '')
      setValue('extra_shop.city', '')
      setValue('extra_shop.postal_code', '')
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Controller
                name='extra_shop.extra_shop'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      handleChange(checked)
                    }}
                  />
                )}
              />
            }
            label='Extra Shop'
          />
        </FormControl>
      </Grid>
      {isExtraShop && (
        <>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <SearchableInput
              name='extra_shop.crossdock'
              control={control}
              options={global.static.address_book}
              fieldProp='company_location'
              onSelect={value => {
                setValue('extra_shop.email', value?.email_address || '')
                setValue('extra_shop.contact_name', value?.contact_name || '')
                setValue('extra_shop.phone_number', value?.phone_number || '')
                setValue('extra_shop.address', value?.street_address || '')
                setValue('extra_shop.city', value?.city || '')
                setValue('extra_shop.suite', value?.suite || '')
                setValue('extra_shop.province', value?.province || '')
                setValue('extra_shop.postal_code', value?.postal_code || '')
              }}
              label='Crossdock'
              placeholder='Type name...'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_shop.email'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Email'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_shop.contact_name'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Contact Name'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_shop.phone_number'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Phone Number'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Controller
              control={control}
              name='extra_shop.address'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Address'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_shop.suite'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Suite'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_shop.city'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='City'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_shop.province'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Province'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              control={control}
              name='extra_shop.postal_code'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Postal Code'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default React.memo(ExtraShop)
