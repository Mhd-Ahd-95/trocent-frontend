import React from "react";
import { Grid } from '@mui/material'
import { StyledButton, SubmitButton, TextInput, AccordionComponent } from '../../components'
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function InterlinerForm(props) {

    const { submit, initialValues, editMode } = props
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    const { register,
        reset,
        formState: { errors },
        handleSubmit
    } = useForm({
        defaultValues: {
            name: '',
            contact_name: '',
            phone: '',
            email: '',
            address: '',
            suite: '',
            city: '',
            province: '',
            postal_code: '',
            ...initialValues
        }
    })

    const onSubmit = async (data, e) => {
        e.preventDefault();
        setLoading(true);
        const action = e?.nativeEvent?.submitter?.id;
        try {
            await submit(data);
            if (action === 'apply-interliner-action') {
                navigate('/interliners');
            }
            else {
                reset()
            }
            props.refetch()
        } catch (error) {
            // console.log(error);
            //
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container component={'form'} spacing={2} onSubmit={handleSubmit(onSubmit)}>
            <Grid size={12}>
                <AccordionComponent
                    title='Company Info'
                    bordered={'true'}
                    content={
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextInput
                                    label='Company Name*'
                                    fullWidth
                                    variant="outlined"
                                    {...register('name', { required: 'Company Name is a required field' })}
                                    error={!!errors?.name}
                                    helperText={errors?.name?.message}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextInput
                                    label='Contact Person'
                                    fullWidth
                                    variant="outlined"
                                    {...register('contact_name')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextInput
                                    label='Phone'
                                    fullWidth
                                    variant="outlined"
                                    {...register('phone')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextInput
                                    label='Email'
                                    type='email'
                                    fullWidth
                                    variant="outlined"
                                    {...register('email')}
                                />
                            </Grid>
                        </Grid>
                    }
                />
            </Grid>
            <Grid size={12}>
                <AccordionComponent
                    title='Address'
                    bordered={'true'}
                    content={
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextInput
                                    label='Address'
                                    fullWidth
                                    variant="outlined"
                                    {...register('address')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextInput
                                    label='Suite'
                                    fullWidth
                                    variant="outlined"
                                    {...register('suite')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextInput
                                    label='City'
                                    fullWidth
                                    variant="outlined"
                                    {...register('city')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextInput
                                    label='Province'
                                    fullWidth
                                    placeholder="e.g., ON"
                                    variant="outlined"
                                    {...register('province', {
                                        maxLength: 2
                                    })}
                                    helperText='Enter 2-letter uppercase code'
                                    inputProps={{ maxLength: 2 }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextInput
                                    label='Postal Code'
                                    fullWidth
                                    variant="outlined"
                                    {...register('postal_code')}
                                />
                            </Grid>
                        </Grid>
                    }
                />
            </Grid>
            <Grid size={12}>
                <Grid container spacing={2} justifyContent={'flex-start'}>
                    <Grid size='auto'>
                        <SubmitButton
                            type='submit'
                            variant='contained'
                            color='primary'
                            size='small'
                            textTransform='capitalize'
                            id='apply-interliner-action'
                            isLoading={loading}
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
                                id='save-interliner-action'
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
            </Grid>
        </Grid>
    )
}