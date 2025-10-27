import React from 'react'
import { Grid, CircularProgress, Switch, FormControl, Autocomplete, MenuItem, TextField, Typography, Button } from '@mui/material'
import { TextInput, StyledButton, SubmitButton, AccordionComponent, CustomFormControlLabel } from '../../components'
import initialInputs from './initialInputs'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import global from '../../global'
import { useCompanies } from '../../hooks/useComapnies'
import { DatePicker } from '@mui/x-date-pickers'
import { v4 as uuidv4 } from "uuid";
import { Add } from '@mui/icons-material'
import DriverDocument from './DriverDocument'
import { useNavigate } from 'react-router-dom'

export default function DriverForm(props) {

    const navigate = useNavigate()
    const { initialValues, submit, editMode } = props
    const { _spacing } = global.methods
    const [loading, setLoading] = React.useState(false)
    const { isLoading, data } = useCompanies()

    const { register,
        control,
        formState: { errors },
        reset,
        handleSubmit,
        setValue
    } = useForm({
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
                                                                                getOptionLabel={(option) => option.legal_name || ""}
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
                                                                                onChange={date => controllerField.onChange(date ? date.toISOString() : null)}
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

            {/* driver documents */}
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