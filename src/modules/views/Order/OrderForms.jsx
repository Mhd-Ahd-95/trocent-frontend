import React from 'react'
import {
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  Switch,
  FormHelperText,
  Typography,
  Button,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import {
  AccordionComponent,
  StyledButton,
  SubmitButton,
  WizardCard
} from '../../components'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { InterlineCarrierForm, TabInterlineForm } from './InterlineCarrier'
import { Add, AttachMoney, Calculate, Delete, Sync } from '@mui/icons-material'
import {
  defaultOrderValue,
  TextInput,
  CustomFormControlLabel,
  customerData
} from './DefaultOrder'
import global from '../../global'

export default function OrderForm (props) {
  const { formatNumber, formatAccessorial } = global.methods
  const theme = useTheme()
  const { initialValues } = props
  const [converted, setConverted] = React.useState(false)
  const [mode, setMode] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      ...defaultOrderValue,
      ...initialValues
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'freight_details.freights'
  })

  const {
    fields: additionalServiceCharges,
    append: appendServiceCharge,
    remove: removeServiceCharge
  } = useFieldArray({
    control,
    name: 'freight_charges.additional_service_charges'
  })

  const onSubmit = data => {
    console.log('Form Data:', data) // <-- Print data to console
  }

  return (
    <Grid
      container
      component={'form'}
      spacing={3}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Basic Information' minHeight={500}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Username*'
                variant='outlined'
                fullWidth
                {...register('basic_info.username', {
                  required: 'Username is required'
                })}
                error={!!errors?.basic_info?.username}
                helperText={errors.basic_info?.username?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Order Number'
                variant='outlined'
                fullWidth
                {...register('basic_info.order_number')}
                error={!!errors?.basic_info?.order_number}
                helperText={errors.basic_info?.order_number?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='basic_info.create_date'
                control={control}
                rules={{ required: 'Create Date is required' }}
                render={({ field }) => (
                  <DatePicker
                    label='Create Date*'
                    views={['year', 'month', 'day']}
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors?.basic_info?.create_date,
                        helperText: errors?.basic_info?.create_date?.message,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='basic_info.terminal'
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    {...field}
                    options={['TREM MTL', 'TREM OTT', 'TREM TOR']}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <TextInput {...params} label='Terminal' fullWidth />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <FormControl>
                <CustomFormControlLabel
                  control={<Switch {...register('basic_info.quote')} />}
                  label='Quote'
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <FormControl>
                <CustomFormControlLabel
                  control={<Switch {...register('basic_info.is_crossdock')} />}
                  label='Is Crossdock'
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='basic_info.order_entity'
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    {...field}
                    options={['Order Entity', 'Order Billing']}
                    getOptionLabel={option => option}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <TextInput
                        {...params}
                        variant='outlined'
                        fullWidth
                        label='Order Type'
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='basic_info.order_status'
                control={control}
                rules={{ required: 'Order Status is required' }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    {...field}
                    options={[
                      'Pending',
                      'Billing',
                      'Quote',
                      'Entered',
                      'Dispatched',
                      'On Dock',
                      'Arrrived Shipper',
                      'Picked Up',
                      'Arrived Receiver',
                      'Delivered',
                      'Approved',
                      'Billed',
                      'Canceled'
                    ]}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <TextInput
                        {...params}
                        label='Order Status*'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextField
                label='Internal Note'
                variant='outlined'
                {...register('basic_info.internal_note')}
                multiline
                minRows={4}
                maxRows={4}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '13px'
                  }
                }}
              />
            </Grid>
          </Grid>
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Client Information' minHeight={500}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Controller
                name='client_info.customer'
                control={control}
                rules={{ required: 'Customer is a required field' }}
                render={({ field, fieldstate }) => {
                  return (
                    <Autocomplete
                      {...field}
                      options={customerData}
                      onChange={(_, value) => {
                        field.onChange(value)
                        setValue('client_info.name', value?.name || '')
                        setValue('client_info.email', value?.email || '')
                        setValue('client_info.address', value?.address || '')
                        setValue('client_info.suite', value?.suite || '')
                        setValue('client_info.city', value?.city || '')
                        setValue('client_info.province', value?.province || '')
                        setValue(
                          'client_info.postal_code',
                          value?.postal_code || ''
                        )
                      }}
                      getOptionLabel={option =>
                        option
                          ? `${option.account_number} - ${option.name}`
                          : ''
                      }
                      // isOptionEqualToValue={(option, value) =>
                      //   option.id === value?.id
                      // }
                      renderInput={params => (
                        <TextInput
                          {...params}
                          label='Customer'
                          fullWidth
                          error={!!fieldstate?.error}
                          helperText={fieldstate?.error?.message}
                        />
                      )}
                    />
                  )
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='client_info.name'
                control={control}
                rules={{ required: 'Name is a required field' }}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label='Name*'
                    variant='outlined'
                    fullWidth
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='client_info.email'
                control={control}
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
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Controller
                name='client_info.address'
                control={control}
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
                name='client_info.suite'
                control={control}
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
                name='client_info.city'
                control={control}
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
                name='client_info.province'
                control={control}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label='Province/State'
                    variant='outlined'
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='client_info.postal_code'
                control={control}
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
          </Grid>
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='References' minHeight={500}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextInput
                label='Reference Number'
                variant='outlined'
                fullWidth
                {...register('references.reference_number')}
                helperText={
                  'Add multiple reference numbers (use Enter, comma, or space)'
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextInput
                label='Caller'
                variant='outlined'
                fullWidth
                {...register('references.caller')}
              />
            </Grid>
          </Grid>
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Shipper Details' minHeight={500}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Shipper*'
                variant='outlined'
                fullWidth
                {...register('shipper_details.shipper', {
                  required: 'Sipper is a required field'
                })}
                error={!!errors?.shipper_details?.shipper}
                helperText={errors?.shipper_details?.shipper?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Email'
                variant='outlined'
                fullWidth
                {...register('shipper.email')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Contact Name'
                variant='outlined'
                fullWidth
                {...register('shipper_details.contact_name')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Phone Number'
                variant='outlined'
                fullWidth
                {...register('shipper_details.phone_number')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextInput
                label='Address*'
                variant='outlined'
                fullWidth
                {...register('shipper_details.address', {
                  required: 'Address is a required field'
                })}
                error={!!errors?.shipper_details?.address}
                helperText={errors?.shipper_details?.address?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Suite'
                variant='outlined'
                fullWidth
                {...register('shipper_details.suite')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='City*'
                variant='outlined'
                fullWidth
                {...register('shipper_details.city', {
                  required: 'City is a required field'
                })}
                error={!!errors?.shipper_details?.city}
                helperText={errors?.shipper_details?.city?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Province/State*'
                variant='outlined'
                fullWidth
                {...register('shipper_details.province', {
                  required: 'Province is a required field'
                })}
                error={!!errors?.shipper_details?.province}
                helperText={errors?.shipper_details?.province?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Postal code*'
                variant='outlined'
                fullWidth
                {...register('shipper_details.postal_code', {
                  required: 'Postal Code is a required field'
                })}
                error={!!errors?.shipper_details?.postal_code}
                helperText={errors?.shipper_details?.postal_code?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextField
                label='Special Instructions'
                variant='outlined'
                {...register('shipper_details.special_instructions')}
                multiline
                minRows={4}
                maxRows={4}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '13px'
                  }
                }}
              />
            </Grid>
          </Grid>
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Extra Shop' minHeight={500}>
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
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Receiver Details' minHeight={500}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Receiver*'
                variant='outlined'
                fullWidth
                {...register('receiver_details.receiver', {
                  required: 'Receiver is a required field'
                })}
                error={!!errors?.receiver_details?.receiver}
                helperText={errors?.receiver_details?.receiver?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Email'
                variant='outlined'
                fullWidth
                {...register('receiver_details.email')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Contact Name'
                variant='outlined'
                fullWidth
                {...register('receiver_details.contact_name')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Phone Number'
                variant='outlined'
                fullWidth
                {...register('receiver_details.phone_number')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextInput
                label='Address*'
                variant='outlined'
                fullWidth
                {...register('receiver_details.address', {
                  required: 'Address is a required field'
                })}
                error={!!errors?.receiver_details?.address}
                helperText={errors?.receiver_details?.address?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Suite'
                variant='outlined'
                fullWidth
                {...register('receiver_details.suite')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='City*'
                variant='outlined'
                fullWidth
                {...register('receiver_details.city', {
                  required: 'City is a required field'
                })}
                error={!!errors?.receiver_details?.city}
                helperText={errors?.receiver_details?.city?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Province/State*'
                variant='outlined'
                fullWidth
                {...register('receiver_details.province', {
                  required: 'Province is a required field'
                })}
                error={!!errors?.receiver_details?.province}
                helperText={errors?.receiver_details?.province?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label='Postal code*'
                variant='outlined'
                fullWidth
                {...register('receiver_details.postal_code', {
                  required: 'Postal Code is a required field'
                })}
                error={!!errors?.receiver_details?.postal_code}
                helperText={errors?.receiver_details?.postal_code?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextField
                label='Special Instructions'
                variant='outlined'
                {...register('receiver_details.special_instructions')}
                multiline
                minRows={4}
                maxRows={4}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '13px'
                  }
                }}
              />
            </Grid>
          </Grid>
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Pickup Details' minHeight={500}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Controller
                name='pickup_details.pickup_date'
                control={control}
                rules={{ required: 'Pickup Date is required' }}
                render={({ field }) => (
                  <DatePicker
                    label='Pickup Date*'
                    views={['year', 'month', 'day']}
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors?.pickup_details?.pickup_date,
                        helperText:
                          errors?.pickup_details?.pickup_date?.message,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='pickup_details.time_from'
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label='Time From'
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors?.pickup_details?.time_from,
                        helperText: errors?.pickup_details?.time_from?.message,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='pickup_details.time_to'
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label='Time To'
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors?.pickup_details?.time_to,
                        helperText: errors?.pickup_details?.time_to?.message,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextInput
                label='Driver Assigned'
                variant='outlined'
                fullWidth
                {...register('pickup_details.driver_assigned')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Controller
                name='pickup_details.terminal'
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    {...field}
                    options={['TREM MTL', 'TREM OTT', 'TREM TOR']}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <TextInput {...params} label='Terminal' fullWidth />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <FormControl>
                <CustomFormControlLabel
                  control={
                    <Switch {...register('pickup_details.appointment')} />
                  }
                  label='Appointment'
                />
              </FormControl>
            </Grid>
          </Grid>
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Interline Carrier' minHeight={500}>
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
                  control={
                    <Switch {...register('interline_carrier.delivery')} />
                  }
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
                            {...register(
                              'interline_carrier.same_carrier_for_both'
                            )}
                          />
                        }
                        label='Same Carrier for Both'
                      />
                      <FormHelperText>
                        Uncheck to use different carriers for pickup and
                        delivery
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                )}
              {watch('interline_carrier.pickup') &&
                !watch('interline_carrier.delivery') &&
                !watch('interline_carrier.same_carrier_for_both') && (
                  <InterlineCarrierForm
                    register={register}
                    interline_type='pickup'
                  />
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
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Delivery Details' minHeight={500}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Controller
                name='delivery_details.delivery_date'
                control={control}
                rules={{ required: 'Delivery Date is required' }}
                render={({ field }) => (
                  <DatePicker
                    label='Delivery Date*'
                    views={['year', 'month', 'day']}
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors?.delivery_details?.delivery_date,
                        helperText:
                          errors?.delivery_details?.delivery_date?.message,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='delivery_details.time_from'
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label='Time From'
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.time_from,
                        helperText: errors.time_from?.message,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name='delivery_details.time_to'
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label='Time To'
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.time_to,
                        helperText: errors.time_to?.message,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextInput
                label='Driver Assigned'
                variant='outlined'
                fullWidth
                {...register('delivery_details.driver_assigned')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Controller
                name='delivery_details.terminal'
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    {...field}
                    options={['TREM MTL', 'TREM OTT', 'TREM TOR']}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <TextInput {...params} label='Terminal' fullWidth />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <FormControl>
                <CustomFormControlLabel
                  control={
                    <Switch {...register('delivery_details.appointment')} />
                  }
                  label='Appointment'
                />
              </FormControl>
            </Grid>
          </Grid>
        </WizardCard>
      </Grid>
      <Grid size={12}>
        <WizardCard minHeight={500} title='Freight Details'>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Controller
                name='freight_details.service_type'
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    {...field}
                    options={['Regular', 'Direct', 'Rush']}
                    onChange={(_, value) => field.onChange(value)}
                    defaultValue={'Regular'}
                    renderInput={params => (
                      <TextInput
                        {...params}
                        label='Service Type'
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Typography
                component='p'
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  paddingBlock: 2,
                  paddingLeft: 1
                }}
              >
                Freights
              </Typography>
              {fields.map((item, index) => (
                <AccordionComponent
                  fieldsLength={fields.length}
                  handleDelete={() => remove(index)}
                  key={item.id}
                  title={`${watch(
                    `freight_details.freights.${index}.type`
                  )}: ${watch(
                    `freight_details.freights.${index}.pieces`
                  )} pcs, ${watch(
                    `freight_details.freights.${index}.weight`
                  )} ${watch(
                    `freight_details.freights.${index}.unit`
                  )?.toLowerCase()}`}
                  content={
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Controller
                          name={`freight_details.freights.${index}.type`}
                          control={control}
                          rules={{ required: 'Type is a required field' }}
                          render={({ field, fieldState }) => (
                            <Autocomplete
                              {...field}
                              options={['Skid', 'Box', 'Envelope']}
                              onChange={(_, value) => field.onChange(value)}
                              defaultValue={'Skid'}
                              renderInput={params => (
                                <TextInput
                                  {...params}
                                  label='Type*'
                                  fullWidth
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <TextInput
                          label='Description'
                          variant='outlined'
                          fullWidth
                          {...register(
                            `freight_details.freights.${index}.description`
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextInput
                          label='Pieces'
                          variant='outlined'
                          type='number'
                          fullWidth
                          {...register(
                            `freight_details.freights.${index}.pieces`
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextInput
                          label='Weight'
                          variant='outlined'
                          type='number'
                          fullWidth
                          {...register(
                            `freight_details.freights.${index}.weight`
                          )}
                          helperText={'Vol: 0.00 lbs'}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextInput
                          select
                          label='Unit'
                          variant='outlined'
                          fullWidth
                          {...register(
                            `freight_details.freights.${index}.unit`
                          )}
                          defaultValue={'lbs'}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    onClick={() => setConverted(!converted)}
                                    color={converted ? 'success' : 'default'}
                                  >
                                    <Sync />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }
                          }}
                          helperText={converted ? 'Conv.: ON' : 'Conv.: OFF'}
                          sx={{
                            position: 'relative',
                            '& button': {
                              borderLeft: `1px solid ${theme.palette.grey[200]}`,
                              borderRadius: 0,
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              height: '100%',
                              // marginLeft: 2,
                              '& svg': {
                                fontSize: 18,
                                marginTop: 0.3
                              }
                            },
                            '& .MuiSelect-icon': {
                              position: 'absolute',
                              top: 14,
                              right: 35,
                              fontSize: 20
                              // marginRight: 4
                            }
                          }}
                        >
                          <MenuItem value='lbs'>LBS</MenuItem>
                          <MenuItem value='kg'>KG</MenuItem>
                        </TextInput>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextInput
                          label='Length'
                          variant='outlined'
                          fullWidth
                          {...register(
                            `freight_details.freights.${index}.length`
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextInput
                          label='Width'
                          variant='outlined'
                          fullWidth
                          {...register(
                            `freight_details.freights.${index}.width`
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextInput
                          label='Height'
                          variant='outlined'
                          fullWidth
                          {...register(
                            `freight_details.freights.${index}.height`
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextInput
                          select
                          label='Dim Unit'
                          variant='outlined'
                          fullWidth
                          {...register(
                            `freight_details.freights.${index}.dim_unit`
                          )}
                          defaultValue={'in'}
                        >
                          <MenuItem value='in'>IN</MenuItem>
                          <MenuItem value='cm'>CM</MenuItem>
                        </TextInput>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <FormControl>
                          <CustomFormControlLabel
                            control={
                              <Switch
                                {...register(
                                  `freight_details.freights.${index}.not_stack`
                                )}
                              />
                            }
                            label='Not Stack'
                            sx={{
                              '& span': { fontSize: 12, whiteSpace: 'nowrap' }
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  }
                  icons
                />
              ))}
            </Grid>
            <Grid size={12}>
              <Grid container justifyContent={'center'} alignItems={'center'}>
                <Grid size='auto'>
                  <Button
                    startIcon={<Add />}
                    sx={{ textTransform: 'capitalize' }}
                    onClick={() =>
                      append({
                        type: '',
                        description: '',
                        Pieces: 1,
                        weight: '',
                        units: '',
                        length: '',
                        width: '',
                        height: '',
                        dim_unit: '',
                        not_stack: false
                      })
                    }
                  >
                    Add To Freights
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={12} sx={{ mt: 3 }}>
            <Grid container>
              <Grid
                size={12}
                sx={{
                  py: 1,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  px: 3,
                  border: `1px solid ${theme.palette.grey[200]}`
                }}
              >
                <Grid
                  container
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Grid size={{ xs: 12, sm: 'auto', md: 'auto' }}>
                    <Typography
                      component={'p'}
                      sx={{ fontSize: 15, fontWeight: 600 }}
                    >
                      Freight Calculations
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 'auto', md: 'auto' }}>
                    <StyledButton
                      color='primary'
                      variant='contained'
                      startIcon={<Calculate />}
                      size='small'
                      textTransform='capitalize'
                      onClick={() => setMode(!mode)}
                    >
                      Manually Mode: {mode ? 'ON' : 'OFF'}
                    </StyledButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                size={12}
                sx={{
                  py: 4,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  px: 3,
                  border: `1px solid ${theme.palette.grey[200]}`,
                  borderTop: 0
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <TextInput
                      label='Total Pieces'
                      value={watch('freight_details.freights')
                        .map(freight => freight.pieces)
                        .reduce((acc, pcs) => (acc += Number(pcs)), 0)}
                      variant='outlined'
                      disabled
                      fullWidth
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <TextInput
                      label='Total Chargeable Skids'
                      value={
                        watch('freight_details.freights').filter(
                          freight => freight.type === 'Skid'
                        )?.length
                      }
                      variant='outlined'
                      disabled={!mode}
                      fullWidth
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <TextInput
                      label='Total Actual Weight'
                      value={watch('freight_details.freights')
                        .map(freight => freight.weight)
                        ?.reduce((acc, pcs) => (acc += Number(pcs)), 0)
                        ?.toFixed(2)}
                      variant='outlined'
                      disabled
                      fullWidth
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <TextInput
                      label='Total Volume Weight'
                      value={'0.02'}
                      variant='outlined'
                      disabled
                      fullWidth
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <TextInput
                      label='Total Chargeable Weight'
                      value={watch('freight_details.freights')
                        .map(freight => freight.weight)
                        ?.reduce((acc, pcs) => (acc += Number(pcs)), 0)
                        ?.toFixed(2)}
                      variant='outlined'
                      disabled
                      fullWidth
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <TextInput
                      label='Weight In KG'
                      value={watch('freight_details.freights')
                        .map(freight => freight.weight)
                        ?.reduce((acc, pcs) => (acc += Number(pcs)), 0)
                        ?.toFixed(2)}
                      variant='outlined'
                      disabled
                      fullWidth
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <WizardCard minHeight={500} title='Freight & Charges'>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <FormControl>
                <CustomFormControlLabel
                  control={
                    <Switch {...register('freight_charges.no_charges')} />
                  }
                  label='No Charges'
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <FormControl>
                <CustomFormControlLabel
                  control={
                    <Switch {...register('freight_charges.manual_charges')} />
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
                    <Switch
                      {...register('freight_charges.manual_fuel_surcharge')}
                    />
                  }
                  label='Manual Fuel Surcharges'
                />
              </FormControl>
            </Grid>
            {!watch('freight_charges.no_charges') && (
              <Grid size={12}>
                <Grid
                  container
                  sx={{
                    border: `1px solid ${theme.palette.grey[200]}`,
                    borderRadius: 3
                  }}
                >
                  <Grid
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
                  </Grid>
                  <Grid size={12}>
                    <Grid container spacing={2} p={3}>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextInput
                          label='Freight Rate'
                          variant='outlined'
                          fullWidth
                          type='number'
                          {...register('freight_charges.freight_rate')}
                          disabled={!watch('freight_charges.manual_charges')}
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
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextInput
                          label='Fuel Surcharge'
                          variant='outlined'
                          fullWidth
                          type='number'
                          {...register('freight_charges.fuel_surcharge')}
                          disabled={
                            !watch('freight_charges.manual_fuel_surcharge')
                          }
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
                  <Typography
                    component={'p'}
                    sx={{ fontSize: 16, fontWeight: 600 }}
                  >
                    Customer Accessorial Charges
                  </Typography>
                  <Typography
                    variant='caption'
                    color='textSecondary'
                    fontSize={14}
                  >
                    Customer-specific accessorial charges and fees
                  </Typography>
                </Grid>
                {watch('client_info.customer') &&
                  watch('client_info.customer')?.accessorials && (
                    <Grid size={12} sx={{ py: 2, px: 3 }}>
                      <Grid container spacing={2}>
                        {watch('client_info.customer')?.accessorials.map(
                          (access, index) => (
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
                                    access.accessorial_name,
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
                                          `freight_charges.customer_accessorials.${index}.is_included`
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
                                    `freight_charges.customer_accessorials.${index}.quantity`
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
                                    `freight_charges.customer_accessorials.${index}.amount`
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
                          )
                        )}
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
                        {additionalServiceCharges.map(
                          (serviceCharge, index) => (
                            <Grid size={12} key={serviceCharge.id}>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 12, md: 5 }}>
                                  <TextInput
                                    size='small'
                                    label='Charge Name'
                                    variant='outlined'
                                    fullWidth
                                    {...register(
                                      `freight_charges.additional_service_charges.${index}.charge_name`
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
                                      `freight_charges.additional_service_charges.${index}.charge_quantity`
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
                                      `freight_charges.additional_service_charges.${index}.charge_amount`
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
                          )
                        )}
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
                <Grid
                  size={12}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    p: 2
                  }}
                >
                  <Typography
                    component={'p'}
                    sx={{ fontSize: 16, fontWeight: 600 }}
                  >
                    Order Summary
                  </Typography>
                </Grid>
                <Grid size={12} sx={{ p: 2 }}>
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
                        px: 2,
                        py: 1
                      }}
                    >
                      <Typography
                        component={'p'}
                        sx={{ fontSize: 15, fontWeight: 600 }}
                      >
                        Weight Calculations
                      </Typography>
                    </Grid>
                    <Grid size={12} sx={{ p: 2 }}>
                      <Grid container spacing={2} sx={{ px: 2, py: 1 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                          <TextInput
                            label='Actual Weight'
                            variant='outlined'
                            fullWidth
                            type='number'
                            {...register(
                              'freight_charges.order_summary.weight_calculation.actual_weight'
                            )}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment
                                    position='end'
                                    sx={{
                                      '& p': {
                                        fontSize: 12
                                      }
                                    }}
                                  >
                                    LBS
                                  </InputAdornment>
                                )
                              }
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                          <TextInput
                            label='Volume Weight'
                            variant='outlined'
                            fullWidth
                            type='number'
                            {...register(
                              'freight_charges.order_summary.weight_calculation.volume_weight'
                            )}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment
                                    position='end'
                                    sx={{
                                      '& p': {
                                        fontSize: 12
                                      }
                                    }}
                                  >
                                    LBS
                                  </InputAdornment>
                                )
                              }
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                          <TextInput
                            label='Chargeable Weight'
                            variant='outlined'
                            fullWidth
                            type='number'
                            {...register(
                              'freight_charges.order_summary.weight_calculation.chargeable_weight'
                            )}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment
                                    position='end'
                                    sx={{
                                      '& p': {
                                        fontSize: 12
                                      }
                                    }}
                                  >
                                    LBS
                                  </InputAdornment>
                                )
                              }
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                          <TextInput
                            label='Total Pieces'
                            variant='outlined'
                            type='number'
                            fullWidth
                            {...register(
                              'freight_charges.order_summary.weight_calculation.total_pieces'
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                          <TextInput
                            label='Weight (KG)'
                            variant='outlined'
                            type='number'
                            fullWidth
                            {...register(
                              'freight_charges.order_summary.weight_calculation.weight_kg'
                            )}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment
                                    position='end'
                                    sx={{
                                      '& p': {
                                        fontSize: 12
                                      }
                                    }}
                                  >
                                    KG
                                  </InputAdornment>
                                )
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12} mt={2}>
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
                        <Typography
                          component={'p'}
                          sx={{ fontSize: 15, fontWeight: 600 }}
                        >
                          Pricing Breakdown
                        </Typography>
                      </Grid>
                      <Grid size={12} sx={{ py: 3, px: 4 }}>
                        <Grid container spacing={4}>
                          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <TextInput
                              label='Freight Rate'
                              fullWidth
                              variant='outlined'
                              {...register(
                                'freight_charges.order_summary.pricing_breakdown.freight_rate'
                              )}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment
                                      sx={{ '& p': { fontSize: 12 } }}
                                    >
                                      $
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <TextInput
                              label='Fuel Surcharge'
                              fullWidth
                              variant='outlined'
                              {...register(
                                'freight_charges.order_summary.pricing_breakdown.fuel_surcharge'
                              )}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment
                                      sx={{ '& p': { fontSize: 12 } }}
                                    >
                                      $
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          </Grid>
                          <Grid size={12}>
                            <TextInput
                              label='Sub Total'
                              fullWidth
                              variant='outlined'
                              {...register(
                                'freight_charges.order_summary.pricing_breakdown.sub_total'
                              )}
                              size='large'
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment
                                      sx={{ '& p': { fontSize: 13 } }}
                                    >
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
                                'freight_charges.order_summary.pricing_breakdown.provincial_tax'
                              )}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment
                                      sx={{ '& p': { fontSize: 12 } }}
                                    >
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
                                'freight_charges.order_summary.pricing_breakdown.federal_tax'
                              )}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment
                                      sx={{ '& p': { fontSize: 12 } }}
                                    >
                                      $
                                    </InputAdornment>
                                  )
                                }
                              }}
                            />
                          </Grid>
                          <Grid size={12}>
                            <TextInput
                              label='Grand Tax'
                              fullWidth
                              variant='outlined'
                              {...register(
                                'freight_charges.order_summary.pricing_breakdown.grand_tax'
                              )}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <InputAdornment
                                      sx={{ '& p': { fontSize: 12 } }}
                                    >
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
              </Grid>
            </Grid>
          </Grid>
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <WizardCard minHeight={500} title='Waiting Time & Billing'>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name='waiting_time_billing.pickup_in'
                control={control}
                render={({ field, fieldState }) => (
                  <TimePicker
                    label='Pickup In'
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name='waiting_time_billing.pickup_out'
                control={control}
                render={({ field, fieldState }) => (
                  <TimePicker
                    label='Pickup Out'
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <Controller
                name='waiting_time_billing.pickup_at'
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label='Pickup At'
                    views={['year', 'month', 'day']}
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name='waiting_time_billing.delivery_in'
                control={control}
                render={({ field, fieldState }) => (
                  <TimePicker
                    label='Delivery In'
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name='waiting_time_billing.delivery_out'
                control={control}
                render={({ field, fieldState }) => (
                  <TimePicker
                    label='Delivery Out'
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <Controller
                name='waiting_time_billing.delivery_at'
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label='Delivery At'
                    views={['year', 'month', 'day']}
                    value={field.value}
                    onChange={date => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiPickersOutlinedInput-root': { height: 45 },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '14px',
                            padding: '10px 14px'
                          },
                          '& .MuiInputLabel-root': { fontSize: '13px' },
                          '& .MuiInputLabel-shrink': { fontSize: '14px' }
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid
              size={12}
              container
              spacing={{ xs: 2, sm: 2, md: 5 }}
              sx={{
                border: `1px solid ${theme.palette.grey[400]}`,
                py: 2,
                px: 3,
                borderRadius: 2
              }}
            >
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant='button' fontWeight={600}>
                  Pickup Total Time
                </Typography>
                <Typography
                  variant='subtitle2'
                  fontWeight={theme.typography.fontWeightLight}
                >
                  0 mins
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant='button' fontWeight={600}>
                  Delivery Total Time
                </Typography>
                <Typography
                  variant='subtitle2'
                  fontWeight={theme.typography.fontWeightLight}
                >
                  0 mins
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Typography variant='button' fontWeight={600}>
                  Total Time
                </Typography>
                <Typography
                  variant='subtitle2'
                  fontWeight={theme.typography.fontWeightLight}
                >
                  0 mins
                </Typography>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextField
                label='Pickup Signee'
                variant='outlined'
                {...register('waiting_time_billing.pickup_signee')}
                multiline
                minRows={3}
                maxRows={3}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '13px'
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextField
                label='Delivery Signee'
                variant='outlined'
                {...register('waiting_time_billing.delivery_signee')}
                multiline
                minRows={3}
                maxRows={3}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '13px'
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <AccordionComponent
                title={'Billing'}
                content={
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                      <Controller
                        name='waiting_time_billing.billing.invoice_date'
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label='Invoice Date'
                            views={['year', 'month', 'day']}
                            value={field.value}
                            onChange={date => field.onChange(date)}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                sx: {
                                  '& .MuiPickersOutlinedInput-root': {
                                    height: 45
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    fontSize: '14px',
                                    padding: '10px 14px'
                                  },
                                  '& .MuiInputLabel-root': { fontSize: '13px' },
                                  '& .MuiInputLabel-shrink': {
                                    fontSize: '14px'
                                  }
                                }
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                      <TextInput
                        label='Invoice #'
                        fullWidth
                        variant='outlined'
                        {...register('waiting_time_billing.billing.invoice')}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                      <FormControl>
                        <CustomFormControlLabel
                          control={
                            <Switch
                              {...register(
                                'waiting_time_billing.billing.invoiced'
                              )}
                            />
                          }
                          label='Invoiced'
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                }
              />
            </Grid>
          </Grid>
        </WizardCard>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={2} justifyContent={'flex-start'}>
          <Grid size='auto'>
            <SubmitButton type='submit' variant='contained' color='primary' size='small' textTransform='capitalize'>
              Create Order
            </SubmitButton>
          </Grid>
          <Grid size='auto'>
            <StyledButton variant='outlined' color='secondary' size='small' textTransform='capitalize'>
              Save As Quote
            </StyledButton>
          </Grid>
          <Grid size='auto'>
            <StyledButton variant='outlined' color='error' size='small' textTransform='capitalize'>
              Cancel
            </StyledButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
