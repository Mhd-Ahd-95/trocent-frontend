import React from 'react'
import {
  Grid,
  FormControl,
  Switch,
  Typography,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  AccordionComponent,
  TextInput,
  CustomFormControlLabel
} from '../../components'
import { useFieldArray } from 'react-hook-form'
import { Add, AttachMoney, Delete } from '@mui/icons-material'
import global from '../../global'
import { Controller } from 'react-hook-form'

function FreightCharges(props) {
  const { register, engine, control, getValues } = props
  const { formatAccessorial } = global.methods
  const theme = useTheme()

  const [charges, setCharges] = React.useState({ no_charges: getValues('no_charges'), manual_charges: getValues('manual_charges'), manual_fuel_surcharges: getValues('manual_fuel_surcharges') })

  const customerAccessorials = React.useMemo(() => getValues('customer_accessorials') || [], [engine.customer, getValues('customer_accessorials')])

  const {
    fields: additionalServiceCharges,
    append: appendServiceCharge,
    remove: removeServiceCharge
  } = useFieldArray({
    control,
    name: 'additional_service_charges'
  })

  // const loadAccessorials = React.useCallback(() => {
  //   const accessorials = engine.customer['accessorials']
  // }, [engine.customer])

  // React.useImperativeHandle(props.customerRef, () => ({
  //   accessorials: loadAccessorials 
  // }))

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Controller
                name='no_charges'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      setCharges((prev) => ({ ...prev, no_charges: checked }))
                      engine.isNoCharge = checked
                      props.calculationRef?.current?.recalculate()
                    }}
                  />
                )}
              />
            }
            label='No Charges'
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Controller
                name='manual_charges'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      setCharges((prev) => ({ ...prev, manual_charges: checked }))
                      engine.isManualFreightRate = checked
                      if (!checked) {
                        engine.override_freight_rate = 0
                        props.calculationRef?.current?.recalculate()
                      }
                    }}
                  />
                )}
              />
            }
            label='Manual Charges'
            sx={{
              whiteSpace: 'nowrap'
            }}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Controller
                name='manual_fuel_surcharges'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      engine.isManualFuelSurcharge = checked
                      if (!checked) {
                        engine.override_fuel_surcharge = 0
                        props.calculationRef?.current?.recalculate()
                      }
                      setCharges((prev) => ({ ...prev, manual_fuel_surcharges: checked }))
                    }}
                  />
                )}
              />
            }
            label='Manual Fuel Surcharges'
          />
        </FormControl>
      </Grid>
      {!charges.no_charges && (
        <Grid size={12}>
          <Grid
            container
            sx={{
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 3
            }}
          >
            {/* <Grid
              size={12}
              sx={{
                borderBottom: `1px solid ${theme.palette.grey[200]}`,
                py: 2,
                px: 3
              }}
            >
              <Typography
                component={'p'}
                sx={{ fontSize: 15, fontWeight: 600 }}
              >
                Freight & Charges
              </Typography>
            </Grid> */}
            <Grid size={12}>
              <Grid container spacing={2} px={3} py={2}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Controller
                    name={'freight_rate'}
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label='Freight Rate'
                        variant='outlined'
                        fullWidth
                        type='number'
                        inputProps={{ step: "any" }}
                        disabled={!charges.manual_charges}
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value
                          engine.override_freight_rate = Number(value)
                          props.calculationRef?.current?.recalculate()
                        }}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position='start'>
                                <AttachMoney />
                              </InputAdornment>
                            )
                          }
                        }}
                        sx={{
                          '& .Mui-disabled': {
                            color: '#000'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Controller
                    name='freight_fuel_surcharge'
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label='Fuel Surcharge'
                        variant='outlined'
                        fullWidth
                        type='number'
                        inputProps={{ step: "any" }}
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value
                          console.log(value);
                          engine.override_fuel_surcharge = Number(value)
                          props.calculationRef?.current?.recalculate()
                        }}
                        disabled={!charges.manual_fuel_surcharges}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position='start'>
                                <AttachMoney />
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid size={12}>
        <Grid
          container
          sx={{
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 2
          }}
        >
          <Grid
            size={12}
            sx={{
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
              py: 1,
              px: 2
            }}
          >
            <Typography component={'p'} sx={{ fontSize: 16, fontWeight: 600 }}>
              Customer Accessorial Charges
            </Typography>
            <Typography variant='caption' color='textSecondary' fontSize={14}>
              Customer-specific accessorial charges and fees
            </Typography>
          </Grid>
          {customerAccessorials.length > 0 && (
            <Grid size={12} sx={{ py: 2, px: 3 }}>
              <Grid container spacing={2}>
                {customerAccessorials.map((access, index) => (
                  <Grid
                    container
                    spacing={2}
                    key={index}
                    sx={{
                      border: `1px solid ${theme.palette.grey[200]}`,
                      py: 2,
                      px: 2,
                      borderRadius: 3
                    }}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                      <Typography
                        variant='caption'
                        sx={{ fontSize: 12, fontWeight: 400 }}
                      >
                        {formatAccessorial(
                          access.charge_name,
                          access.amount
                        )}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                      <FormControl>
                        <CustomFormControlLabel
                          control={
                            <Switch
                              {...register(
                                `customer_accessorials.${index}.is_included`
                              )}
                            />
                          }
                          label='Is included'
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }} pl={2}>
                      <TextInput
                        label='Qty'
                        variant='outlined'
                        fullWidth
                        size='small'
                        {...register(
                          `customer_accessorials.${index}.charge_quantity`
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <TextInput
                        label='Amount'
                        variant='outlined'
                        fullWidth
                        size='small'
                        {...register(
                          `customer_accessorials.${index}.charge_amount`
                        )}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position='end'>
                                <AttachMoney />
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
          <Grid size={12} sx={{ py: 2, px: 3 }}>
            <AccordionComponent
              defaultExpanded
              title='Additional Service Charges'
              subtitle='Add Custom charges not covered by standard accessorials'
              content={
                <Grid container spacing={2} justifyContent={'center'}>
                  {additionalServiceCharges.map((serviceCharge, index) => (
                    <Grid size={12} key={serviceCharge.id}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12, md: 5 }}>
                          <TextInput
                            size='small'
                            label='Charge Name'
                            variant='outlined'
                            fullWidth
                            {...register(
                              `additional_service_charges.${index}.charge_name`
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3, md: 2 }}>
                          <TextInput
                            size='small'
                            label='Quantity'
                            variant='outlined'
                            type='number'
                            fullWidth
                            {...register(
                              `additional_service_charges.${index}.charge_quantity`
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8, md: 4 }}>
                          <TextInput
                            size='small'
                            label='Amount'
                            variant='outlined'
                            type='number'
                            fullWidth
                            {...register(
                              `additional_service_charges.${index}.charge_amount`
                            )}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <AttachMoney />
                                  </InputAdornment>
                                )
                              }
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2, md: 1 }}>
                          <IconButton
                            color='error'
                            onClick={() => removeServiceCharge(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid size='auto'>
                    <Button
                      variant='text'
                      color='primary'
                      startIcon={<Add />}
                      sx={{
                        textTransform: 'capitalize',
                        fontWeight: 600
                      }}
                      onClick={() =>
                        appendServiceCharge({
                          charge_name: '',
                          charge_quantity: 1,
                          charge_amount: ''
                        })
                      }
                    >
                      Add Service Charge
                    </Button>
                  </Grid>
                </Grid>
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid
          container
          sx={{
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 2
          }}
        >
          {/* <Grid
            size={12}
            sx={{
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
              p: 2
            }}
          >
            <Typography component={'p'} sx={{ fontSize: 16, fontWeight: 600 }}>
              Order Summary
            </Typography>
          </Grid> */}
          <Grid size={12} sx={{ py: 2, px: 3 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput
                  label='Sub Total'
                  fullWidth
                  variant='outlined'
                  {...register(
                    'sub_total'
                  )}
                  size='large'
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment sx={{ '& p': { fontSize: 13 } }}>
                          $
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput
                  label='Provincial Tax'
                  fullWidth
                  variant='outlined'
                  {...register(
                    'provincial_tax'
                  )}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment sx={{ '& p': { fontSize: 12 } }}>
                          $
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput
                  label='Federal Tax'
                  fullWidth
                  variant='outlined'
                  {...register(
                    'federal_tax'
                  )}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment sx={{ '& p': { fontSize: 12 } }}>
                          $
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput
                  label='Grand Tax'
                  fullWidth
                  variant='outlined'
                  {...register(
                    'grand_tax'
                  )}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment sx={{ '& p': { fontSize: 12 } }}>
                          $
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default React.memo(FreightCharges)
