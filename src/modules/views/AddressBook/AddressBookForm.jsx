import React from 'react'
import {
    FormHelperText,
    Grid,
    FormControl,
    Switch,
    TextField
} from '@mui/material'
import {
    TextInput,
    CustomFormControlLabel,
    StyledButton,
    SubmitButton,
    FieldSetComponent
} from '../../components'
import { useForm, Controller } from 'react-hook-form'
import { TimePicker } from '@mui/x-date-pickers'
import moment from 'moment'


export default function AddressBookForm(props) {

    const { initialValues, submit, editMode, setOpen } = props
    const [isLoading, setIsLoading] = React.useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            name: '',
            contact_name: '',
            phone_number: '',
            email: '',
            address: '',
            suite: '',
            city: '',
            province: '',
            postal_code: '',
            special_instructions: '',
            op_time_from: null,
            op_time_to: null,
            requires_appointment: false,
            no_waiting_time: false,
            ...initialValues
        }
    })

    const onSubmit = async (data, e) => {
        e.preventDefault()
        setIsLoading(true)
        const action = e?.nativeEvent?.submitter?.id
        try {
            await submit(data);
            if (action === 'apply-address-action') {
                setOpen(false)
            }
            else {
                reset()
            }
        } catch (error) {
            // console.log(error);
            //
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextInput
                            label='Name*'
                            fullWidth
                            {...register('name', {
                                required: 'Name is a required field'
                            })}
                            error={!!errors?.name}
                            variant='outlined'
                            helperText={errors?.name?.message}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextInput
                            label='Contact Person'
                            fullWidth
                            {...register('contact_name')}
                            variant='outlined'
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextInput
                            label='Phone Number'
                            fullWidth
                            {...register('phone_number')}
                            variant='outlined'
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextInput
                            label='Email Address'
                            fullWidth
                            {...register('email')}
                            variant='outlined'
                        />
                    </Grid>
                    <Grid size={12}>
                        <FieldSetComponent title='Address Details'>
                            <Grid container spacing={4} alignItems={'center'}>
                                <Grid size={12}>
                                    <TextInput
                                        label='Street Address*'
                                        fullWidth
                                        {...register('address', {
                                            required: 'Address is a required field'
                                        })}
                                        error={!!errors?.address}
                                        variant='outlined'
                                        helperText={errors?.address?.message}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextInput
                                        label='Suite/Unit'
                                        fullWidth
                                        {...register('suite')}
                                        variant='outlined'
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextInput
                                        label='City*'
                                        fullWidth
                                        {...register('city', {
                                            required: 'City is a required field'
                                        })}
                                        error={!!errors?.city}
                                        variant='outlined'
                                        helperText={errors?.city?.message}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextInput
                                        label='Province*'
                                        fullWidth
                                        {...register('province', {
                                            required: 'Province is a required field',
                                            maxLength: {
                                                value: 2,
                                                message: 'Province must be 2 Character'
                                            },
                                            validate: value => {
                                                value > 2 ? 'Province must be 2 Character' : true
                                            }
                                        })}
                                        inputProps={{ maxLength: 2 }}
                                        error={!!errors?.province}
                                        variant='outlined'
                                        helperText={errors?.province?.message}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextInput
                                        label='Postal Code*'
                                        fullWidth
                                        {...register('postal_code', {
                                            required: 'Postal Code is a required field'
                                        })}
                                        error={!!errors?.postal_code}
                                        variant='outlined'
                                        helperText={errors?.postal_code?.message}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        label='Special Instructions'
                                        variant='outlined'
                                        {...register('special_instructions')}
                                        multiline
                                        minRows={4}
                                        maxRows={4}
                                        fullWidth
                                        sx={{
                                            '& .MuiInputLabel-root': {
                                                fontSize: '13px'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                    <Controller
                                        name='op_time_from'
                                        control={control}
                                        render={({ field }) => (
                                            <TimePicker
                                                {...field}
                                                label='Operating Hours From'
                                                value={field.value ? moment(field.value, 'HH:mm') : null}
                                                onChange={date => field.onChange(date ? moment(date).format('HH:mm') : null)}
                                                ampm={false}
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
                                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                    <Controller
                                        name='op_time_to'
                                        control={control}
                                        render={({ field }) => (
                                            <TimePicker
                                                {...field}
                                                label='Operating Hours To'
                                                value={field.value ? moment(field.value, 'HH:mm') : null}
                                                onChange={date => field.onChange(date ? moment(date).format('HH:mm') : null)}
                                                ampm={false}
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
                                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                    <FormControl>
                                        <CustomFormControlLabel
                                            control={
                                                <Controller
                                                    name='requires_appointment'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Switch
                                                            {...field}
                                                            checked={field.value || false}
                                                            onChange={e => {
                                                                const checked = e.target.checked
                                                                field.onChange(checked)
                                                            }}
                                                        />
                                                    )}
                                                />
                                            }
                                            label='Requires Appointment'
                                        />
                                        <FormHelperText>Check if appointments are required</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                    <FormControl>
                                        <CustomFormControlLabel
                                            control={
                                                <Controller
                                                    name='no_waiting_time'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Switch
                                                            {...field}
                                                            checked={field.value || false}
                                                            onChange={e => {
                                                                const checked = e.target.checked
                                                                field.onChange(checked)
                                                            }}
                                                        />
                                                    )}
                                                />
                                            }
                                            label='No Waiting Time Charges'
                                        />
                                        <FormHelperText>Check to exclude waiting time charges</FormHelperText>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </FieldSetComponent>
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
                            type='submit'
                            variant='contained'
                            color='primary'
                            size='small'
                            textTransform='capitalize'
                            id='apply-address-action'
                            isLoading={isLoading}
                        >
                            {!editMode ? 'Create' : 'Save Changes'}
                        </SubmitButton>
                    </Grid>
                    {!editMode && (
                        <Grid size='auto'>
                            <SubmitButton
                                type='submit'
                                variant='outlined'
                                color='secondary'
                                size='small'
                                textTransform='capitalize'
                                id='save-address-action'
                                isLoading={isLoading}
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
                            disabled={isLoading}
                            textTransform='capitalize'
                            onClick={() => reset()}
                        >
                            Reset
                        </StyledButton>
                    </Grid>
                </Grid>
            </div>
        </form >
    )
}
