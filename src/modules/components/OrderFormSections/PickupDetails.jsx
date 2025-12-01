import React from 'react'
import { Grid, Autocomplete, FormControl, Switch } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import InputWrapper from '../CustomComponents/InputWrapper'
import moment from 'moment'
import { useTerminals } from '../../hooks/useTerminals'

function PickupDetails(props) {

  const {
    control,
    setValue,
    register
  } = useFormContext()

  const { data } = useTerminals()

  const isAppointment = useWatch({
    control: control,
    name: 'pickup_appointment',
  })

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name='pickup_date'
          control={control}
          rules={{ required: 'Pickup Date is required' }}
          render={({ field, fieldState }) => (
            <DatePicker
              label='Pickup Date*'
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
          name='pickup_time_from'
          control={control}
          render={({ field, fieldState }) => (
            <TimePicker
              label='Time From'
              value={field.value ? moment(field.value, 'HH:mm') : null}
              onChange={date => field.onChange(date ? moment(date).format('HH:mm') : null)}
              ampm={false}
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
          name='pickup_time_to'
          control={control}
          render={({ field, fieldState }) => (
            <TimePicker
              label='Time To'
              value={field.value ? moment(field.value, 'HH:mm') : null}
              onChange={date => field.onChange(date ? moment(date).format('HH:mm') : null)}
              ampm={false}
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
        <Controller
          name='pickup_driver_assigned'
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              value={field.value || ''}
              label='Driver Assigned'
              variant='outlined'
              fullWidth
              helperText={props.editMode ? 'Dispatch/Driver Notes' : null}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name='pickup_terminal'
          control={control}
          render={({ field, fieldState }) => (
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
                name='pickup_appointment'
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
          <Controller
            name='pickup_appointment_numbers'
            control={control}
            render={({ field }) => (
              <InputWrapper
                noSpace
                shrinkOut='true'
                setValue={setValue}
                data={field.value || []}
                field='pickup_appointment_numbers'
                placeholder='Type and Press Comma'
                textHelper='Add multiple appointment numbers separated by commas'
                label='Appointment Numbers'
              />
            )}
          />
          {/* <InputWrapper
            placeholder='Appointment Numbers'
            textHelper='Add multiple appointment numbers separated by commas'
            noSpace
            setValue={setValue}
            field='pickup_appointment_numbers'
            data={appointment_numbers}
          /> */}
        </Grid>
      )}
    </Grid>
  )
}


export default React.memo(PickupDetails)