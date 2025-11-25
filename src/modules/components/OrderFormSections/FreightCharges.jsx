import React from 'react'
import {
  Grid,
  FormControl,
  Switch,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  AccordionComponent,
  TextInput,
  CustomFormControlLabel,
  OrderEngine
} from '../../components'
import { useFieldArray, useWatch, Controller, useFormContext } from 'react-hook-form'
import { Add, AttachMoney, Delete } from '@mui/icons-material'
import global from '../../global'
import { unstable_batchedUpdates } from 'react-dom'
import { useRateSheetsByCustomerAndCities } from '../../hooks/useRateSheets'

const ServiceChargeRow = React.memo(function ServiceChargeRow({
  index,
  control,
  getValues,
  removeServiceCharge,
  engine,
  calculationRef,
  id
}) {

  const chargeName = useWatch({
    control,
    name: `additional_service_charges.${index}.charge_name`
  })

  const isDisabled = !chargeName?.trim()

  return (
    <Grid size={12} key={id}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 5 }}>
          <Controller
            name={`additional_service_charges.${index}.charge_name`}
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                size='small'
                label='Charge Name'
                variant='outlined'
                value={field.value || ''}
                onChange={(e) => {
                  const value = e.target.value
                  field.onChange(value)
                }}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3, md: 2 }}>
          <Controller
            name={`additional_service_charges.${index}.charge_quantity`}
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                size='small'
                label='Quantity'
                variant='outlined'
                type='number'
                fullWidth
                disabled={isDisabled}
                value={field.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  field.onChange(Number(value))
                  engine.otherAccessorialsCharges = getValues('additional_service_charges')
                  calculationRef.current?.recalculate()
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 8, md: 4 }}>
          <Controller
            name={`additional_service_charges.${index}.charge_amount`}
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                size='small'
                label='Amount'
                variant='outlined'
                type='number'
                inputProps={{ step: 'any' }}
                fullWidth
                disabled={isDisabled}
                value={field.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  field.onChange(Number(value))
                  engine.otherAccessorialsCharges = getValues('additional_service_charges')
                  calculationRef.current?.recalculate()
                }}
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
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 2, md: 1 }}>
          <IconButton
            color='error'
            onClick={() => {
              removeServiceCharge(index)
              engine.otherAccessorialsCharges = getValues('additional_service_charges')
              calculationRef.current?.recalculate()
            }}
          >
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  )
})


