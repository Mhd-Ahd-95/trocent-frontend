import React from 'react'
import { Grid, CircularProgress, Switch, FormControl, Autocomplete, MenuItem, TextField, Typography, Button, RadioGroup, Box, Divider, Stack, FormControlLabel, Radio, FormHelperText, Tooltip } from '@mui/material'
import { TextInput, StyledButton, SubmitButton, AccordionComponent, CustomFormControlLabel } from '../../components'
import initialInputs from './initialInputs'
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form'
import global from '../../global'
import { useCompanies } from '../../hooks/useComapnies'
import { DatePicker } from '@mui/x-date-pickers'
import { v4 as uuidv4 } from "uuid";
import { Add, AccessTime, LocalGasStation, DirectionsCar } from '@mui/icons-material'
import DriverDocument from './DriverDocument'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export default function DriverForm(props) {

    const navigate = useNavigate()
    const { initialValues, submit, editMode } = props
    const { _spacing } = global.methods
    const [loading, setLoading] = React.useState(false)
    const { isLoading, data } = useCompanies()

    const { register, control, formState: { errors }, reset, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            driver_number: '',
            fname: '',
            lname: '',
            mname: '',
            dob: null,
            gender: '',
            sin: '',
            company_id: '',
            phone: '',
            email: '',
            address: '',
            province: '',
            city: '',
            postal_code: '',
            suite: '',
            license_number: '',
            license_classes: '',
            license_expiry: null,
            tdg: false,
            tdg_expiry: null,
            criminal_expiry: null,
            criminal_note: '',
            contract_type: '',
            driver_description: '',
            driver_pay_type: '',
            commission_percentage: 0,
            hourly_rate: 0,
            rate_per_km: 0,
            mileage_allotment: 0,
            mileage_allotment_type: 'daily',
            fca_override: 0,
            use_fca_override: false,
            fuel_surcharge_type: '',
            driver_documents: [],
            ...initialValues
        }
    })

    const onSubmit = async (data, e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData()
        data.driver_documents.forEach((doc, index) => {
            if (doc.file_path && !doc.file) {
                const { file, ...rest } = doc;
                Object.entries(rest).forEach(([k, v]) => {
                    formData.append(`driver_documents[${index}][${k}]`, v);
                });
            } else if (doc.file instanceof File) {
                Object.entries(doc).forEach(([k, v]) => {
                    formData.append(`driver_documents[${index}][${k}]`, v);
                });
            }
        });
        for (let [key, value] of Object.entries(data)) {
            if (key === 'driver_documents') continue;
            if (value === '') value = null
            if (key === 'commission_percentage' || key === 'hourly_rate' || key === 'mileage_allotment' || key === 'rate_per_km') {
                if (value === '') value = 0
            }
            formData.append(key, value);
        }
        const action = e?.nativeEvent?.submitter?.id;
        try {
            await submit(formData);
            if (action === 'apply-driver-action') {
                navigate('/drivers', { state: { fromEditOrCreate: true } });
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
    };

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'driver_documents'
    })

    const handleAddDoc = React.useCallback(() => {
        append({
            type: '',
            file: '',
            expiry_date: null
        })
    }, [append])

    const driverPerType = useWatch({ control, name: 'driver_pay_type' })

    return (
        <Grid container spacing={3} component={'form'} onSubmit={handleSubmit(onSubmit)}>
            {initialInputs && Object.entries(initialInputs).map(([key, values]) => {
                return (
                    <Grid size={12} key={uuidv4()}>
                        <AccordionComponent
                            bordered={'true'}
                            bold={600}
                            title={_spacing(key)}
                            content={
                                <Grid container spacing={2}>
                                    {values.map(({ label, field, required, selected, autoComplete, multiline, inputProps, md, options, type, helperText }) => {
                                        return (
                                            <React.Fragment key={uuidv4()}>
                                                {selected && options?.length > 0 ?
                                                    <Grid size={{ xs: 12, sm: 6, md: md }} key={uuidv4()}>
                                                        <Controller
                                                            name={field}
                                                            control={control}
                                                            rules={required ? { required: `${_spacing(field)} is a required field` } : {}}
                                                            render={({ field: controllerField }) => (
                                                                <TextInput
                                                                    {...controllerField}
                                                                    label={label}
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    error={!!errors[field]}
                                                                    value={controllerField.value ?? ""}
                                                                    helperText={errors[field]?.message}
                                                                    select
                                                                >
                                                                    <MenuItem value={''}><em>Select an option</em></MenuItem>
                                                                    {options.map((option) => (
                                                                        <MenuItem value={option} key={uuidv4()}>{_spacing(option)}</MenuItem>
                                                                    ))}
                                                                </TextInput>
                                                            )}
                                                        />
                                                    </Grid>
                                                    : type === 'switch' ?
                                                        <Grid size={{ xs: 12, sm: 6, md: md }} key={uuidv4()}>
                                                            <FormControl>
                                                                <CustomFormControlLabel
                                                                    control={
                                                                        <Controller
                                                                            name={field}
                                                                            control={control}
                                                                            render={({ field: controllerField }) => (
                                                                                <Switch
                                                                                    {...controllerField}
                                                                                    checked={controllerField.value || false}
                                                                                    onChange={e => {
                                                                                        const checked = e.target.checked
                                                                                        controllerField.onChange(checked)
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        />
                                                                    }
                                                                    label={label}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        : autoComplete ?
                                                            <Grid size={{ xs: 12, sm: 6, md: md }} key={uuidv4()}>
                                                                <Controller
                                                                    name={field}
                                                                    control={control}
                                                                    rules={required ? { required: `${_spacing(field)} is a required field` } : {}}
                                                                    render={({ field: controllerField }) => {
                                                                        return (
                                                                            <Autocomplete
                                                                                // open={openAutoComplete}
                                                                                // onOpen={handleAutoCompleteOepn}
                                                                                // onClose={() => setOpenAutoComplete(false)}
                                                                                options={data || []}
                                                                                loading={isLoading}
                                                                                getOptionLabel={(option) => option.operating_name || ""}
                                                                                isOptionEqualToValue={(option, value) => option.id === value}
                                                                                value={data?.find((c) => c.id === Number(controllerField.value)) || ''}
                                                                                onChange={(e, newValue) => {
                                                                                    const value = newValue?.id ?? ''
                                                                                    controllerField.onChange(value);
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <TextInput
                                                                                        {...params}
                                                                                        label={label}
                                                                                        fullWidth
                                                                                        variant="outlined"
                                                                                        error={!!errors[field]}
                                                                                        helperText={errors[field]?.message}
                                                                                        slotProps={{
                                                                                            input: {
                                                                                                ...params.InputProps,
                                                                                                endAdornment: (
                                                                                                    <>
                                                                                                        {isLoading ? (
                                                                                                            <CircularProgress color="inherit" size={20} />
                                                                                                        ) : null}
                                                                                                        {params.InputProps.endAdornment}
                                                                                                    </>
                                                                                                ),
                                                                                            },
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            />
                                                                        )
                                                                    }}
                                                                />
                                                            </Grid>
                                                            : type === 'date' ?
                                                                <Grid size={{ xs: 12, sm: 6, md: md }}>
                                                                    <Controller
                                                                        name={field}
                                                                        control={control}
                                                                        rules={required ? { required: `${_spacing(field)} is a required field` } : {}}
                                                                        render={({ field: controllerField }) => (
                                                                            <DatePicker
                                                                                label={label}
                                                                                views={['year', 'month', 'day']}
                                                                                value={controllerField.value ? moment(controllerField.value) : null}
                                                                                onChange={date => controllerField.onChange(date ? moment(date).format('YYYY-MM-DD') : null)}
                                                                                slotProps={{
                                                                                    textField: {
                                                                                        error: !!errors[field],
                                                                                        helperText: errors[field]?.message,
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
                                                                : multiline ?
                                                                    <Grid size={{ xs: 12, sm: 6, md: md }}>
                                                                        <Controller
                                                                            name={field}
                                                                            control={control}
                                                                            rules={required ? { required: `${_spacing(field)} is a required field` } : {}}
                                                                            render={({ field: controllerField }) => (
                                                                                <TextField
                                                                                    {...controllerField}
                                                                                    label={label}
                                                                                    variant='outlined'
                                                                                    fullWidth
                                                                                    value={controllerField.value ?? ''}
                                                                                    inputProps={{ ...inputProps }}
                                                                                    error={!!errors[field]}
                                                                                    multiline
                                                                                    minRows={3}
                                                                                    maxRows={3}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                    :
                                                                    <Grid size={{ xs: 12, sm: 6, md: md }} key={uuidv4()}>
                                                                        <Controller
                                                                            name={field}
                                                                            control={control}
                                                                            rules={required ? { required: `${_spacing(field)} is a required field` } : {}}
                                                                            render={({ field: controllerField }) => (
                                                                                <TextInput
                                                                                    {...controllerField}
                                                                                    label={label}
                                                                                    variant='outlined'
                                                                                    fullWidth
                                                                                    value={controllerField.value ?? ''}
                                                                                    inputProps={{ ...inputProps }}
                                                                                    error={!!errors[field]}
                                                                                    helperText={helperText ? helperText : errors[field]?.message}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                }
                                            </React.Fragment>
                                        )
                                    })}
                                </Grid>
                            }
                        />
                    </Grid>
                )
            })}

            <Grid size={12}>
                <AccordionComponent
                    bordered='true'
                    bold={600}
                    title='Driver Pay Type'
                    content={
                        <Controller
                            name='driver_pay_type'
                            control={control}
                            render={({ field: payTypeField }) => (
                                <>
                                    <RadioGroup
                                        {...payTypeField}
                                        value={payTypeField.value || ''}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            payTypeField.onChange(value)
                                            if (value === 'hourly') {
                                                setValue('commission_percentage', 0)
                                                setValue('mileage_allotment_type', 'daily')
                                            }
                                            else if (value === 'commission') {
                                                setValue('hourly_rate', 0)
                                                setValue('rate_per_km', 0)
                                                setValue('mileage_allotment', 0)
                                                setValue('fuel_surcharge_type', '')
                                                setValue('fca_override', 0)
                                                setValue('use_fca_override', false)
                                                setValue('mileage_allotment_type', '')
                                            }
                                            else {
                                                setValue('commission_percentage', 0)
                                                setValue('hourly_rate', 0)
                                                setValue('rate_per_km', 0)
                                                setValue('mileage_allotment', 0)
                                                setValue('fuel_surcharge_type', '')
                                            }
                                        }}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
                                                <Box sx={{ border: '1px solid', borderColor: driverPerType === 'hourly' ? 'primary.main' : 'divider', borderRadius: 3, height: '100%' }}>
                                                    <FormControlLabel value='hourly' control={<Radio />} label='Hourly' sx={{ m: 0 }} />
                                                    <Grid container spacing={3} sx={{ mt: 1, p: 2 }}>
                                                        <Grid size={{ xs: 12, sm: 6 }}>
                                                            <Controller
                                                                name='hourly_rate'
                                                                control={control}
                                                                defaultValue={0}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        {...field}
                                                                        label='Hourly Rate $'
                                                                        type='number'
                                                                        disabled={driverPerType !== 'hourly'}
                                                                        variant='outlined'
                                                                        fullWidth
                                                                        onChange={(e) => {
                                                                            const value = e.target.value
                                                                            if (value === '') field.onChange('')
                                                                            if (value < 0) return
                                                                            else field.onChange(Number(value))
                                                                        }}
                                                                        onFocus={(e) => e.target.select()}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, sm: 6 }}>
                                                            <Controller
                                                                name='rate_per_km'
                                                                control={control}
                                                                defaultValue={0}
                                                                render={({ field }) => (
                                                                    <TextInput {...field} label='Rate per KM / Mile' type='number' variant='outlined' fullWidth
                                                                        onChange={(e) => {
                                                                            const value = e.target.value
                                                                            if (value === '') field.onChange('')
                                                                            else if (value < 0) return
                                                                            else field.onChange(Number(value))
                                                                        }}
                                                                        disabled={driverPerType !== 'hourly'}
                                                                        onFocus={(e) => e.target.select()} />
                                                                )}
                                                            />
                                                        </Grid>

                                                        <Grid size={12}>
                                                            <Divider sx={{ mb: 1.5 }} />
                                                            <Stack direction='row' alignItems='center' spacing={0.75} sx={{ mb: 1 }}>
                                                                <Typography variant='body2' fontWeight={500} color='text.secondary'>
                                                                    Mileage Allotment
                                                                </Typography>
                                                            </Stack>
                                                            <Grid container spacing={2} sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', p: 2 }}>
                                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                                    <Controller
                                                                        name='mileage_allotment'
                                                                        control={control}
                                                                        defaultValue={0}
                                                                        render={({ field }) => (
                                                                            <TextInput {...field} label='Amount' type='number' variant='outlined' fullWidth
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value
                                                                                    if (value === '') field.onChange('')
                                                                                    else if (value < 0) return
                                                                                    else field.onChange(Number(value))
                                                                                }}
                                                                                disabled={driverPerType !== 'hourly'}
                                                                                onFocus={(e) => e.target.select()} />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                                    <Controller
                                                                        name='mileage_allotment_type'
                                                                        control={control}
                                                                        defaultValue='daily'
                                                                        render={({ field }) => (
                                                                            <RadioGroup {...field} sx={{ width: '100%', height: '100%' }} row>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                                                                        <FormControlLabel value='daily' control={<Radio size='small' disabled={driverPerType !== 'hourly'} />} label='daily' />
                                                                                    </Grid>
                                                                                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                                                                        <FormControlLabel value='weekly' control={<Radio size='small' disabled={driverPerType !== 'hourly'} />} label='weekly' />
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </RadioGroup>
                                                                        )}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid size={12}>
                                                            <Divider sx={{ mb: 1.5 }} />
                                                            <Stack direction='row' alignItems='center' spacing={0.75} sx={{ mb: 1 }}>
                                                                <Typography variant='body2' fontWeight={500} color='text.secondary'>
                                                                    Fuel Override
                                                                </Typography>
                                                            </Stack>
                                                            <Grid container spacing={2} alignItems='center' sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', p: 2 }} >
                                                                <Grid size={8}>
                                                                    <Controller
                                                                        name='fca_override'
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <TextInput {...field} label='FCA' type='number' variant='outlined' fullWidth
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value
                                                                                    if (value === '') field.onChange('')
                                                                                    else if (value < 0) return
                                                                                    else field.onChange(Number(value))
                                                                                }}
                                                                                disabled={driverPerType !== 'hourly'}
                                                                                onFocus={(e) => e.target.select()} />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid size={4}>
                                                                    <FormControl>
                                                                        <CustomFormControlLabel
                                                                            control={
                                                                                <Controller
                                                                                    name={'use_fca_override'}
                                                                                    control={control}
                                                                                    render={({ field: controllerField }) => (
                                                                                        <Switch
                                                                                            {...controllerField}
                                                                                            checked={controllerField.value || false}
                                                                                            onChange={e => controllerField.onChange(e.target.checked)}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            }
                                                                            label='Use FCA'
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid size={12}>
                                                            <Divider sx={{ mb: 1.5 }} />
                                                            <Stack direction='row' alignItems='center' spacing={0.75} sx={{ mb: 0.5 }}>
                                                                <Typography variant='body2' fontWeight={500} color='text.secondary'>
                                                                    Fuel Surcharge
                                                                </Typography>
                                                            </Stack>
                                                            <Controller
                                                                name='fuel_surcharge_type'
                                                                control={control}
                                                                defaultValue='none'
                                                                render={({ field }) => (
                                                                    <RadioGroup {...field} sx={{ width: '100%' }}>
                                                                        <Grid container spacing={1}>
                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                <FormControlLabel value='' control={<Radio size='small' disabled={driverPerType !== 'hourly'} />} label='None' />
                                                                            </Grid>
                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                <FormControlLabel value='hourly' control={<Radio size='small' disabled={driverPerType !== 'hourly'} />} label='Hourly' />
                                                                            </Grid>
                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                <FormControlLabel value='mileage' control={<Radio size='small' disabled={driverPerType !== 'hourly'} />} label='Mileage' />
                                                                            </Grid>
                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                <FormControlLabel value='both' control={<Radio size='small' disabled={driverPerType !== 'hourly'} />} label='Both' />
                                                                            </Grid>
                                                                        </Grid>
                                                                    </RadioGroup>
                                                                )}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                                                <Box sx={{ border: '1px solid', borderColor: driverPerType === 'commission' ? 'primary.main' : 'divider', borderRadius: 3, height: '100%' }}>
                                                    <FormControlLabel value='commission' control={<Radio />} label='Commission' sx={{ m: 0 }} />
                                                    <Grid container spacing={3} sx={{ mt: 1, p: 2 }}>
                                                        <Grid size={12}>
                                                            <Controller
                                                                name='commission_percentage'
                                                                control={control}
                                                                defaultValue={0}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        {...field}
                                                                        label='Percentage %'
                                                                        type='number'
                                                                        disabled={driverPerType !== 'commission'}
                                                                        onFocus={(e) => e.target.select()}
                                                                        variant='outlined'
                                                                        fullWidth
                                                                        onChange={(e) => {
                                                                            const value = e.target.value
                                                                            if (value === '') field.onChange('')
                                                                            else if (value > 100 || value < 0) return
                                                                            else field.onChange(Number(value))
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                                                <Box sx={{ border: '1px solid', borderColor: driverPerType === '' ? 'primary.main' : 'divider', borderRadius: 3, height: '100%' }}>
                                                    <FormControlLabel value='' control={<Radio />} label='None' sx={{ m: 0 }} />
                                                </Box>
                                            </Grid>

                                        </Grid>
                                    </RadioGroup>
                                    {!!errors.driver_pay_type && (
                                        <FormHelperText error sx={{ ml: 1.5, mt: 1 }}>
                                            {errors.driver_pay_type.message}
                                        </FormHelperText>
                                    )}
                                </>
                            )}
                        />
                    }
                />
            </Grid>
            <Grid size={12}>
                <AccordionComponent
                    bordered='true'
                    bold={600}
                    title='Driver Documents'
                    content={
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Typography variant='body2' fontWeight={500}>Driver Documents</Typography>
                            </Grid>
                            {fields.length > 0 && fields.map((item, index) => (
                                <Grid size={12} key={index}>
                                    <DriverDocument
                                        errors={errors}
                                        editMode={editMode}
                                        key={item.id}
                                        remove={remove}
                                        control={control}
                                        register={register}
                                        index={index}
                                        setValue={setValue}
                                    />
                                </Grid>
                            ))
                            }
                            <Grid size={12} container justifyContent={'center'} alignItems={'center'}>
                                <Grid size='auto'>
                                    <Button
                                        startIcon={<Add />}
                                        sx={{ textTransform: 'capitalize' }}
                                        onClick={() => handleAddDoc()}
                                    >
                                        Add Document
                                    </Button>
                                </Grid>
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
                            id='apply-driver-action'
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
                                id='save-driver-action'
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