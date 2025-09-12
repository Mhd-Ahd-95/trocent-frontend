import React from 'react'
import { Grid, Autocomplete, Typography, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { StyledButton } from '../../components'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { Add, Calculate } from '@mui/icons-material'
import TextInput from '../CustomComponents/TextInput'
import FreightRow from './FreightRow'

function FreightDetails (props) {
  const { control, register, watch, setValue } = props
  const theme = useTheme()
  const [mode, setMode] = React.useState(false)

  const freights = useWatch({ control, name: 'freight_details.freights' })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'freight_details.freights'
  })

  const totals = React.useMemo(() => {
    const totalPieces =
      freights?.reduce((acc, f) => acc + Number(f.pieces || 0), 0) || 0
    const totalWeight =
      freights?.reduce((acc, f) => acc + Number(f.weight || 0), 0).toFixed(2) ||
      0
    const totalSkids = freights?.filter(f => f.type === 'Skid')?.length || 0
    return { totalPieces, totalWeight, totalSkids }
  }, [freights])

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
              name='freight_details.service_type'
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
                <TextInput
                  label='Total Pieces'
                  value={totals.totalPieces}
                  variant='outlined'
                  disabled
                  fullWidth
                  sx={{
                    '& .MuiInputLabel-shrink': {
                      color: '#000',
                      fontWeight: 600,
                      fontSize: 15
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <TextInput
                  label='Total Chargeable Skids'
                  value={totals.totalSkids}
                  variant='outlined'
                  disabled={!mode}
                  fullWidth
                  sx={{
                    '& .MuiInputLabel-shrink': {
                      color: '#000',
                      fontWeight: 600,
                      fontSize: 15
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <TextInput
                  label='Total Actual Weight'
                  value={totals.totalWeight}
                  variant='outlined'
                  disabled
                  fullWidth
                  sx={{
                    '& .MuiInputLabel-shrink': {
                      color: '#000',
                      fontWeight: 600,
                      fontSize: 15
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <TextInput
                  label='Total Volume Weight'
                  value={'0.02'}
                  variant='outlined'
                  disabled
                  fullWidth
                  sx={{
                    '& .MuiInputLabel-shrink': {
                      color: '#000',
                      fontWeight: 600,
                      fontSize: 15
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <TextInput
                  label='Total Chargeable Weight'
                  value={totals.totalWeight}
                  variant='outlined'
                  disabled
                  fullWidth
                  sx={{
                    '& .MuiInputLabel-shrink': {
                      color: '#000',
                      fontWeight: 600,
                      fontSize: 15
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <TextInput
                  label='Weight In KG'
                  value={totals.totalWeight}
                  variant='outlined'
                  disabled
                  fullWidth
                  sx={{
                    '& .MuiInputLabel-shrink': {
                      color: '#000',
                      fontWeight: 600,
                      fontSize: 15
                    }
                  }}
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
