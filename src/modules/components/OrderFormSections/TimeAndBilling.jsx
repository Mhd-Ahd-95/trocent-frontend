import React from 'react'
import { Grid, TextField, FormControl, Switch, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  AccordionComponent,
  TextInput,
  CustomFormControlLabel
} from '../../components'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers'
import { Controller } from 'react-hook-form'
import moment from 'moment'

export default function OrderForm(props) {
  const { register, control, watch, errors } = props
  const theme = useTheme()

  return (
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
                  {...register('waiting_time_billing.billing.invoice')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <FormControl>
                  <CustomFormControlLabel
                    control={
                      <Switch
                        {...register('waiting_time_billing.billing.invoiced')}
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
