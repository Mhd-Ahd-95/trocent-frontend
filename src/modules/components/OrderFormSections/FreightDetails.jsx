import React from 'react'
import { Grid, Autocomplete, Typography, Button, InputAdornment, CircularProgress, FormControl, Switch } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CustomFormControlLabel, StyledButton } from '../../components'
import { Controller, useFieldArray } from 'react-hook-form'
import { Add, Calculate } from '@mui/icons-material'
import TextInput from '../CustomComponents/TextInput'
import FreightRow from './FreightRow'
import OrderEngine from './OrderEngine'
import { useSnackbar } from 'notistack'

// Memoized calculation hook
const useFreightCalculations = (freights, customer, setValue) => {
  const calculationTimeoutRef = React.useRef(null)
  const [isCalculating, setIsCalculating] = React.useState(false)
  const previousFreightsRef = React.useRef(null)
  const { enqueueSnackbar } = useSnackbar()

  React.useEffect(() => {
    if (!freights || freights.length === 0 || !customer) return

    const freightsChanged = JSON.stringify(freights) !== JSON.stringify(previousFreightsRef.current)
    if (!freightsChanged) return

    previousFreightsRef.current = freights

    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current)
    }

    setIsCalculating(true)

    calculationTimeoutRef.current = setTimeout(() => {
      try {
        const engine = new OrderEngine(enqueueSnackbar)
        engine.customer = customer
        engine.freights = freights

        const totals = engine.calculateTotalFreights()

        requestAnimationFrame(() => {
          setValue('total_pieces', totals?.total_pieces ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_pieces_skid', totals?.total_pieces_skid ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_actual_weight', totals?.total_actual_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_volume_weight', totals?.total_volume_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_chargeable_weight', totals?.total_chargeable_weight ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('total_weight_in_kg', totals?.total_weight_in_kg ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('freight_rate', totals?.freight_rate ?? 0, { shouldValidate: false, shouldDirty: false })
          setValue('freight_fuel_surcharge', totals?.freight_fuel_surcharge ?? 0, { shouldValidate: false, shouldDirty: false })
          setIsCalculating(false)
        })
      } catch (err) {
        console.error('Calculation error:', err)
        setIsCalculating(false)
      }
    }, 300)

    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current)
      }
    }
  }, [freights, customer, setValue])

  return isCalculating
}

function FreightDetails(props) {
  const { control, register, setValue, engine, getValues } = props
  const theme = useTheme()
  const [mode, setMode] = React.useState(getValues('is_manual_skid') || false)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'freights'
  })

  const isCalculating = useFreightCalculations(
    getValues('freights'),
    engine.customer,
    setValue
  )

  const handleAddFreight = React.useCallback(() => {
    append({
      type: 'Skid',
      description: 'FAK',
      pieces: 1,
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
  }, [append])

  const triggerRecalculation = React.useCallback(() => {
    const freights = getValues('freights')
    if (freights && engine.customer) {
      engine.freights = freights
      const totals = engine.calculateOrder()
      console.log(totals);
      requestAnimationFrame(() => {
        setValue('total_pieces', totals.total_pieces ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_pieces_skid', totals.total_pieces_skid ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_actual_weight', totals.total_actual_weight ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_volume_weight', totals.total_volume_weight ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_chargeable_weight', totals.total_chargeable_weight ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('total_weight_in_kg', totals.total_weight_in_kg ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('freight_rate', totals.freight_rate ?? 0, { shouldValidate: false, shouldDirty: false })
        setValue('freight_fuel_surcharge', totals.freight_fuel_surcharge ?? 0, { shouldValidate: false, shouldDirty: false })
      })
    }
  }, [engine.customer, engine, getValues, setValue])

  // Expose recalculation function to parent
  React.useImperativeHandle(props.calculationRef, () => ({
    recalculate: triggerRecalculation
  }))

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Controller
              name='service_type'
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
              <FreightRow
                key={item.id}
                remove={remove}
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
              pb={2}
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
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        // setValue('total_pieces_skid', value)
                        engine.overrideTotalPiecesSkid = value
                        triggerRecalculation()
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