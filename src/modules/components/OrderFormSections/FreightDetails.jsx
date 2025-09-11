import React from 'react'
import {
  Grid,
  Autocomplete,
  FormControl,
  Switch,
  Typography,
  Button,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AccordionComponent, StyledButton } from '../../components'
import { Controller, useFieldArray } from 'react-hook-form'
import { Add, Calculate, Sync } from '@mui/icons-material'
import TextInput from '../CustomComponents/TextInput'
import CustomFormControlLabel from '../CustomComponents/FormControlLabel'

export default function FreightDetails (props) {
  const { control, register, watch } = props
  const theme = useTheme()
  const [converted, setConverted] = React.useState(false)
  const [mode, setMode] = React.useState(false)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'freight_details.freights'
  })

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
              <AccordionComponent
                fieldsLength={fields.length}
                handleDelete={() => remove(index)}
                key={item.id}
                title={`${watch(
                  `freight_details.freights.${index}.type`
                )}: ${watch(
                  `freight_details.freights.${index}.pieces`
                )} pcs, ${watch(
                  `freight_details.freights.${index}.weight`
                )} ${watch(
                  `freight_details.freights.${index}.unit`
                )?.toLowerCase()}`}
                content={
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                      <Controller
                        name={`freight_details.freights.${index}.type`}
                        control={control}
                        rules={{ required: 'Type is a required field' }}
                        render={({ field, fieldState }) => (
                          <Autocomplete
                            {...field}
                            options={['Skid', 'Box', 'Envelope']}
                            onChange={(_, value) => field.onChange(value)}
                            defaultValue={'Skid'}
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
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                      <TextInput
                        label='Description'
                        variant='outlined'
                        fullWidth
                        {...register(
                          `freight_details.freights.${index}.description`
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                      <TextInput
                        label='Pieces'
                        variant='outlined'
                        type='number'
                        fullWidth
                        {...register(
                          `freight_details.freights.${index}.pieces`
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                      <TextInput
                        label='Weight'
                        variant='outlined'
                        type='number'
                        fullWidth
                        {...register(
                          `freight_details.freights.${index}.weight`
                        )}
                        helperText={'Vol: 0.00 lbs'}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                      <TextInput
                        select
                        label='Unit'
                        variant='outlined'
                        fullWidth
                        {...register(`freight_details.freights.${index}.unit`)}
                        defaultValue={'lbs'}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  onClick={() => setConverted(!converted)}
                                  color={converted ? 'success' : 'default'}
                                >
                                  <Sync />
                                </IconButton>
                              </InputAdornment>
                            )
                          }
                        }}
                        helperText={converted ? 'Conv.: ON' : 'Conv.: OFF'}
                        sx={{
                          position: 'relative',
                          '& button': {
                            borderLeft: `1px solid ${theme.palette.grey[200]}`,
                            borderRadius: 0,
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            height: '100%',
                            // marginLeft: 2,
                            '& svg': {
                              fontSize: 18,
                              marginTop: 0.3
                            }
                          },
                          '& .MuiSelect-icon': {
                            position: 'absolute',
                            top: 14,
                            right: 35,
                            fontSize: 20
                            // marginRight: 4
                          }
                        }}
                      >
                        <MenuItem value='lbs'>LBS</MenuItem>
                        <MenuItem value='kg'>KG</MenuItem>
                      </TextInput>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                      <TextInput
                        label='Length'
                        variant='outlined'
                        fullWidth
                        {...register(
                          `freight_details.freights.${index}.length`
                        )}
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
                        {...register(
                          `freight_details.freights.${index}.height`
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                      <TextInput
                        select
                        label='Dim Unit'
                        variant='outlined'
                        fullWidth
                        {...register(
                          `freight_details.freights.${index}.dim_unit`
                        )}
                        defaultValue={'in'}
                      >
                        <MenuItem value='in'>IN</MenuItem>
                        <MenuItem value='cm'>CM</MenuItem>
                      </TextInput>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                      <FormControl>
                        <CustomFormControlLabel
                          control={
                            <Switch
                              {...register(
                                `freight_details.freights.${index}.not_stack`
                              )}
                            />
                          }
                          label='Not Stack'
                          sx={{
                            '& span': {
                              fontSize: 12,
                              whiteSpace: 'nowrap'
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                }
                icons
              />
            ))}
          </Grid>
          <Grid size={12}>
            <Grid container justifyContent={'center'} alignItems={'center'}>
              <Grid size='auto'>
                <Button
                  startIcon={<Add />}
                  sx={{ textTransform: 'capitalize' }}
                  onClick={() =>
                    append({
                      type: '',
                      description: '',
                      Pieces: 1,
                      weight: '',
                      units: '',
                      length: '',
                      width: '',
                      height: '',
                      dim_unit: '',
                      not_stack: false
                    })
                  }
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
                  value={watch('freight_details.freights')
                    .map(freight => freight.pieces)
                    .reduce((acc, pcs) => (acc += Number(pcs)), 0)}
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
                  value={
                    watch('freight_details.freights').filter(
                      freight => freight.type === 'Skid'
                    )?.length
                  }
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
                  value={watch('freight_details.freights')
                    .map(freight => freight.weight)
                    ?.reduce((acc, pcs) => (acc += Number(pcs)), 0)
                    ?.toFixed(2)}
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
                  value={watch('freight_details.freights')
                    .map(freight => freight.weight)
                    ?.reduce((acc, pcs) => (acc += Number(pcs)), 0)
                    ?.toFixed(2)}
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
                  value={watch('freight_details.freights')
                    .map(freight => freight.weight)
                    ?.reduce((acc, pcs) => (acc += Number(pcs)), 0)
                    ?.toFixed(2)}
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
