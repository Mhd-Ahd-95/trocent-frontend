import React from 'react'
import {
  Grid,
  FormControl,
  Switch,
  Typography,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  AccordionComponent,
  TextInput,
  CustomFormControlLabel
} from '../../components'
import { useFieldArray } from 'react-hook-form'
import { Add, AttachMoney, Delete } from '@mui/icons-material'
import global from '../../global'

export default function OrderForm (props) {
  const { register, watch, control, errors } = props
  const { formatAccessorial } = global.methods
  const theme = useTheme()

  const {
    fields: additionalServiceCharges,
    append: appendServiceCharge,
    remove: removeServiceCharge
  } = useFieldArray({
    control,
    name: 'freight_charges.additional_service_charges'
  })

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <FormControl>
          <CustomFormControlLabel
            control={<Switch {...register('freight_charges.no_charges')} />}
            label='No Charges'
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <FormControl>
          <CustomFormControlLabel
            control={<Switch {...register('freight_charges.manual_charges')} />}
            label='Manual Charges'
            sx={{
              whiteSpace: 'nowrap'
            }}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <FormControl>
          <CustomFormControlLabel
            control={
              <Switch {...register('freight_charges.manual_fuel_surcharge')} />
            }
            label='Manual Fuel Surcharges'
          />
        </FormControl>
      </Grid>
      {!watch('freight_charges.no_charges') && (
        <Grid size={12}>
          <Grid
            container
            sx={{
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 3
            }}
          >
            <Grid
              size={12}
              sx={{
                borderBottom: `1px solid ${theme.palette.grey[200]}`,
                py: 2,
                px: 3
              }}
            >
              <Typography
                component={'p'}
                sx={{ fontSize: 15, fontWeight: 600 }}
              >
                Freight & Charges
              </Typography>
            </Grid>
            <Grid size={12}>
              <Grid container spacing={2} p={3}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextInput
                    label='Freight Rate'
                    variant='outlined'
                    fullWidth
                    type='number'
                    {...register('freight_charges.freight_rate')}
                    disabled={!watch('freight_charges.manual_charges')}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='start'>
                            <AttachMoney />
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextInput
                    label='Fuel Surcharge'
                    variant='outlined'
                    fullWidth
                    type='number'
                    {...register('freight_charges.fuel_surcharge')}
                    disabled={!watch('freight_charges.manual_fuel_surcharge')}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='start'>
                            <AttachMoney />
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid size={12}>
        <Grid
          container
          sx={{
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 2
          }}
        >
          <Grid
            size={12}
            sx={{
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
              py: 1,
              px: 2
            }}
          >
            <Typography component={'p'} sx={{ fontSize: 16, fontWeight: 600 }}>
              Customer Accessorial Charges
            </Typography>
            <Typography variant='caption' color='textSecondary' fontSize={14}>
              Customer-specific accessorial charges and fees
            </Typography>
          </Grid>
          {watch('client_info.customer') &&
            watch('client_info.customer')?.accessorials && (
              <Grid size={12} sx={{ py: 2, px: 3 }}>
                <Grid container spacing={2}>
                  {watch('client_info.customer')?.accessorials.map(
                    (access, index) => (
                      <Grid
                        container
                        spacing={2}
                        key={index}
                        sx={{
                          border: `1px solid ${theme.palette.grey[200]}`,
                          py: 2,
                          px: 2,
                          borderRadius: 3
                        }}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                          <Typography
                            variant='caption'
                            sx={{ fontSize: 12, fontWeight: 400 }}
                          >
                            {formatAccessorial(
                              access.accessorial_name,
                              access.amount
                            )}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                          <FormControl>
                            <CustomFormControlLabel
                              control={
                                <Switch
                                  {...register(
                                    `freight_charges.customer_accessorials.${index}.is_included`
                                  )}
                                />
                              }
                              label='Is included'
                            />
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2 }} pl={2}>
                          <TextInput
                            label='Qty'
                            variant='outlined'
                            fullWidth
                            size='small'
                            {...register(
                              `freight_charges.customer_accessorials.${index}.quantity`
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                          <TextInput
                            label='Amount'
                            variant='outlined'
                            fullWidth
                            size='small'
                            {...register(
                              `freight_charges.customer_accessorials.${index}.amount`
                            )}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <AttachMoney />
                                  </InputAdornment>
                                )
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    )
                  )}
                </Grid>
              </Grid>
            )}
          <Grid size={12} sx={{ py: 2, px: 3 }}>
            <AccordionComponent
              defaultExpanded
              title='Additional Service Charges'
              subtitle='Add Custom charges not covered by standard accessorials'
              content={
                <Grid container spacing={2} justifyContent={'center'}>
                  {additionalServiceCharges.map((serviceCharge, index) => (
                    <Grid size={12} key={serviceCharge.id}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12, md: 5 }}>
                          <TextInput
                            size='small'
                            label='Charge Name'
                            variant='outlined'
                            fullWidth
                            {...register(
                              `freight_charges.additional_service_charges.${index}.charge_name`
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3, md: 2 }}>
                          <TextInput
                            size='small'
                            label='Quantity'
                            variant='outlined'
                            type='number'
                            fullWidth
                            {...register(
                              `freight_charges.additional_service_charges.${index}.charge_quantity`
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8, md: 4 }}>
                          <TextInput
                            size='small'
                            label='Amount'
                            variant='outlined'
                            type='number'
                            fullWidth
                            {...register(
                              `freight_charges.additional_service_charges.${index}.charge_amount`
                            )}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <AttachMoney />
                                  </InputAdornment>
                                )
                              }
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2, md: 1 }}>
                          <IconButton
                            color='error'
                            onClick={() => removeServiceCharge(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid size='auto'>
                    <Button
                      variant='text'
                      color='primary'
                      startIcon={<Add />}
                      sx={{
                        textTransform: 'capitalize',
                        fontWeight: 600
                      }}
                      onClick={() =>
                        appendServiceCharge({
                          charge_name: '',
                          charge_quantity: 1,
                          charge_amount: ''
                        })
                      }
                    >
                      Add Service Charge
                    </Button>
                  </Grid>
                </Grid>
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid
          container
          sx={{
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: 2
          }}
        >
          <Grid
            size={12}
            sx={{
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
              p: 2
            }}
          >
            <Typography component={'p'} sx={{ fontSize: 16, fontWeight: 600 }}>
              Order Summary
            </Typography>
          </Grid>
          <Grid size={12} sx={{ p: 2 }}>
            <Grid
              container
              sx={{
                border: `1px solid ${theme.palette.grey[200]}`,
                borderRadius: 2
              }}
            >
              <Grid
                size={12}
                sx={{
                  borderBottom: `1px solid ${theme.palette.grey[200]}`,
                  px: 2,
                  py: 1
                }}
              >
                <Typography
                  component={'p'}
                  sx={{ fontSize: 15, fontWeight: 600 }}
                >
                  Weight Calculations
                </Typography>
              </Grid>
              <Grid size={12} sx={{ p: 2 }}>
                <Grid container spacing={2} sx={{ px: 2, py: 1 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextInput
                      label='Actual Weight'
                      variant='outlined'
                      fullWidth
                      type='number'
                      {...register(
                        'freight_charges.order_summary.weight_calculation.actual_weight'
                      )}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment
                              position='end'
                              sx={{
                                '& p': {
                                  fontSize: 12
                                }
                              }}
                            >
                              LBS
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextInput
                      label='Volume Weight'
                      variant='outlined'
                      fullWidth
                      type='number'
                      {...register(
                        'freight_charges.order_summary.weight_calculation.volume_weight'
                      )}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment
                              position='end'
                              sx={{
                                '& p': {
                                  fontSize: 12
                                }
                              }}
                            >
                              LBS
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextInput
                      label='Chargeable Weight'
                      variant='outlined'
                      fullWidth
                      type='number'
                      {...register(
                        'freight_charges.order_summary.weight_calculation.chargeable_weight'
                      )}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment
                              position='end'
                              sx={{
                                '& p': {
                                  fontSize: 12
                                }
                              }}
                            >
                              LBS
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <TextInput
                      label='Total Pieces'
                      variant='outlined'
                      type='number'
                      fullWidth
                      {...register(
                        'freight_charges.order_summary.weight_calculation.total_pieces'
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <TextInput
                      label='Weight (KG)'
                      variant='outlined'
                      type='number'
                      fullWidth
                      {...register(
                        'freight_charges.order_summary.weight_calculation.weight_kg'
                      )}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment
                              position='end'
                              sx={{
                                '& p': {
                                  fontSize: 12
                                }
                              }}
                            >
                              KG
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12} mt={2}>
              <Grid
                container
                sx={{
                  border: `1px solid ${theme.palette.grey[200]}`,
                  borderRadius: 2
                }}
              >
                <Grid
                  size={12}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    py: 1,
                    px: 2
                  }}
                >
                  <Typography
                    component={'p'}
                    sx={{ fontSize: 15, fontWeight: 600 }}
                  >
                    Pricing Breakdown
                  </Typography>
                </Grid>
                <Grid size={12} sx={{ py: 3, px: 4 }}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                      <TextInput
                        label='Freight Rate'
                        fullWidth
                        variant='outlined'
                        {...register(
                          'freight_charges.order_summary.pricing_breakdown.freight_rate'
                        )}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment sx={{ '& p': { fontSize: 12 } }}>
                                $
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                      <TextInput
                        label='Fuel Surcharge'
                        fullWidth
                        variant='outlined'
                        {...register(
                          'freight_charges.order_summary.pricing_breakdown.fuel_surcharge'
                        )}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment sx={{ '& p': { fontSize: 12 } }}>
                                $
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextInput
                        label='Sub Total'
                        fullWidth
                        variant='outlined'
                        {...register(
                          'freight_charges.order_summary.pricing_breakdown.sub_total'
                        )}
                        size='large'
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment sx={{ '& p': { fontSize: 13 } }}>
                                $
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                      <TextInput
                        label='Provincial Tax'
                        fullWidth
                        variant='outlined'
                        {...register(
                          'freight_charges.order_summary.pricing_breakdown.provincial_tax'
                        )}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment sx={{ '& p': { fontSize: 12 } }}>
                                $
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                      <TextInput
                        label='Federal Tax'
                        fullWidth
                        variant='outlined'
                        {...register(
                          'freight_charges.order_summary.pricing_breakdown.federal_tax'
                        )}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment sx={{ '& p': { fontSize: 12 } }}>
                                $
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextInput
                        label='Grand Tax'
                        fullWidth
                        variant='outlined'
                        {...register(
                          'freight_charges.order_summary.pricing_breakdown.grand_tax'
                        )}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment sx={{ '& p': { fontSize: 12 } }}>
                                $
                              </InputAdornment>
                            )
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
