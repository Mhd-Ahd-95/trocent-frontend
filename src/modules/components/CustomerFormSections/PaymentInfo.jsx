import React from 'react'
import {
    Grid,
} from '@mui/material'
import { TextInput } from '../../components'
import moment from 'moment'
import { DatePicker } from '@mui/x-date-pickers'
import { Controller } from 'react-hook-form'

function PaymentInfo(props) {

    const { register, control } = props

    return (
        <Grid container spacing={3} pt={3}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput
                    label='Terms of Payment'
                    variant='outlined'
                    fullWidth
                    {...register('terms_of_payment')}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput
                    label='Weight to Pieces Rule'
                    variant='outlined'
                    type='number'
                    inputProps={{ step: "any" }}
                    fullWidth
                    {...register('weight_pieces_rule')}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput
                    label='Fuel Surcharge Rule'
                    variant='outlined'
                    type='number'
                    inputProps={{ step: "any" }}
                    fullWidth
                    {...register('fuel_surcharge_rule')}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Controller
                    name={'opening_date'}
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label={'Account Opening Date'}
                            views={['year', 'month', 'day']}
                            value={field.value ? moment(field.value) : null}
                            onChange={date => field.onChange(date ? date.toISOString() : null)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
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
                    name={'last_invoice_date'}
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label={'Last Invoice Date'}
                            views={['year', 'month', 'day']}
                            value={field.value ? moment(field.value) : null}
                            onChange={date => field.onChange(date ? date.toISOString() : null)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
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
                    name={'last_payment_date'}
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label={'Last Payment Date'}
                            views={['year', 'month', 'day']}
                            value={field.value ? moment(field.value) : null}
                            onChange={date => field.onChange(date ? date.toISOString() : null)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
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
                <TextInput
                    label='Credit Limit'
                    type='number'
                    variant='outlined'
                    fullWidth
                    inputProps={{ step: 'any' }}
                    {...register('credit_limit')}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput
                    label='Account Balance'
                    type='number'
                    variant='outlined'
                    fullWidth
                    inputProps={{ step: 'any' }}
                    {...register('account_balance')}
                />
            </Grid>

        </Grid>
    )
}

export default React.memo(PaymentInfo)
