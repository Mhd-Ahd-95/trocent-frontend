import React from 'react'
import {
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  Switch,
  CircularProgress
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Controller } from 'react-hook-form'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import moment from 'moment'
import { AddressBookContext } from '../../contexts'

function BasicInfo(props) {
  const { register, control, setValue, getValues } = props

  const { terminals, loading } = React.useContext(AddressBookContext)

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='username'
          rules={{ required: 'Username is a required field' }}
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Username*'
              variant='outlined'
              fullWidth
              disabled
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />

      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Order Number'
          variant='outlined'
          fullWidth
          disabled
          {...register('order_number')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='create_date'
          control={control}
          rules={{ required: 'Create Date is required' }}
          render={({ field, fieldState }) => (
            <DatePicker
              label='Create Date*'
              views={['year', 'month', 'day']}
              value={field.value ? moment(field.value) : null}
              onChange={date => {
                if (date) {
                  field.onChange(date.toISOString())
                  props.engine.get_fuel_surcharge_by_date(date.toISOString())
                }
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
          name='terminal'
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              loading={loading}
              options={terminals?.map((dt => dt.terminal)) || []}
              onChange={(_, value) => {
                field.onChange(value)
                setValue('pickup_terminal', value || '')
                setValue('delivery_terminal', value || '')
              }}
              renderInput={params => (
                <TextInput
                  {...params}
                  label='Terminal'
                  fullWidth
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Controller
                name='quote'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      if (checked) {
                        setValue('is_crossdock', false)
                        setValue('order_status', 'Quote')
                        setValue('order_entity', 'Order Entry')
                      }
                      else {
                        setValue('order_status', 'Pending')
                        setValue('order_entity', 'Order Entry')
                      }
                    }}
                  />
                )}
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
              <Controller
                name='is_crossdock'
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value || false}
                    onChange={e => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      const accessorials = getValues('customer_accessorials')
                      const index = accessorials.findIndex(acc => acc.charge_name.toLowerCase() === 'crossdock')
                      if (index !== -1) {
                        props.accessorialRef.current?.change(checked, accessorials[index], index)
                      }
                      if (checked) {
                        setValue('quote', false)
                        setValue('order_status', 'Approved')
                        setValue('order_entity', 'Order Billing')
                      }
                      else {
                        setValue('order_status', 'Pending')
                        setValue('order_entity', 'Order Entry')
                      }
                    }}
                  />
                )}
              />
            }
            label='Is Crossdock'
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name='order_entity'
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={['Order Entity', 'Order Billing']}
              getOptionLabel={option => option}
              onChange={(_, value) => {
                field.onChange(value)
                if (value === 'Order Billing') {
                  setValue('order_status', 'Approved')
                }
                else setValue('order_status', 'Pending')
              }}
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
          name='order_status'
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
          {...register('internal_note')}
          multiline
          minRows={2}
          maxRows={2}
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

export default React.memo(BasicInfo)
