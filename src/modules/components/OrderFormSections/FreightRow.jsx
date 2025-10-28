import React from 'react'
import {
  Grid,
  Autocomplete,
  Switch,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Sync } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { Controller, useWatch } from 'react-hook-form'
import { AccordionComponent } from '../../components'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'
import EngineOrder from './EngineOrder'

const FrightRow = React.memo(({ fields, index, control, register, remove, setValue, watch }) => {
  const theme = useTheme()
  const item = fields[index]

  const freight = useWatch({
    control,
    name: `freights.${index}`
  })

  const handleRemove = React.useCallback(() => remove(index), [index, remove])

  const volumeWeight = React.useMemo(() => {
    const vw = EngineOrder.calculateVolumeWeight(freight)
    return vw
  }, [freight])

  const customerWeightPiecesRule = useWatch({
    name: 'customer_weight_rules',
    control
  })

  return (
    <AccordionComponent
      fieldsLength={fields.length}
      handleDelete={handleRemove}
      key={item.id}
      title={`${freight.type || ''}: ${freight.pieces || 0} pcs, ${freight.weight || 0
        } ${freight.unit?.toLowerCase() || ''}`}
      content={
        <Grid container spacing={1}>
          {/* Type */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Controller
              name={`freights.${index}.type`}
              control={control}
              rules={{ required: 'Type is required' }}
              render={({ field, fieldState }) => (
                <Autocomplete
                  {...field}
                  options={['Skid', 'Box', 'Envelope']}
                  onChange={(_, value) => field.onChange(value)}
                  renderInput={params => (
                    <TextInput
                      {...params}
                      label='Type*'
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextInput
              label='Description'
              variant='outlined'
              fullWidth
              {...register(`freights.${index}.description`)}
            />
          </Grid>

          {/* Pieces */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <Controller
              name={`freights.${index}.pieces`}
              control={control}
              render={({ field }) => {
                return <TextInput
                  {...field}
                  label='Pieces'
                  variant='outlined'
                  type='number'
                  fullWidth
                />
              }}
            />
          </Grid>

          {/* Weight */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <Controller
              name={`freights.${index}.weight`}
              control={control}
              render={({ field }) => {
                return <TextInput
                  {...field}
                  label='Weight'
                  variant='outlined'
                  type='number'
                  fullWidth
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value)
                    if (Number(value) >= Number(customerWeightPiecesRule)){
                      const pieces = Math.floor(Number(value) / Number(customerWeightPiecesRule))
                      setValue(`freights.${index}.pieces`, Number(freight.pieces) + pieces)
                    }
                  }}
                  helperText={volumeWeight ? `vol: ${Math.round(volumeWeight * 100) / 100} lbs` : 'Vol: 0.00 lbs'}
                />
              }}
            />
          </Grid>

          {/* Unit with conversion */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <Controller
              name={`freights.${index}.unit`}
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  select
                  label='Unit'
                  variant='outlined'
                  fullWidth
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value)
                    if (value === 'lbs') setValue(`freights.${index}.dim_unit`, 'in')
                    else setValue(`freights.${index}.dim_unit`, 'cm')
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() =>
                              setValue(
                                `freights.${index}.is_converted`,
                                !freight.is_converted
                              )
                            }
                            color={freight.is_converted ? 'success' : 'default'}
                          >
                            <Sync />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  helperText={freight.is_converted ? 'Conv.: ON' : 'Conv.: OFF'}
                  sx={{
                    position: 'relative',
                    '& button': {
                      borderLeft: `1px solid ${theme.palette.grey[200]}`,
                      borderRadius: 0,
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      height: '100%',
                      '& svg': { fontSize: 18, marginTop: 0.3 }
                    },
                    '& .MuiSelect-icon': {
                      position: 'absolute',
                      top: 14,
                      right: 35,
                      fontSize: 20
                    }
                  }}
                >
                  <MenuItem value='lbs'>LBS</MenuItem>
                  <MenuItem value='kg'>KG</MenuItem>
                </TextInput>
              )}
            />
          </Grid>

          {/* Dimensions */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <Controller
              name={`freights.${index}.length`}
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Length'
                  variant='outlined'
                  type='number'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <Controller
              name={`freights.${index}.width`}
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Width'
                  variant='outlined'
                  type='number'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <Controller
              name={`freights.${index}.height`}
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Height'
                  variant='outlined'
                  type='number'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <Controller
              name={`freights.${index}.dim_unit`}
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  select
                  label='Dim Unit'
                  variant='outlined'
                  fullWidth
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value)
                    if (value === 'in') setValue(`freights.${index}.unit`, 'lbs')
                    else setValue(`freights.${index}.unit`, 'kg')
                  }}
                >
                  <MenuItem value='in'>IN</MenuItem>
                  <MenuItem value='cm'>CM</MenuItem>
                </TextInput>
              )}
            />
          </Grid>

          {/* Not Stack */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <CustomFormControlLabel
              control={
                <Controller
                  name={`freights.${index}.not_stack`}
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value || false}
                      onChange={(e) => {
                        const checked = e.target.checked
                        field.onChange(checked)
                      }}
                    />
                  )}
                />

              }
              label='Not Stack'
              sx={{ '& span': { fontSize: 12, whiteSpace: 'nowrap' } }}
            />
          </Grid>
        </Grid>
      }
      icons
    />
  )
}
)

export default FrightRow