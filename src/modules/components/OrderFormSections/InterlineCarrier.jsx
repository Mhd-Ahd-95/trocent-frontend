import React from 'react'
import {
  Grid,
  FormControl,
  Switch,
  FormHelperText,
  Typography,
  useTheme
} from '@mui/material'
import { InterlineCarrierForm, TabInterlineForm } from './InterlineCarrierForm'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import { Controller, useWatch } from 'react-hook-form'
import { useInterliners } from '../../hooks/useInterliners'

function InterlineCarrier(props) {
  const { setValue, control } = props

  const isPickup = useWatch({
    control: control,
    name: 'is_pickup',
  })

  const isDelivery = useWatch({
    control: control,
    name: 'is_delivery',
  })

  const isSameCarrierForBoth = useWatch({
    control: control,
    name: 'is_same_carrier',
  })

  const shouldFetchInterliners = isPickup || isDelivery || isSameCarrierForBoth
  const { data, isLoading, isError, error } = useInterliners(shouldFetchInterliners)

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      const errorMessage = message ? `${message} - ${status}` : error.message;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [isError, error])

  const theme = useTheme()

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Controller
                name='is_same_carrier'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      if (checked) {
                        setValue('is_pickup', true)
                        setValue('is_delivery', true)
                        setValue('interliner_delivery_id', '')
                        setValue('interliner_delivery_special_instructions', '')
                        setValue('interliner_delivery_charge_amount', '')
                        setValue('interliner_delivery_invoice', '')
                        setValue('interliner_pickup_id', '')
                        setValue('interliner_pickup_special_instructions', '')
                        setValue('interliner_pickup_charge_amount', '')
                        setValue('interliner_pickup_invoice', '')
                      }
                      if (!checked) {
                        setValue('interliner_id', '')
                        setValue('interliner_special_instructions', '')
                        setValue('interliner_charge_amount', '')
                        setValue('interliner_invoice', '')
                      }
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
      {(isSameCarrierForBoth || isPickup || isDelivery) &&
        <>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <FormControl>
              <CustomFormControlLabel
                control={
                  <Controller
                    name='is_pickup'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value || false}
                        onChange={e => {
                          const checked = e.target.checked
                          field.onChange(checked)
                          if (!checked) {
                            setValue('is_same_carrier', false)
                            setValue('interliner_pickup_id', '')
                            setValue('interliner_pickup_special_instructions', '')
                            setValue('interliner_pickup_charge_amount', '')
                            setValue('interliner_pickup_invoice', '')
                            setValue('interliner_id', '')
                            setValue('interliner_special_instructions', '')
                            setValue('interliner_charge_amount', '')
                            setValue('interliner_invoice', '')
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
                    name='is_delivery'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value || false}
                        onChange={e => {
                          const checked = e.target.checked
                          field.onChange(checked)
                          if (!checked) {
                            setValue('is_same_carrier', false)
                            setValue('interliner_delivery_id', '')
                            setValue('interliner_delivery_special_instructions', '')
                            setValue('interliner_delivery_charge_amount', '')
                            setValue('interliner_delivery_invoice', '')
                            setValue('interliner_id', '')
                            setValue('interliner_special_instructions', '')
                            setValue('interliner_charge_amount', '')
                            setValue('interliner_invoice', '')
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
        </>}
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
            data={data}
            loading={isLoading}
            control={control}
            interline_type='pickup'
          />
        )}
        {!isPickup && isDelivery && !isSameCarrierForBoth && (
          <InterlineCarrierForm
            control={control}
            data={data}
            loading={isLoading}
            interline_type='delivery'
          />
        )}
        {isPickup && isDelivery && isSameCarrierForBoth && (
          <InterlineCarrierForm
            data={data}
            loading={isLoading}
            control={control}
          />
        )}
        {isPickup && isDelivery && !isSameCarrierForBoth && (
          <TabInterlineForm
            labels={['Pickup Carrier', 'Delivery Carrier']}
            contents={[
              <InterlineCarrierForm
                data={data}
                loading={isLoading}
                control={control}
                label='Pickup'
                interline_type='pickup'
              />,
              <InterlineCarrierForm
                data={data}
                loading={isLoading}
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
