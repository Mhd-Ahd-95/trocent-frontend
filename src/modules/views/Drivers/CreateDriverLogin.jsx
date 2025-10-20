import React from 'react'
import { Grid } from '@mui/material'
import { StyledButton, SubmitButton, TextInput } from '../../components'
import { useForm } from 'react-hook-form'

export default function DriverLogin(props) {

    const { initialValues, submit, setOpen, editMode } = props
    const [loading, setLoading] = React.useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            username: '',
            email: '',
            role: '',
            password: '',
            ...initialValues
        }
    })

    const onSubmit = async (data, e) => {
        setLoading(true)
        if (editMode && data['password'].length === 0) {
            delete data['password']
        }
        try {
            await submit(data);
            setOpen(false)
        } catch (error) {
            // console.log(error);
            //
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
                            label='Username*'
                            fullWidth
                            type='text'
                            variant='outlined'
                            {...register('username', {
                                required: 'Username is a required field'
                            })}
                            error={!!errors?.username}
                            helperText={errors?.username?.message}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextInput
                            label='Email*'
                            fullWidth
                            variant='outlined'
                            type='email'
                            {...register('email', {
                                required: 'Email is a required field',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            error={!!errors?.email}
                            helperText={errors?.email?.message}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextInput
                            label='Password*'
                            fullWidth
                            variant='outlined'
                            type='password'
                            {...register('password', {
                                required: !editMode ? 'Password is required' : false,
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                },
                                validate: value =>
                                    editMode && value !== '' && value.length < 6
                                        ? 'Password must be at least 6 characters'
                                        : true
                            })}
                            error={!!errors?.password}
                            helperText={errors?.password?.message}
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
                            type='submit'
                            variant='contained'
                            color='primary'
                            size='small'
                            textTransform='capitalize'
                            isLoading={loading}
                        >
                            Submit
                        </SubmitButton>
                    </Grid>

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
