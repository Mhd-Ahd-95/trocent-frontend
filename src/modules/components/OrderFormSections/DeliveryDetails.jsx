import React from 'react'
import { Grid, Autocomplete, FormControl, Switch } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import { Controller } from 'react-hook-form'

export default function DeliveryDetails (props) {
  const { register, control, errors } = props

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name='delivery_details.delivery_date'
          control={control}
          rules={{ required: 'Delivery Date is required' }}
          render={({ field, fieldState }) => (
            <DatePicker
              label='Delivery Date*'
              views={['year', 'month', 'day']}
              value={field.value}
              onChange={date => field.onChange(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!fieldState?.error,
                  helperText: fieldState?.error?.message,
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
          render={({ field, fieldState }) => (
            <TimePicker
              label='Time From'
              value={field.value}
              onChange={date => field.onChange(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!fieldState?.error,
                  helperText: fieldState?.error?.message,
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
          render={({ field, fieldState }) => (
            <TimePicker
              label='Time To'
              value={field.value}
              onChange={date => field.onChange(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!fieldState?.error,
                  helperText: fieldState?.error?.message,
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
            control={<Switch {...register('delivery_details.appointment')} />}
            label='Appointment'
          />
        </FormControl>
      </Grid>
    </Grid>
  )
}
