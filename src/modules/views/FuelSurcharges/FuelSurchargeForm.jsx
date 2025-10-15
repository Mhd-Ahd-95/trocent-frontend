import React from 'react'
import { Grid } from '@mui/material'
import { StyledButton, SubmitButton, TextInput } from '../../components'
import { useForm, Controller } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'

export default function FuelSurchargeForm(props) {
    const { initialValues, submit, editMode, setOpen } = props
    const [loading, setLoading] = React.useState(false)
    
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            ftl_surcharge: '',
            ltl_surcharge: '',
            from_date: null,
            to_date: null,
            ...initialValues
        }
    })

    const onSubmit = async (data, e) => {
        setLoading(true)
        const action = e?.nativeEvent?.submitter?.id
        data['ltl_surcharge'] = Number(data['ltl_surcharge'])
        data['ftl_surcharge'] = Number(data['ftl_surcharge'])
        try {
            await submit(data);
            if (action === 'apply-fuel-action') {
                setOpen(false)
            }
            else {
                reset()
            }
        } catch (error) {
            // console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <TextInput
                            label='LTL Surcharge %*'
                            fullWidth
                            type='number'
                            inputProps={{ step: "any" }}
                            variant='outlined'
                            {...register('ltl_surcharge', { required: 'LTL is a required field' })}
                            error={!!errors?.ltl}
                            helperText={errors?.ltl?.message}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextInput
                            label='FTL Surcharge%*'
                            fullWidth
                            type='number'
                            inputProps={{ step: "any" }}
                            variant='outlined'
                            {...register('ftl_surcharge', {
                                required: 'FTL is a required field'
                            })}
                            error={!!errors?.ftl}
                            helperText={errors?.ftl?.message}
                        />
                    </Grid>

                    <Grid size={12}>
                        <Controller
                            name={'from_date'}
                            control={control}
                            rules={{ required: `From Date is a required field` }}
                            render={({ field }) => (
                                <DatePicker
                                    label={'From Date*'}
                                    views={['year', 'month', 'day']}
                                    value={field.value ? moment(field.value) : null}
                                    onChange={date => field.onChange(date ? date.toISOString() : null)}
                                    slotProps={{
                                        textField: {
                                            error: !!errors?.from_date,
                                            helperText: errors?.from_date?.message,
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
                    <Grid size={12}>
                        <Controller
                            name={'to_date'}
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    label={'To Date'}
                                    views={['year', 'month', 'day']}
                                    value={field.value ? moment(field.value) : null}
                                    onChange={date => field.onChange(date ? date.toISOString() : null)}
                                    slotProps={{
                                        textField: {
                                            error: !!errors?.to_date,
                                            helperText: errors?.to_date?.message,
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
                </Grid>
            </div>

            <div
                style={{
                    flexShrink: 0,
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#fff',
                    padding: '16px 24px',
                    zIndex: 1
                }}
            >
                <Grid container spacing={2} justifyContent={'flex-start'}>
                    <Grid size='auto'>
                        <SubmitButton
                            id='apply-fuel-action'
                            type='submit'
                            variant='contained'
                            color='primary'
                            size='small'
                            textTransform='capitalize'
                            isLoading={loading}
                        >
                            {!editMode ? 'Create' : 'Save Changes'}
                        </SubmitButton>
                    </Grid>

                    {!editMode && (
                        <Grid size='auto'>
                            <SubmitButton
                                id='save-user-action'
                                type='submit'
                                variant='outlined'
                                color='secondary'
                                size='small'
                                textTransform='capitalize'
                                isLoading={loading}
                            >
                                Save & Create Another
                            </SubmitButton>
                        </Grid>
                    )}

                    <Grid size='auto'>
                        <StyledButton
                            variant='outlined'
                            color='error'
                            size='small'
                            disabled={loading}
                            textTransform='capitalize'
                            onClick={() => reset()}
                        >
                            Reset
                        </StyledButton>
                    </Grid>
                </Grid>
            </div>
        </form>
    )
}
