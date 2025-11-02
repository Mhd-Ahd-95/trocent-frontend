import React from 'react'
import { Grid, Autocomplete, Typography, Button, InputAdornment, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { StyledButton } from '../../components'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { Add, Calculate } from '@mui/icons-material'
import TextInput from '../CustomComponents/TextInput'
import FreightRow from './FreightRow'
import OrderEngine from './OrderEngine'

function FreightDetails(props) {
  const { control, register, watch, setValue } = props
  const theme = useTheme()
  const [mode, setMode] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const freights = useWatch({ control, name: 'freights' })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'freights'
  })

  const shipper_city = watch('shipper_city')
  const receiver_city = watch('receiver_city')
  const customer = watch('customer')

  const request = () => ({
    freights,
    shipper_city,
    receiver_city,
    customer
  })

  React.useEffect(() => {

    if (freights.length === 0) return

    freights.forEach((item, index) => {
      const { pieces, length, width, height } = item
      if (!pieces || !length || !width || !height) return

      const newVolume = OrderEngine.calculateVolumeWeight(item)
      const oldVolume = item.volume_weight

      if (newVolume !== oldVolume) {
        setValue(`freights.${index}.volume_weight`, newVolume, { shouldDirty: false, shouldValidate: false })
      }
    })

    if (!customer) return

    setLoading(true)

    const timer = setTimeout(() => {
      try {
        const engine = new OrderEngine(request())
        const totals = engine.calculateTotalFreights()
        setValue('total_pieces', totals.total_pieces ?? 0)
        setValue('total_pieces_skid', totals.total_pieces_skid ?? 0)
        setValue('total_actual_weight', totals.total_actual_weight ?? 0)
        setValue('total_volume_weight', totals.total_volume_weight ?? 0)
        setValue('total_chargeable_weight', totals.total_chargeable_weight ?? 0)
        setValue('total_weight_in_kg', totals.total_weight_in_kg ?? 0)
      }
      catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false)
      }
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [freights, shipper_city, receiver_city, customer])


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
      is_converted: false
    })
  }, [append])

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
                getValues={props.getValues}
                key={item.id}
                remove={remove}
                control={control}
                register={register}
                watch={watch}
                index={index}
                fields={fields}
                setValue={setValue}
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
                  onClick={() => handleAddFreight()}
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
                        endAdornment: loading && (
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
                      fullWidth
                      InputProps={{
                        endAdornment: loading && (
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
                        endAdornment: loading && (
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
                  )} />
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
                        endAdornment: loading && (
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
                        endAdornment: loading && (
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
                        endAdornment: loading && (
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
