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

const FrightRow = React.memo(({ fields, index, control, register, remove, setValue }) => {
  const theme = useTheme()
  const item = fields[index]

  const freight = useWatch({
    control,
    name: `freight_details.freights.${index}`
  })

  const handleRemove = React.useCallback(() => remove(index), [index, remove])

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
              name={`freight_details.freights.${index}.type`}
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
              {...register(`freight_details.freights.${index}.description`)}
            />
          </Grid>

          {/* Pieces */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <TextInput
              label='Pieces'
              variant='outlined'
              type='number'
              fullWidth
              {...register(`freight_details.freights.${index}.pieces`)}
            />
          </Grid>

          {/* Weight */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <TextInput
              label='Weight'
              variant='outlined'
              type='number'
              fullWidth
              {...register(`freight_details.freights.${index}.weight`)}
              helperText={'Vol: 0.00 lbs'}
            />
          </Grid>

          {/* Unit with conversion */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <TextInput
              select
              label='Unit'
              variant='outlined'
              fullWidth
              defaultValue={'lbs'}
              {...register(`freight_details.freights.${index}.unit`)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() =>
                          setValue(
                            `freight_details.freights.${index}.is_converted`,
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
          </Grid>

          {/* Dimensions */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <TextInput
              label='Length'
              variant='outlined'
              fullWidth
              {...register(`freight_details.freights.${index}.length`)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <TextInput
              label='Width'
              variant='outlined'
              fullWidth
              {...register(`freight_details.freights.${index}.width`)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <TextInput
              label='Height'
              variant='outlined'
              fullWidth
              {...register(`freight_details.freights.${index}.height`)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <TextInput
              select
              label='Dim Unit'
              variant='outlined'
              fullWidth
              defaultValue={'in'}
              {...register(`freight_details.freights.${index}.dim_unit`)}
            >
              <MenuItem value='in'>IN</MenuItem>
              <MenuItem value='cm'>CM</MenuItem>
            </TextInput>
          </Grid>

          {/* Not Stack */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <CustomFormControlLabel
              control={
                <Switch
                  {...register(`freight_details.freights.${index}.not_stack`)}
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