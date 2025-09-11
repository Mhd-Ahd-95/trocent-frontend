import React from 'react'
import {
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  Switch
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Controller } from 'react-hook-form'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'

export default function BasicInfo (props) {
  const { register, errors, control, setValue, watch } = props

  const quote = watch('basic_info.quote');
  const isCrossdock = watch('basic_info.is_crossdock');

  return (
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
            control={
              <Switch
                {...register('basic_info.quote')}
                checked={quote}
                onChange={e => {
                  const checked = e.target.checked
                  setValue('basic_info.quote', checked)
                  if (checked) {
                    setValue('basic_info.is_crossdock', false)
                    setValue('basic_info.order_status', 'Quote')
                    setValue('basic_info.order_entity', 'Order Entry')
                  }
                }}
              />
            }
            label='Quote'
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Switch
                {...register('basic_info.is_crossdock')}
                checked={isCrossdock}
                onChange={e => {
                  const checked = e.target.checked
                  setValue('basic_info.is_crossdock', checked)
                  if (checked) {
                    setValue('basic_info.quote', false)
                    setValue('basic_info.order_status', 'Approved')
                    setValue('basic_info.order_entity', 'Order Billing')
                  }
                }}
              />
            }
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
  )
}
