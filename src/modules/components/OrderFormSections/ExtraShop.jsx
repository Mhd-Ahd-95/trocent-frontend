import React from 'react'
import { Grid, FormControl, Switch } from '@mui/material'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'

export default function ExtraShop (props) {
  const { watch, register, errors } = props

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <FormControl>
          <CustomFormControlLabel
            control={<Switch {...register('extra_shop.extra_shop')} />}
            label='Extra Shop'
          />
        </FormControl>
      </Grid>
      {watch('extra_shop.extra_shop') && (
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
