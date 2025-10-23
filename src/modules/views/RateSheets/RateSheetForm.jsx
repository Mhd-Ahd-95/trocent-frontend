import React from "react";
import { TextInput, WizardCard, SubmitButton, StyledButton } from '../../components'
import { Grid, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BracketsList from "./BracketsList";


export default function RateSheetForm(props) {

    const { initialValues, submit, editMode } = props
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    const { register,
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        defaultValues: {
            destination: '',
            type: '',
            province: '',
            skid_by_weight: false,
            rate_code: '',
            ltl_code: '',
            min_rate: '',
            priority_sequence: '',
            external: '',
            postal_code: '',
            brackets: [],
            ...initialValues
        }
    })

    const onSubmit = async (data, e) => {
        e.preventDefault()
        setLoading(true)
        const action = e?.nativeEvent?.submitter?.id;
        try {
            await submit(data);
            if (action === 'apply-sheet-action') {
                navigate('/rate-sheets', { state: { customer_id: props.customerID } });
            }
            else {
                reset()
            }
        } catch (error) {
            // console.log(error);
            //
        } finally {
            setLoading(false);
        }
    }



    return (
        <Grid container spacing={2} component={'form'} onSubmit={handleSubmit(onSubmit)}>
            <Grid size={12}>
                <WizardCard title='Rate Info'>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label='Destination*'
                                fullWidth
                                variant="outlined"
                                {...register('destination', { required: 'Destination is a required field' })}
                                error={!!errors?.destination}
                                helperText={errors?.destination?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label='Province'
                                fullWidth
                                variant="outlined"
                                {...register('province')}
                                inputProps={{ maxLength: 2 }}
                                helperText={'Enter 2-letter uppercase code'}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label='Postal Code'
                                fullWidth
                                variant="outlined"
                                {...register('postal_code')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label='Rate Code'
                                fullWidth
                                variant="outlined"
                                {...register('rate_code')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label='Priority Sequence'
                                fullWidth
                                type='number'
                                variant="outlined"
                                {...register('priority_sequence')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Controller
                                name='external'
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        {...field}
                                        label='External'
                                        fullWidth
                                        variant="outlined"
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        select
                                    >
                                        <MenuItem value={''}><em>Select an Option</em></MenuItem>
                                        <MenuItem value='external'>External</MenuItem>
                                        <MenuItem value='internal'>Internal</MenuItem>
                                    </TextInput>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label='Min Rate'
                                fullWidth
                                type='number'
                                variant="outlined"
                                {...register('min_rate')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label='LTL Rate'
                                fullWidth
                                type='number'
                                variant="outlined"
                                {...register('ltl_rate')}
                            />
                        </Grid>
                    </Grid>
                </WizardCard>
            </Grid>
            <Grid size={12}>
                <BracketsList
                    control={control}
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
                            id='apply-sheet-action'
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
                                id='save-sheet-action'
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