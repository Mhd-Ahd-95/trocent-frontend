import React from 'react'
import { Grid, Autocomplete, Typography, Button, InputAdornment, CircularProgress, FormControl, Switch } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CustomFormControlLabel } from '../../components'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Add } from '@mui/icons-material'
import TextInput from '../CustomComponents/TextInput'
import FreightRow from './FreightRow'

const useFreightCalculations = (freights, customer, setValue, fieldsLength, engine, frate, accessorialRef) => {
  const calculationTimeoutRef = React.useRef(null)
  const [isCalculating, setIsCalculating] = React.useState(false)
  const previousFreightsRef = React.useRef(null)
  const previousLengthRef = React.useRef(0)

  React.useEffect(() => {
    if (!freights || freights.length === 0 || !customer) return

    const lengthChanged = fieldsLength !== previousLengthRef.current
    const freightsChanged = JSON.stringify(freights) !== JSON.stringify(previousFreightsRef.current)

    if (!freightsChanged && !lengthChanged) return

    previousFreightsRef.current = freights
    previousLengthRef.current = fieldsLength

    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current)
    }

    setIsCalculating(true)

    const timeout = lengthChanged ? 100 : 300

    calculationTimeoutRef.current = setTimeout(() => {
      try {
        engine.customer = customer
        engine.freights = freights

        const totals = engine.calculateOrder()
        requestAnimationFrame(() => {
          setValue('total_pieces', totals?.total_pieces ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_pieces_skid', totals?.total_pieces_skid ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_actual_weight', totals?.total_actual_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_volume_weight', totals?.total_volume_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_chargeable_weight', totals?.total_chargeable_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_weight_in_kg', totals?.total_weight_in_kg ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('freight_rate', totals?.freight_rate ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('freight_fuel_surcharge', totals?.freight_fuel_surcharge ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('sub_total', totals?.sub_totals ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('provincial_tax', totals?.provincial_tax ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('federal_tax', totals?.federal_tax ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('grand_total', totals?.grand_totals ?? 0, { shouldValidate: false, shouldDirty: false })
          if (frate !== totals?.freight_rate) {
            accessorialRef.current?.recalculateAccessorials()
          }
          setIsCalculating(false)
        })
      } catch (err) {
        console.error('Calculation error:', err)
        setIsCalculating(false)
      }
    }, timeout)

    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current)
      }
    }
  }, [freights, customer, setValue, fieldsLength])

  return isCalculating
}

