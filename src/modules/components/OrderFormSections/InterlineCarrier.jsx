import React from 'react'
import {
  Grid,
  FormControl,
  Switch,
  FormHelperText,
  Typography
} from '@mui/material'
import { InterlineCarrierForm, TabInterlineForm } from './InterlineCarrierForm'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import { Controller, useWatch } from 'react-hook-form'
import {useTheme} from '@mui/material/styles'

function InterlineCarrier (props) {
  const { setValue, register, control } = props

  const isPickup = useWatch({
    control: control,
    name: 'interline_carrier.isPickup',
    defaultValue: false
  })

  const isDelivery = useWatch({
    control: control,
    name: 'interline_carrier.isDelivery',
    defaultValue: false
  })

  const isSameCarrierForBoth = useWatch({
    control: control,
    name: 'interline_carrier.isSameCarrier',
    defaultValue: false
  })

  const theme = useTheme()

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Controller
                name='interline_carrier.isPickup'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      if (!checked) {
                        setValue('interline_carrier.isSameCarrier', false)
                        setValue('interline_carrier.pickup', {})
                      }
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
                name='interline_carrier.isDelivery'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      if (!checked) {
                        setValue('interline_carrier.isSameCarrier', false)
                        setValue('interline_carrier.delivery', {})
                      }
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
          <FormControl>
            <CustomFormControlLabel
              control={
                <Controller
                  name='interline_carrier.isSameCarrier'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value || false}
                      onChange={e => {
                        const checked = e.target.checked
                        field.onChange(checked)
                        setValue('interline_carrier.delivery', {})
                        setValue('interline_carrier.pickup', {})
                        if (!checked)
                          setValue('interline_carrier.sameCarrier', {})
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
        )}
      </Grid>
      <Grid size={12}>
        {!isPickup && !isDelivery && (
          <Grid container>
            <Grid size={12}>
              <Typography
                component={'p'}
                sx={{ fontSize: 14, fontWeight: 600, py: 1 }}
                gutterBottom
              >
                Interline Information
              </Typography>
              <Typography component='p' sx={{ fontSize: 13, fontWeight: theme.typography.fontWeightLight }} gutterBottom>
                Enable pickup and/or delivery toggles above to configure
                interline carrier details.
              </Typography>
            </Grid>
          </Grid>
        )}
        {isPickup && !isDelivery && !isSameCarrierForBoth && (
          <InterlineCarrierForm
            register={register}
            setValue={setValue}
            control={control}
            interline_type='pickup'
          />
        )}
        {!isPickup && isDelivery && !isSameCarrierForBoth && (
          <InterlineCarrierForm
            register={register}
            setValue={setValue}
            control={control}
            interline_type='delivery'
          />
        )}
        {isPickup && isDelivery && isSameCarrierForBoth && (
          <InterlineCarrierForm
            register={register}
            setValue={setValue}
            control={control}
            interline_type='sameCarrier'
          />
        )}
        {isPickup && isDelivery && !isSameCarrierForBoth && (
          <TabInterlineForm
            labels={['Pickup Carrier', 'Delivery Carrier']}
            contents={[
              <InterlineCarrierForm
                register={register}
                setValue={setValue}
                control={control}
                label='Pickup'
                interline_type='pickup'
              />,
              <InterlineCarrierForm
                register={register}
                setValue={setValue}
                control={control}
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
