import React from 'react'
import { Grid, FormControl, Switch } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import global from '../../global'
import { Controller, useWatch } from 'react-hook-form'

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
            <TextInput
              label='Crossdock'
              variant='outlined'
              fullWidth
              {...register('extra_shop.crossdock')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextInput
              label='Email'
              variant='outlined'
              fullWidth
              {...register('extra_shop.email')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextInput
              label='Contact Name'
              variant='outlined'
              fullWidth
              {...register('extra_shop.contact_name')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextInput
              label='Phone Number'
              variant='outlined'
              fullWidth
              {...register('extra_shop.phone_number')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <TextInput
              label='Address'
              variant='outlined'
              fullWidth
              {...register('extra_shop.address')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextInput
              label='Suite'
              variant='outlined'
              fullWidth
              {...register('extra_shop.suite')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextInput
              label='City'
              variant='outlined'
              fullWidth
              {...register('extra_shop.city')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextInput
              label='Province/State*'
              variant='outlined'
              fullWidth
              {...register('extra_shop.province')}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextInput
              label='Postal code*'
              variant='outlined'
              fullWidth
              {...register('extra_shop.postal_code')}
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default React.memo(ExtraShop)
