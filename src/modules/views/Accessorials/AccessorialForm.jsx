import React from 'react'
import { Grid, MenuItem, FormControl, Switch } from '@mui/material'
import { StyledButton, SubmitButton, TextInput, CustomFormControlLabel } from '../../components'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import global from '../../global'

export default function AccessorialForm(props) {
    const { initialValues, submit, editMode, setOpen } = props
    const [loading, setLoading] = React.useState(false)
    const { accessorial_types } = global
    const { _spacing } = global.methods

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        control,
        setValue
    } = useForm({
        defaultValues: {
            name: '',
            type: '',
            amount: '',
            is_driver: false,
            amount_type: '',
            min: '',
            max: '',
            package_type: '',
            product_type: '',
            free_time: '',
            time_unit: '',
            base_amount: '',
            ...initialValues
        }
    })

    const onSubmit = async (data, e) => {
        setLoading(true)
        const action = e?.nativeEvent?.submitter?.id
        try {
            await submit(data);
            if (action === 'apply-type-action') {
                setOpen(false)
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
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <TextInput
                            label='Name*'
                            fullWidth
                            type='text'
                            variant='outlined'
                            {...register('name', { required: 'Name is a required field' })}
                            error={!!errors?.name}
                            helperText={errors?.name?.message}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Controller
                            name='type'
                            control={control}
                            rules={{ required: 'Type is a required field' }}
                            render={({ field, fieldState }) => (
                                <TextInput
                                    {...field}
                                    label='Type*'
                                    fullWidth
                                    variant='outlined'
                                    error={!!fieldState?.error}
                                    helperText={fieldState.error?.message}
                                    select
                                    onChange={(e) => {
                                        const value = e.target.value
                                        field.onChange(value)
                                        setValue('amount', '')
                                        setValue('min', '')
                                        setValue('max', '')
                                        setValue('amount_type', '')
                                        setValue('package_type', '')
                                        setValue('product_type', '')
                                        setValue('base_amount', '')
                                        setValue('free_time', '')
                                        setValue('time_unit', '')

                                    }}
                                >
                                    <MenuItem value=''><em>None</em></MenuItem>
                                    {Object.keys(accessorial_types).map((atype) => (
                                        <MenuItem value={atype} key={atype}>{_spacing(atype)}</MenuItem>
                                    ))}
                                </TextInput>
                            )}
                        />
                    </Grid>
                    {watch('type') && accessorial_types[watch('type')] && accessorial_types[watch('type')].map(({ field, label, selected, type, options }) => (
                        <React.Fragment key={field}>
                            {!selected ?
                                <Grid size={12}>
                                    <Controller
                                        name={field}
                                        control={control}
                                        render={({ field }) => (
                                            <TextInput
                                                {...field}
                                                label={label}
                                                fullWidth
                                                type={type ? type : 'text'}
                                                value={field.value || ''}
                                                variant='outlined'
                                            />
                                        )}
                                    />
                                </Grid>
                                :
                                <Grid size={12}>
                                    <Controller
                                        name={field}
                                        control={control}
                                        render={({ field }) => (
                                            <TextInput
                                                {...field}
                                                label={label}
                                                fullWidth
                                                type='text'
                                                variant='outlined'
                                                select
                                                value={field.value || ''}
                                            >
                                                {options.map((option) => (
                                                    <MenuItem value={option} key={option}>{_spacing(option)}</MenuItem>
                                                ))}
                                            </TextInput>
                                        )}
                                    />
                                </Grid>
                            }
                        </React.Fragment>
                    ))}
                    <Grid size={12}>
                        <FormControl>
                            <Controller
                                name="is_driver"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                    <CustomFormControlLabel
                                        control={
                                            <Switch
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        }
                                        label="Visible To Driver"
                                    />
                                )}
                            />
                        </FormControl>
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
                            id='apply-type-action'
                            type='submit'
                            variant='contained'
                            color='primary'
                            size='small'
                            textTransform='capitalize'
                            isLoading={loading}
                        >
                            {!editMode ? 'Create Accessorial' : 'Save Changes'}
                        </SubmitButton>
                    </Grid>

                    {!editMode && (
                        <Grid size='auto'>
                            <SubmitButton
                                id='save-type-action'
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
