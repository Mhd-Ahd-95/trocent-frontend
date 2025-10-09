import React from "react";
import { Grid } from '@mui/material'
import { StyledButton, SubmitButton, TextInput, AccordionComponent } from '../../components'
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import global from '../../global'
import auto_cargo from "./autoCargo";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment/moment";

export default function CompanyForm(props) {

    const { submit, initialValues, editMode } = props
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()
    const { _spacing } = global.methods

    const { register,
        reset,
        formState: { errors },
        handleSubmit,
        control
    } = useForm({
        defaultValues: {
            legal_name: '',
            operating_name: '',
            contact_person: '',
            phone: '',
            email: '',

            neq: '',
            nir: '',
            ifta: '',

            auto_insurance_company: '',
            auto_policy_number: '',
            auto_policy_expiry: null,
            auto_insurance_amount: '',
            auto_insurance_company_2: '',
            auto_policy_number_2: '',
            auto_policy_expiry_2: null,
            auto_insurance_amount_2: '',

            cargo_insurance_company: '',
            cargo_policy_number: '',
            cargo_policy_expiry: null,
            cargo_insurance_amount: '',
            cargo_insurance_company_2: '',
            cargo_policy_number_2: '',
            cargo_policy_expiry_2: null,
            cargo_insurance_amount_2: '',

            ...initialValues
        }
    })

    const onSubmit = async (data, e) => {
        e.preventDefault();
        setLoading(true);
        const action = e?.nativeEvent?.submitter?.id;
        try {
            await submit(data);
            if (action === 'apply-company-action') {
                navigate('/companies');
            }
            else {
                reset();    
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
        <Grid container component={'form'} spacing={3} onSubmit={handleSubmit(onSubmit)}>
            <Grid size={12}>
                <AccordionComponent
                    title='Company Information'
                    bordered={'true'}
                    content={
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextInput
                                    label='Legal Name*'
                                    fullWidth
                                    variant="outlined"
                                    {...register('legal_name', { required: 'Legal Name is a required field' })}
                                    error={!!errors?.name}
                                    helperText={errors?.name?.message}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextInput
                                    label='Operating Name'
                                    fullWidth
                                    variant="outlined"
                                    {...register('operating_name')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextInput
                                    label='Contact Person'
                                    fullWidth
                                    variant="outlined"
                                    {...register('contact_person')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextInput
                                    label='Phone'
                                    fullWidth
                                    variant="outlined"
                                    {...register('phone')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextInput
                                    label='Email'
                                    type='email'
                                    fullWidth
                                    variant="outlined"
                                    {...register('email')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextInput
                                    label='NEQ'
                                    fullWidth
                                    variant="outlined"
                                    {...register('neq')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextInput
                                    label='NIR'
                                    fullWidth
                                    variant="outlined"
                                    {...register('nir')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextInput
                                    label='IFTA'
                                    fullWidth
                                    variant="outlined"
                                    {...register('ifta')}
                                />
                            </Grid>
                        </Grid>
                    }
                />
            </Grid>
            {Object.entries(auto_cargo).map(([key, values], index) => (
                <Grid size={12} key={index}>
                    <AccordionComponent
                        defaultExpanded
                        title={_spacing(key)}
                        bordered={'true'}
                        content={
                            <Grid container spacing={2}>
                                {values.map(({ label, field, type }, idx) => (
                                    type === 'date' ?
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                                            <Controller
                                                name={field}
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        label={label}
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
                                        :
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                                            <TextInput
                                                label={label}
                                                type={type === 'number' ? 'number' : 'text'}
                                                fullWidth
                                                variant="outlined"
                                                {...register(field)}
                                            />
                                        </Grid>
                                ))}
                            </Grid>
                        }
                    />
                </Grid>
            ))}
            <Grid size={12}>
                <Grid container spacing={2} justifyContent={'flex-start'}>
                    <Grid size='auto'>
                        <SubmitButton
                            type='submit'
                            variant='contained'
                            color='primary'
                            size='small'
                            textTransform='capitalize'
                            id='apply-company-action'
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
                                id='save-company-action'
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