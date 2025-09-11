import React from 'react'
import { Grid, FormControl, Switch, FormHelperText } from '@mui/material'
import { InterlineCarrierForm, TabInterlineForm } from './InterlineCarrierForm'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import { Controller, useWatch } from 'react-hook-form'

function InterlineCarrier (props) {
  const { watch, register, control } = props

  const isPickup = useWatch({
    control: control,
    name: 'interline_carrier.pickup',
    defaultValue: false
  })

  const isDelivery = useWatch({
    control: control,
    name: 'interline_carrier.delivery',
    defaultValue: false
  })

  const isSameCarrierForBoth = useWatch({
    control: control,
    name: 'interline_carrier.same_carrier_for_both',
    defaultValue: false
  })

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Controller
                name='interline_carrier.pickup'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                    }}
                  />
                )}
              />
            }
            label='Pickup'
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Controller
                name='interline_carrier.delivery'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                    }}
                  />
                )}
              />
            }
            label='Delivery'
          />
        </FormControl>
      </Grid>
      <Grid size={12}>
        {isPickup && isDelivery && (
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <FormControl>
              <CustomFormControlLabel
                control={
                  <Controller
                    name='interline_carrier.same_carrier_for_both'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value || false}
                        onChange={e => {
                          const checked = e.target.checked
                          field.onChange(checked)
                        }}
                      />
                    )}
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
        {isPickup && !isDelivery && !isSameCarrierForBoth && (
          <InterlineCarrierForm register={register} interline_type='pickup' />
        )}
        {!isPickup && isDelivery && !isSameCarrierForBoth && (
          <InterlineCarrierForm register={register} interline_type='delivery' />
        )}
        {isPickup && isDelivery && isSameCarrierForBoth && (
          <InterlineCarrierForm register={register} />
        )}
        {isPickup && isDelivery && !isSameCarrierForBoth && (
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

export default React.memo(InterlineCarrier)
