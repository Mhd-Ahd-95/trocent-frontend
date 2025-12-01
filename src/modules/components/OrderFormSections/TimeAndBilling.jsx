import React from 'react'
import { Grid, TextField, FormControl, Switch, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  AccordionComponent,
  TextInput,
  CustomFormControlLabel,
  OrderEngine
} from '../../components'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers'
import { Controller, useFormContext } from 'react-hook-form'
import moment from 'moment'
import { unstable_batchedUpdates } from 'react-dom'

export default function TimeAndBilling(props) {
  const theme = useTheme()
  const isCalculatedRef = React.useRef(false)

  const {
    control,
    setValue,
    getValues,
    register
  } = useFormContext()

  React.useEffect(() => {
    if (props.editMode && !isCalculatedRef.current) {
      isCalculatedRef.current = true
      const time = getValues(['pickup_in', 'pickup_out', 'delivery_in', 'delivery_out'])
      const { total_pickup, total_delivery, total_time } = OrderEngine.calculatePDTotalTimes(time[0], time[1], time[2], time[3])
      setValue('total_pickup', total_pickup)
      setValue('total_delivery', total_delivery)
      setValue('total_time', total_time)
    }
  }, [props.editMode])

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Controller
          name='pickup_in'
          control={control}
          render={({ field }) => (
            <TimePicker
              label='Pickup In'
              value={field.value ? moment(field.value, 'HH:mm') : null}
              onChange={date => {
                unstable_batchedUpdates(() => {
                  field.onChange(date ? moment(date).format('HH:mm') : null)
                  const time = getValues(['pickup_in', 'pickup_out', 'delivery_in', 'delivery_out'])
                  const { total_pickup, total_delivery, total_time } = OrderEngine.calculatePDTotalTimes(time[0], time[1], time[2], time[3])
                  setValue('total_pickup', total_pickup)
                  setValue('total_delivery', total_delivery)
                  setValue('total_time', total_time)
                })
              }}
              ampm={false}
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
          name='pickup_out'
          control={control}
          render={({ field }) => (
            <TimePicker
              label='Pickup Out'
              value={field.value ? moment(field.value, 'HH:mm') : null}
              onChange={date => {
                unstable_batchedUpdates(() => {
                  field.onChange(date ? moment(date).format('HH:mm') : null)
                  const time = getValues(['pickup_in', 'pickup_out', 'delivery_in', 'delivery_out'])
                  const { total_pickup, total_delivery, total_time } = OrderEngine.calculatePDTotalTimes(time[0], time[1], time[2], time[3])
                  setValue('total_pickup', total_pickup)
                  setValue('total_delivery', total_delivery)
                  setValue('total_time', total_time)
                })
              }}
              ampm={false}
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
          name='pickup_at'
          control={control}
          render={({ field }) => (
            <DatePicker
              label='Pickup At'
              views={['year', 'month', 'day']}
              value={field.value ? moment(field.value) : null}
              onChange={date => field.onChange(date ? date.toISOString() : null)}
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
          name='delivery_in'
          control={control}
          render={({ field }) => (
            <TimePicker
              label='Delivery In'
              value={field.value ? moment(field.value, 'HH:mm') : null}
              onChange={date => {
                unstable_batchedUpdates(() => {
                  field.onChange(date ? moment(date).format('HH:mm') : null)
                  const time = getValues(['pickup_in', 'pickup_out', 'delivery_in', 'delivery_out'])
                  const { total_pickup, total_delivery, total_time } = OrderEngine.calculatePDTotalTimes(time[0], time[1], time[2], time[3])
                  setValue('total_pickup', total_pickup)
                  setValue('total_delivery', total_delivery)
                  setValue('total_time', total_time)
                })
              }}
              ampm={false}
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
          name='delivery_out'
          control={control}
          render={({ field }) => (
            <TimePicker
              label='Delivery Out'
              value={field.value ? moment(field.value, 'HH:mm') : null}
              onChange={date => {
                unstable_batchedUpdates(() => {
                  field.onChange(date ? moment(date).format('HH:mm') : null)
                  const time = getValues(['pickup_in', 'pickup_out', 'delivery_in', 'delivery_out'])
                  const { total_pickup, total_delivery, total_time } = OrderEngine.calculatePDTotalTimes(time[0], time[1], time[2], time[3])
                  setValue('total_pickup', total_pickup)
                  setValue('total_delivery', total_delivery)
                  setValue('total_time', total_time)
                })
              }}
              ampm={false}
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
          name='delivery_at'
          control={control}
          render={({ field }) => (
            <DatePicker
              label='Delivery At'
              views={['year', 'month', 'day']}
              value={field.value ? moment(field.value) : null}
              onChange={date => field.onChange(date ? date.toISOString() : null)}
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
          <Controller
            name='total_pickup'
            control={control}
            render={({ field }) => (
              <Typography
                variant='subtitle2'
                fontWeight={theme.typography.fontWeightLight}
              >
                {field.value || 0} {' '} mins
              </Typography>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Typography variant='button' fontWeight={600}>
            Delivery Total Time
          </Typography>
          <Controller
            name='total_delivery'
            control={control}
            render={({ field }) => (
              <Typography
                variant='subtitle2'
                fontWeight={theme.typography.fontWeightLight}
              >
                {field.value || 0} {' '} mins
              </Typography>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Typography variant='button' fontWeight={600}>
            Total Time
          </Typography>
          <Controller
            name='total_time'
            control={control}
            render={({ field }) => (
              <Typography
                variant='subtitle2'
                fontWeight={theme.typography.fontWeightLight}
              >
                {field.value || 0} {' '} mins
              </Typography>
            )}
          />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextField
          label='Pickup Signee'
          variant='outlined'
          {...register('pickup_signee')}
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
          {...register('delivery_signee')}
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
                  name='billing_invoice_date'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label='Invoice Date'
                      views={['year', 'month', 'day']}
                      value={field.value ? moment(field.value) : null}
                      onChange={date => field.onChange(date ? date.toISOString() : null)}
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
                  {...register('billing_invoice')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <FormControl>
                  <CustomFormControlLabel
                    control={
                      <Controller
                        name='billing_invoiced'
                        control={control}
                        render={({ field }) => (
                          <Switch
                            {...field}
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
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
  )
}
