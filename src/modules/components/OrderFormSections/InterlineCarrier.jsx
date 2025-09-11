import React from 'react'
import { Grid, FormControl, Switch, FormHelperText } from '@mui/material'
import { InterlineCarrierForm, TabInterlineForm } from './InterlineCarrierForm'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'

export default function InterlineCarrier (props) {
  const { watch, register, errors } = props

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <FormControl>
          <CustomFormControlLabel
            control={<Switch {...register('interline_carrier.pickup')} />}
            label='Pickup'
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <FormControl>
          <CustomFormControlLabel
            control={<Switch {...register('interline_carrier.delivery')} />}
            label='Delivery'
          />
        </FormControl>
      </Grid>
      <Grid size={12}>
        {watch('interline_carrier.pickup') &&
          watch('interline_carrier.delivery') && (
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <FormControl>
                <CustomFormControlLabel
                  control={
                    <Switch
                      {...register('interline_carrier.same_carrier_for_both')}
                    />
                  }
                  label='Same Carrier for Both'
                />
                <FormHelperText>
                  Uncheck to use different carriers for pickup and delivery
                </FormHelperText>
              </FormControl>
            </Grid>
          )}
        {watch('interline_carrier.pickup') &&
          !watch('interline_carrier.delivery') &&
          !watch('interline_carrier.same_carrier_for_both') && (
            <InterlineCarrierForm register={register} interline_type='pickup' />
          )}
        {!watch('interline_carrier.pickup') &&
          watch('interline_carrier.delivery') &&
          !watch('interline_carrier.same_carrier_for_both') && (
            <InterlineCarrierForm
              register={register}
              interline_type='delivery'
            />
          )}
        {watch('interline_carrier.pickup') &&
          watch('interline_carrier.delivery') &&
          watch('interline_carrier.same_carrier_for_both') && (
            <InterlineCarrierForm register={register} />
          )}
        {watch('interline_carrier.pickup') &&
          watch('interline_carrier.delivery') &&
          !watch('interline_carrier.same_carrier_for_both') && (
            <TabInterlineForm
              labels={['Pickup Carrier', 'Delivery Carrier']}
              contents={[
                <InterlineCarrierForm
                  register={register}
                  label='Pickup'
                  interline_type='pickup'
                />,
                <InterlineCarrierForm
                  register={register}
                  label='Delivery'
                  interline_type='delivery'
                />
              ]}
            />
          )}
      </Grid>
    </Grid>
  )
}
