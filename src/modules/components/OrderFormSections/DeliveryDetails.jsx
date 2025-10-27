import React from 'react'
import { Grid, Autocomplete, FormControl, Switch } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers'
import { Controller, useWatch } from 'react-hook-form'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import InputWrapper from '../CustomComponents/InputWrapper'
import moment from 'moment'
import { useTerminals } from '../../hooks/useTerminals'

function DeliveryDetails(props) {
  const { register, control, setValue } = props

  const { data } = useTerminals()

  const isAppointment = useWatch({
    control: control,
    name: 'delivery_appointment',
  })

  const appointment_numbers = useWatch({
    control: control,
    name: 'delivery_appointment_numbers',
  })

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name='delivery_date'
          control={control}
          rules={{ required: 'Delivery Date is required' }}
          render={({ field, fieldState }) => (
            <DatePicker
              label='Delivery Date*'
              views={['year', 'month', 'day']}
              value={field.value ? moment(field.value) : null}
              onChange={date => field.onChange(date ? date.toISOString() : null)}
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
          name='delivery_time_from'
          control={control}
          render={({ field, fieldState }) => (
            <TimePicker
              label='Time From'
              value={field.value ? moment(field.value, 'hh:mm A') : null}
              onChange={(date) => {
                const formattedTime = date?.format('hh:mm A') || null;
                field.onChange(formattedTime);
              }}
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
          name='delivery_time_to'
          control={control}
          render={({ field, fieldState }) => (
            <TimePicker
              label='Time To'
              value={field.value ? moment(field.value, 'hh:mm A') : null}
              onChange={(date) => {
                const formattedTime = date?.format('hh:mm A') || null;
                field.onChange(formattedTime);
              }}
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
          {...register('delivery_driver_assigned')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name='delivery_terminal'
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={data?.map((dt => dt.terminal)) || []}
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
              <Controller
                name='delivery_appointment'
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
            label='Appointment'
          />
        </FormControl>
      </Grid>
      {isAppointment && (
        <Grid size={12}>
          <InputWrapper
            placeholder='Appointment Numbers'
            textHelper='Add multiple appointment numbers separated by commas'
            noSpace
            setValue={setValue}
            field='delivery_appointment_numbers'
            data={appointment_numbers}
          />
        </Grid>
      )}
    </Grid>
  )
}


export default React.memo(DeliveryDetails)