function FreightCharges(props) {

  const { engine } = props

  const {
    control,
    setValue,
    getValues,
  } = useFormContext()

  const { formatAccessorial } = global.methods
  const theme = useTheme()

  const [charges, setCharges] = React.useState({
    no_charges: getValues('no_charges'),
    manual_charges: getValues('manual_charges'),
    manual_fuel_surcharges: getValues('manual_fuel_surcharges')
  })
  const serviceType = useWatch({ control, name: 'service_type' })
  const [fetchRateSheet, setFetchRateSheet] = React.useState({
    customer_id: getValues('customer_id'),
    shipper_city: getValues('shipper_city'),
    receiver_city: getValues('receiver_city')
  })

  const { fields: customerAccessorials, replace: replaceCustomerAccessorials, update: updateCustomerAccessorials } = useFieldArray({ control, name: 'customer_accessorials' })
  const { fields: customerVehicleTypes, replace: replaceCustomerVehicleTypes, update: updateCustomerVehicleTypes } = useFieldArray({ control, name: 'customer_vehicle_types' })

  const {
    fields: additionalServiceCharges,
    append: appendServiceCharge,
    remove: removeServiceCharge
  } = useFieldArray({
    control,
    name: 'additional_service_charges'
  })

  const handleChange = (checked, access, index) => {
    requestAnimationFrame(() => {
      setValue(`customer_accessorials.${index}.is_included`, checked);
      if (checked) {
        const pdtimes = getValues(['pickup_in', 'pickup_out', 'delivery_in', 'delivery_out'])
        const waiting_time = getValues(['shipper_no_waiting_time', 'receiver_no_waiting_time'])
        const amount = OrderEngine.accessorials_types(access.type, access, getValues('freight_rate'), 1, pdtimes, waiting_time)
        setValue(`customer_accessorials.${index}.charge_quantity`, 1);
        setValue(`customer_accessorials.${index}.charge_amount`, (Math.round(amount * 100) / 100))
      }
      else {
        setValue(`customer_accessorials.${index}.charge_quantity`, 0);
        setValue(`customer_accessorials.${index}.charge_amount`, 0)
      }
      engine.accessorialsCharge = getValues('customer_accessorials')
      props.calculationRef.current?.recalculate()
    })
  }

  const triggerCalculateAccessorials = () => {
    const accessorials = getValues('customer_accessorials')
    const filterAccessorials = accessorials.reduce((result, acc, index) => {
      if (acc.is_included && ['fuel_based', 'transport_based'].includes(acc.type)) {
        result.push({ ...acc, idx: index })
      }
      return result
    }, [])
    if (filterAccessorials.length === 0) return
    for (let access of filterAccessorials) {
      const idx = access.idx
      const qty = access.charge_quantity
      const pdtimes = getValues(['pickup_in', 'pickup_out', 'delivery_in', 'delivery_out'])
      const waiting_time = getValues(['shipper_no_waiting_time', 'receiver_no_waiting_time'])
      const amount = OrderEngine.accessorials_types(access.type, access, getValues('freight_rate'), qty, pdtimes, waiting_time)
      unstable_batchedUpdates(() => {
        setValue(`customer_accessorials.${idx}.charge_quantity`, qty);
        setValue(`customer_accessorials.${idx}.charge_amount`, (Math.round(amount * 100) / 100))
        props.calculationRef.current?.recalculate()
      })
    }
  }

  const handleChangeNoCharge = (checked) => {
    unstable_batchedUpdates(() => {
      setValue('no_charges', checked)
      setCharges((prev) => ({ ...prev, no_charges: checked }))
      engine.isNoCharge = checked
    })
  }

  React.useImperativeHandle(props.accessorialRef, () => ({
    change: handleChange,
    recalculateAccessorials: triggerCalculateAccessorials,
    handleChangeNoCharge: handleChangeNoCharge
  }))

  React.useEffect(() => {
    let vehicleTypes = []
    if (engine.customer && fetchRateSheet.customer_id) {
      vehicleTypes = (engine.customer.vehicle_types || []).map(v => ({
        id: v.id,
        vehicle_id: v.vehicle_id,
        name: v.name,
        amount: v.rate,
        is_included: false,
      }))
    }
    replaceCustomerVehicleTypes(vehicleTypes)
  }, [engine.customer?.id, fetchRateSheet.customer_id, replaceCustomerVehicleTypes])

  React.useEffect(() => {
    let accessorials = []
    if (engine.customer && fetchRateSheet.customer_id) {
      const isCrossDock = getValues('is_crossdock')
      const isExtraStop = getValues('is_extra_stop')
      accessorials = (engine.customer.accessorials || []).map(a => isCrossDock && a.access_name?.trim().toLowerCase() === 'crossdock' ? ({
        ...a,
        charge_name: a.access_name,
        charge_amount: a.amount,
        charge_quantity: 1,
        is_included: true,
      }) : isExtraStop && a.access_name?.trim().toLowerCase() === 'extra stop' ?
        ({
          ...a,
          charge_name: a.access_name,
          charge_amount: a.amount,
          charge_quantity: 1,
          is_included: true,
        })
        :
        ({
          ...a,
          charge_name: a.access_name,
          charge_amount: 0,
          charge_quantity: 0,
          is_included: false,
        })
      )
    }
    replaceCustomerAccessorials(accessorials.sort((a,b) => a.charge_name && b.charge_name ? a.charge_name.localeCompare(b.charge_name) : null))
  }, [engine.customer?.id, fetchRateSheet.customer_id, replaceCustomerAccessorials])

  const {
    data: rateSheets,
    isLoading: rateSheetLoading,
    isFetching: rateSheetFetching
  } = useRateSheetsByCustomerAndCities(fetchRateSheet.customer_id, fetchRateSheet.shipper_city, fetchRateSheet.receiver_city)

  React.useEffect(() => {
    if (fetchRateSheet.customer_id && fetchRateSheet.shipper_city && fetchRateSheet.receiver_city && rateSheets?.length > 0) {
      engine.customerRateSheets = rateSheets
      props.calculationRef.current?.recalculate()
    }
  }, [rateSheets, fetchRateSheet])

  const handleLoadRateSheet = () => {
    const customer_id = getValues('customer_id')
    const shipper_city = getValues('shipper_city')
    const receiver_city = getValues('receiver_city')
    setFetchRateSheet((prev) => ({ ...prev, customer_id }))
    if (customer_id && shipper_city && receiver_city) {
      setFetchRateSheet({ customer_id, shipper_city: shipper_city.trim(), receiver_city: receiver_city.trim(), })
    }
    else {
      engine.customerRateSheets = []
      props.calculationRef.current?.recalculate()
    }
  }

  React.useImperativeHandle(props.rateSheetRef, () => ({
    loadRateSheet: handleLoadRateSheet
  }))

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
                    onChange={(e) => {
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
      {serviceType === 'Direct' &&
        <Grid size={12}>
          <Grid container sx={{ border: `1px solid ${theme.palette.grey[200]}`, borderRadius: 2 }}>
            <Grid size={12} sx={{ borderBottom: `1px solid ${theme.palette.grey[200]}`, py: 1, px: 2 }}>
              <Typography component={'p'} sx={{ fontSize: 16, fontWeight: 600 }}>
                Vehicle Types
              </Typography>
            </Grid>
            {customerVehicleTypes.length > 0 ? (
              <Grid size={12} sx={{ py: 2, px: 3 }}>
                <Grid container spacing={2} width={'100%'}>
                  <Grid size={12}>
                    <Controller
                      name='direct_km'
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          label='Direct KM'
                          variant='outlined'
                          fullWidth
                          type='number'
                          inputProps={{ step: 'any' }}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(Number(value))
                            engine.directKM = Number(value)
                            props.calculationRef.current?.recalculate()
                          }}
                        />
                      )}
                    />
                  </Grid>
                  {customerVehicleTypes.map((vtype, index) => (
                    <Grid
                      container
                      spacing={2}
                      key={`${vtype.name}-${index}`}
                      sx={{
                        border: `1px solid ${theme.palette.grey[200]}`,
                        py: 1,
                        px: 2,
                        borderRadius: 3
                      }}
                      justifyContent={'center'}
                      alignItems={'center'}
                      width={'100%'}
                    >
                      <Grid size={{ xs: 12, sm: 6, md: 7 }}>
                        <Typography variant='caption' sx={{ fontSize: 12, fontWeight: 400 }}                        >
                          {vtype.name}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <FormControl>
                          <CustomFormControlLabel
                            control={
                              <Controller
                                name={`customer_vehicle_types.${index}.is_included`}
                                control={control}
                                render={({ field }) => (
                                  <Switch
                                    {...field}
                                    checked={field.value || false}
                                    onChange={e => {
                                      const checked = e.target.checked
                                      field.onChange(checked)
                                      engine.customer_vehicle_types = getValues('customer_vehicle_types')
                                      props.calculationRef.current?.recalculate()
                                    }}
                                  />
                                )}
                              />
                            }
                            label=''
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Controller
                          name={`customer_vehicle_types.${index}.amount`}
                          control={control}
                          render={({ field }) => (
                            <TextInput
                              {...field}
                              label="Amount"
                              variant="outlined"
                              fullWidth
                              type="number"
                              inputProps={{ step: 'any' }}
                              value={field.value || ''}
                              size="small"
                              disabled
                              sx={{
                                '& .MuiInputBase-input.Mui-disabled': {
                                  color: 'black',
                                  fontWeight: 600,
                                  WebkitTextFillColor: 'black',
                                },
                              }}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment position="end">
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
                  ))}
                </Grid>
              </Grid>
            ) : (
              <Grid size={12} sx={{ py: 4, px: 3 }}>
                <Typography variant='body2' color='textSecondary' textAlign='center'>
                  {fetchRateSheet.customer_id ? 'No Vehicle Types available for this customer' : 'Select a customer to view vehicle types'}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      }
      {/* {!charges.no_charges || customerAccessorials.find(ca => ca.is_included && ca.type === 'fuel_based') ? ( */}
      <Grid size={12}>
        <Grid
          container
          sx={{
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 3
          }}
        >
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
                      // value={field.value || ''}
                      // onChange={e => {
                      //   const value = e.target.value
                      //   field.onChange(value)
                      //   engine.override_freight_rate = Number(value)
                      //   props.calculationRef?.current?.recalculate()
                      // }}
                      onFocus={(e) => {
                        const value = e.target.value
                        if (Number(value) === 0 || value === '' || value === '0') {
                          field.onChange('')
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value
                        if (field.value === 0 && value === '') {
                          field.onChange('')
                          return
                        }
                        field.onChange(value)
                        engine.override_freight_rate = Number(value)
                        props.calculationRef?.current?.recalculate()
                      }}
                      onBlur={(e) => {
                        const value = e.target.value
                        if (value === '') field.onChange(0)
                      }}
                      slotProps={{
                        input: {
                          endAdornment:
                            !rateSheetLoading && !rateSheetFetching ? (
                              <InputAdornment position='start'>
                                <AttachMoney />
                              </InputAdornment>
                            ) :
                              (
                                <InputAdornment position="end">
                                  <CircularProgress size={20} />
                                </InputAdornment>
                              )

                        }
                      }}
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          color: 'black',
                          fontWeight: 600,
                          WebkitTextFillColor: 'black',
                        },
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
                      // value={field.value || ''}
                      // onChange={e => {
                      //   const value = e.target.value
                      //   field.onChange(value)
                      //   engine.override_fuel_surcharge = Number(value)
                      //   props.calculationRef?.current?.recalculate()
                      // }}
                      onFocus={(e) => {
                        const value = e.target.value
                        if (Number(value) === 0 || value === '' || value === '0') {
                          field.onChange('')
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value
                        if (field.value === 0 && value === '') {
                          field.onChange('')
                          return
                        }
                        field.onChange(value)
                        engine.override_fuel_surcharge = Number(value)
                        props.calculationRef?.current?.recalculate()
                      }}
                      onBlur={(e) => {
                        const value = e.target.value
                        if (value === '') field.onChange(0)
                      }}
                      disabled={!charges.manual_fuel_surcharges}
                      slotProps={{
                        input: {
                          endAdornment:
                            !rateSheetLoading && !rateSheetFetching ? (
                              <InputAdornment position='start'>
                                <AttachMoney />
                              </InputAdornment>
                            ) :
                              (
                                <InputAdornment position="end">
                                  <CircularProgress size={20} />
                                </InputAdornment>
                              )
                        }
                      }}
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          color: 'black',
                          fontWeight: 600,
                          WebkitTextFillColor: 'black',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* ) : null} */}
      <Grid size={12}>
        <Grid
          container
          sx={{
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 2
          }}
        >
          <Grid size={12} sx={{ borderBottom: `1px solid ${theme.palette.grey[200]}`, py: 1, px: 2 }}          >
            <Typography component={'p'} sx={{ fontSize: 16, fontWeight: 600 }}>
              Customer Accessorial Charges
            </Typography>
            <Typography variant='caption' color='textSecondary' fontSize={14}>
              Customer-specific accessorial charges and fees
            </Typography>
          </Grid>
          {customerAccessorials.length > 0 ? (
            <Grid size={12} sx={{ py: 2, px: 3 }}>
              <Grid container spacing={2}>
                {customerAccessorials.map((access, index) => (
                  <Grid container spacing={2} key={`${fetchRateSheet.customer_id}-${index}`} sx={{ border: `1px solid ${theme.palette.grey[200]}`, py: 1.5, px: 2, borderRadius: 3 }} justifyContent={'center'} alignItems={'center'} width={'100%'}>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                      <Typography variant='caption' sx={{ fontSize: 12, fontWeight: 400 }}>
                        {formatAccessorial(access.charge_name, access.amount, access.amount_type)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                      <FormControl>
                        <CustomFormControlLabel
                          control={
                            <Controller
                              name={`customer_accessorials.${index}.is_included`}
                              control={control}
                              render={({ field }) => {
                                return (
                                  <Switch
                                    {...field}
                                    checked={field.value || false}
                                    onChange={e => {
                                      const checked = e.target.checked
                                      handleChange(checked, access, index)
                                    }}
                                  />
                                )
                              }}
                            />
                          }
                          label=''
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }} pl={2}>
                      <Controller
                        name={`customer_accessorials.${index}.charge_quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextInput
                            {...field}
                            label='Qty'
                            variant='outlined'
                            fullWidth
                            disabled={!getValues(`customer_accessorials.${index}.is_included`)}
                            type='number'
                            inputProps={{ step: 'any' }}
                            value={field.value || ''}
                            onChange={e => {
                              const value = e.target.value
                              if (Number(value) >= 0) {
                                if (Number(value) === 0) {
                                  setValue(`customer_accessorials.${index}.is_included`, false);
                                }
                                const pdtimes = getValues(['pickup_in', 'pickup_out', 'delivery_in', 'delivery_out'])
                                const waiting_time = getValues(['shipper_no_waiting_time', 'receiver_no_waiting_time'])
                                const amount = OrderEngine.accessorials_types(access.type, access, getValues('freight_rate'), Number(value), pdtimes, waiting_time)
                                setValue(`customer_accessorials.${index}.charge_quantity`, Number(value));
                                setValue(`customer_accessorials.${index}.charge_amount`, (Math.round(amount * 100) / 100))
                                engine.accessorialsCharge = getValues('customer_accessorials')
                                props.calculationRef.current?.recalculate()
                              }
                            }}
                            size='small'
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Controller
                        name={`customer_accessorials.${index}.charge_amount`}
                        control={control}
                        render={({ field }) => (
                          <TextInput
                            {...field}
                            label='Amount'
                            variant='outlined'
                            fullWidth
                            disabled
                            size='small'
                            sx={{
                              '& .MuiInputBase-input.Mui-disabled': {
                                color: 'black',
                                fontWeight: 600,
                                WebkitTextFillColor: 'black',
                              },
                            }}
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
                        )}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ) : (
            <Grid size={12} sx={{ py: 4, px: 3 }}>
              <Typography variant='body2' color='textSecondary' textAlign='center'>
                {fetchRateSheet.customer_id ? 'No accessorials available for this customer' : 'Select a customer to view accessorials'}
              </Typography>
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
                    <ServiceChargeRow
                      key={serviceCharge.id}
                      id={serviceCharge.id}
                      index={index}
                      control={control}
                      getValues={getValues}
                      setValue={setValue}
                      removeServiceCharge={removeServiceCharge}
                      engine={engine}
                      calculationRef={props.calculationRef}
                    />
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
          <Grid size={12} sx={{ py: 2, px: 3 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Controller
                  name='sub_total'
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      disabled
                      label='Sub Total'
                      fullWidth
                      variant='outlined'
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
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          color: 'black',
                          fontWeight: 600,
                          WebkitTextFillColor: 'black',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Controller
                  name='provincial_tax'
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      disabled
                      label='Provincial Tax'
                      fullWidth
                      variant='outlined'
                      value={field.value || 0}
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
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          color: 'black',
                          fontWeight: 600,
                          WebkitTextFillColor: 'black',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Controller
                  name='federal_tax'
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      disabled
                      label='Federal Tax'
                      fullWidth
                      variant='outlined'
                      value={field.value || 0}
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
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          color: 'black',
                          fontWeight: 600,
                          WebkitTextFillColor: 'black',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Controller
                  name='grand_total'
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      disabled
                      label='Grand Total'
                      fullWidth
                      variant='outlined'
                      size='large'
                      value={field.value || 0}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment sx={{ '& p': { fontSize: 13 } }}>
                              $
                            </InputAdornment>
                          )
                        }
                      }}
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          color: 'black',
                          fontWeight: 600,
                          WebkitTextFillColor: 'black',
                        },
                      }}
                    />
                  )}
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