function FreightDetails(props) {
  const { engine } = props

  const {
    control,
    setValue,
    getValues,
    register
  } = useFormContext()

  const theme = useTheme()
  const [mode, setMode] = React.useState(getValues('is_manual_skid') || false)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'freights'
  })

  const isCalculating = useFreightCalculations(
    getValues('freights'),
    engine.customer,
    setValue,
    fields.length,
    engine,
    getValues('freight_rate'),
    props.accessorialRef
  )

  const handleAddFreight = React.useCallback(() => {
    append({
      type: '',
      description: '',
      pieces: '',
      weight: '',
      unit: 'lbs',
      length: '',
      width: '',
      height: '',
      dim_unit: 'in',
      not_stack: false,
      is_converted: false,
      volume_weight: 0
    })
    setTimeout(() => {
      const freights = getValues('freights')
      if (freights && engine.customer) {
        engine.freights = freights
        const totals = engine.calculateOrder()
        const ofrate = getValues('freight_rate')
        requestAnimationFrame(() => {
          setValue('total_pieces', totals?.total_pieces ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_pieces_skid', totals?.total_pieces_skid ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_actual_weight', totals?.total_actual_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_volume_weight', totals?.total_volume_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_chargeable_weight', totals?.total_chargeable_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_weight_in_kg', totals?.total_weight_in_kg ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('freight_rate', totals?.freight_rate ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('freight_fuel_surcharge', totals?.freight_fuel_surcharge ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('sub_total', totals?.sub_totals ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('provincial_tax', totals?.provincial_tax ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('federal_tax', totals?.federal_tax ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('grand_total', totals?.grand_totals ?? 0, { shouldValidate: false, shouldDirty: false })
          if (ofrate !== totals?.freight_rate) {
            props.accessorialRef.current?.recalculateAccessorials()
          }
        })
      }
    }, 50)
  }, [append, getValues, engine, setValue])

  const handleRemoveFreight = React.useCallback((index) => {
    remove(index)
    setTimeout(() => {
      const freights = getValues('freights')
      if (freights && freights.length > 0 && engine.customer) {
        engine.freights = freights
        const totals = engine.calculateOrder()
        const ofrate = getValues('freight_rate')
        requestAnimationFrame(() => {
          setValue('total_pieces', totals?.total_pieces ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_pieces_skid', totals?.total_pieces_skid ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_actual_weight', totals?.total_actual_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_volume_weight', totals?.total_volume_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_chargeable_weight', totals?.total_chargeable_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_weight_in_kg', totals?.total_weight_in_kg ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('freight_rate', totals?.freight_rate ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('freight_fuel_surcharge', totals?.freight_fuel_surcharge ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('sub_total', totals?.sub_totals ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('provincial_tax', totals?.provincial_tax ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('federal_tax', totals?.federal_tax ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('grand_total', totals?.grand_totals ?? 0, { shouldValidate: false, shouldDirty: false })
          if (ofrate !== totals?.freight_rate) {
            props.accessorialRef.current?.recalculateAccessorials()
          }
        })
      }
    }, 50)
  }, [remove, getValues, engine, setValue])

  const triggerRecalculation = React.useCallback(() => {
    const freights = getValues('freights')
    if (freights && engine.customer) {
      engine.freights = freights
      const totals = engine.calculateOrder()
      const ofrate = getValues('freight_rate')
      requestAnimationFrame(() => {
        setValue('total_pieces', totals?.total_pieces ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_pieces_skid', totals?.total_pieces_skid ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_actual_weight', totals?.total_actual_weight ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_volume_weight', totals?.total_volume_weight ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_chargeable_weight', totals?.total_chargeable_weight ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_weight_in_kg', totals?.total_weight_in_kg ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('freight_rate', totals?.freight_rate ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('freight_fuel_surcharge', totals?.freight_fuel_surcharge ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('sub_total', totals?.sub_totals ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('provincial_tax', totals?.provincial_tax ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('federal_tax', totals?.federal_tax ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('grand_total', totals?.grand_totals ?? 0, { shouldValidate: false, shouldDirty: false })
        if (Number(ofrate) !== Number(totals?.freight_rate)) {
          props.accessorialRef.current?.recalculateAccessorials()
        }
      })
    }
    else {
      requestAnimationFrame(() => {
        setValue('total_pieces', 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_pieces_skid', 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_actual_weight', 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_volume_weight', 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_chargeable_weight', 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_weight_in_kg', 0, { shouldValidate: false, shouldDirty: false })
        setValue('freight_rate', 0, { shouldValidate: false, shouldDirty: false })
        setValue('freight_fuel_surcharge', 0, { shouldValidate: false, shouldDirty: false })
        setValue('sub_total', 0, { shouldValidate: false, shouldDirty: false })
        setValue('provincial_tax', 0, { shouldValidate: false, shouldDirty: false })
        setValue('federal_tax', 0, { shouldValidate: false, shouldDirty: false })
        setValue('grand_total', 0, { shouldValidate: false, shouldDirty: false })
      })
    }
  }, [engine, getValues, setValue])

  React.useImperativeHandle(props.calculationRef, () => ({
    recalculate: triggerRecalculation
  }))

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Grid container spacing={1}>
          <Grid size={12}>
            <Controller
              name='service_type'
              control={control}
              render={({ field, fieldState }) => (
                <Autocomplete
                  {...field}
                  options={['Regular', 'Direct', 'Rush']}
                  onChange={(_, value) => {
                    field.onChange(value)
                    const customerAccess = getValues('customer_accessorials') || []
                    const access = customerAccess.find(acc => acc.charge_name.toLowerCase() === 'rush service')
                    const accIdx = customerAccess.findIndex(acc => acc.charge_name.toLowerCase() === 'rush service')
                    if (value === 'Rush' && access) {
                      setValue(`customer_accessorials.${accIdx}`, { ...access, is_included: true, charge_quantity: 1, charge_amount: access.amount })
                    }
                    else {
                      setValue(`customer_accessorials.${accIdx}`, { ...access, is_included: false, charge_quantity: 0, charge_amount: 0 })
                    }
                    engine.service_type = value
                    engine.accessorialsCharge = customerAccess
                    triggerRecalculation()
                  }}
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
          <Grid size={12} pt={2}>
            {/* <Typography
              component='p'
              sx={{
                fontSize: 16,
                fontWeight: 600,
                paddingBlock: 2,
                paddingLeft: 1
              }}
            >
              Freights
            </Typography> */}
            {fields.map((item, index) => (
              <FreightRow
                key={item.id}
                remove={handleRemoveFreight}
                control={control}
                register={register}
                index={index}
                fields={fields}
                setValue={setValue}
                getValues={getValues}
                calculationRef={props.calculationRef}
              />
            ))}
          </Grid>
          <Grid size={12}>
            <Grid
              container
              justifyContent={'center'}
              alignItems={'center'}
            // pb={2}
            >
              <Grid size='auto'>
                <Button
                  startIcon={<Add />}
                  sx={{ textTransform: 'capitalize' }}
                  onClick={(e) => {
                    e.preventDefault()
                    handleAddFreight()
                  }}
                >
                  Add To Freights
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
                <FormControl>
                  <CustomFormControlLabel
                    control={
                      <Controller
                        name='is_manual_skid'
                        control={control}
                        render={({ field }) => (
                          <Switch
                            {...field}
                            checked={field.value || false}
                            onChange={e => {
                              const checked = e.target.checked
                              field.onChange(checked)
                              engine.isManualSkid = checked
                              if (!checked) {
                                engine.overrideTotalPiecesSkid = 0
                                triggerRecalculation()
                              }
                              setMode(checked)
                            }}
                          />
                        )}
                      />
                    }
                    label='Manual Skids'
                  />
                </FormControl>
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
                <Controller
                  name={'total_pieces'}
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label='Total Pieces'
                      variant='outlined'
                      disabled
                      fullWidth
                      InputProps={{
                        endAdornment: isCalculating && (
                          <InputAdornment position="end">
                            <CircularProgress size={20} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <Controller
                  name={'total_pieces_skid'}
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label='Total Chargeable Skids'
                      variant='outlined'
                      disabled={!mode}
                      type='number'
                      fullWidth
                      // value={field.value || ''}
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
                        engine.overrideTotalPiecesSkid = Number(value)
                        triggerRecalculation()
                      }}
                      onBlur={(e) => {
                        const value = e.target.value
                        if (value === '') field.onChange(0)
                      }}
                      InputProps={{
                        endAdornment: isCalculating && (
                          <InputAdornment position="end">
                            <CircularProgress size={20} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <Controller
                  name={'total_actual_weight'}
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label='Total Actual Weight'
                      variant='outlined'
                      disabled
                      fullWidth
                      InputProps={{
                        endAdornment: isCalculating && (
                          <InputAdornment position="end">
                            <CircularProgress size={20} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <Controller
                  name='total_volume_weight'
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label='Total Volume Weight'
                      variant='outlined'
                      disabled
                      fullWidth
                      InputProps={{
                        endAdornment: isCalculating && (
                          <InputAdornment position="end">
                            <CircularProgress size={20} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <Controller
                  name='total_chargeable_weight'
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label='Total Chargeable Weight'
                      variant='outlined'
                      disabled
                      fullWidth
                      InputProps={{
                        endAdornment: isCalculating && (
                          <InputAdornment position="end">
                            <CircularProgress size={20} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <Controller
                  name='total_weight_in_kg'
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label='Weight In KG'
                      variant='outlined'
                      disabled
                      fullWidth
                      InputProps={{
                        endAdornment: isCalculating && (
                          <InputAdornment position="end">
                            <CircularProgress size={20} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputLabel-shrink': {
                          color: '#000',
                          fontWeight: 600,
                          fontSize: 15
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
    </Grid>
  )
}

export default React.memo(FreightDetails)