import React from 'react'
import { Grid, CircularProgress, Switch, FormControl, Autocomplete, MenuItem, TextField, Typography, Button } from '@mui/material'
import { TextInput, StyledButton, SubmitButton, AccordionComponent, CustomFormControlLabel } from '../../components'
import initialInputs from './initialInputs'
import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form'
import global from '../../global'
import { useCompanies } from '../../hooks/useComapnies'
import { DatePicker } from '@mui/x-date-pickers'
import { v4 as uuidv4 } from "uuid";
import { Add } from '@mui/icons-material'
import DriverDocument from './DriverDocument'

export default function DriverForm(props) {

    const { initialValues, submit, editMode } = props
    const { _spacing } = global.methods
    const [openAutoComplete, setOpenAutoComplete] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const { isLoading, refetch } = useCompanies(false)
    const [companies, setCompanies] = React.useState([])

    const handleAutoCompleteOepn = async () => {
        setOpenAutoComplete(true)
        const res = await refetch()
        setCompanies(res.data || [])
    }

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
        // setLoading(true);
        console.log(data);
        const action = e?.nativeEvent?.submitter?.id;
        // try {
        //     await submit(data);
        //     if (action === 'apply-interliner-action') {
        //         navigate('/interliners');
        //     }
        //     else {
        //         reset()
        //     }
        //     props.refetch()
        // } catch (error) {
        //     // console.log(error);
        //     //
        // } finally {
        //     setLoading(false);
        // }
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
                                                        <TextInput
                                                            label={label}
                                                            variant='outlined'
                                                            fullWidth
                                                            {...register(field, required ? { required: `${_spacing(field)} is a required field` } : {})}
                                                            error={!!errors[field]}
                                                            helperText={errors[field]?.message}
                                                        >
                                                            {options.map((option) => (
                                                                <MenuItem value={option} key={uuidv4()}>{_spacing(option)}</MenuItem>
                                                            ))}
                                                        </TextInput>
                                                    </Grid>
                                                    : type === 'switch' ?
                                                        <Grid size={{ xs: 12, sm: 6, md: md }} key={uuidv4()}>
                                                            <FormControl>
                                                                <CustomFormControlLabel
                                                                    control={
                                                                        <Controller
                                                                            name={field}
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
                                                                    label={label}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        : autoComplete ?
                                                            <Grid size={{ xs: 12, sm: 6, md: md }} key={uuidv4()}>
                                                                <Autocomplete
                                                                    open={openAutoComplete}
                                                                    onOpen={handleAutoCompleteOepn}
                                                                    onClose={() => setOpenAutoComplete(false)}
                                                                    isOptionEqualToValue={(option, value) => option.legal_name === value.legal_name}
                                                                    getOptionLabel={(option) => option.legal_name}
                                                                    options={companies}
                                                                    loading={isLoading}
                                                                    renderInput={(params) => (
                                                                        <TextInput
                                                                            {...params}
                                                                            label={label}
                                                                            fullWidth
                                                                            variant='outlined'
                                                                            {...register(field, required ? { required: `${_spacing(field)} is a required field` } : {})}
                                                                            slotProps={{
                                                                                input: {
                                                                                    ...params.InputProps,
                                                                                    endAdornment: (
                                                                                        <React.Fragment>
                                                                                            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                                            {params.InputProps.endAdornment}
                                                                                        </React.Fragment>
                                                                                    ),
                                                                                },
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                            : type === 'date' ?
                                                                <Grid size={{ xs: 12, sm: 6, md: md }}>
                                                                    <Controller
                                                                        name={field}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <DatePicker
                                                                                label={label}
                                                                                views={['year', 'month', 'day']}
                                                                                value={field.value}
                                                                                onChange={date => field.onChange(date)}
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
                                                                : multiline ?
                                                                    <Grid size={{ xs: 12, sm: 6, md: md }}>
                                                                        <TextField
                                                                            label={label}
                                                                            variant='outlined'
                                                                            fullWidth
                                                                            {...register(field, required ? { required: `${_spacing(field)} is a required field` } : {})}
                                                                            inputProps={{ ...inputProps }}
                                                                            error={!!errors[field]}
                                                                            multiline
                                                                            minRows={3}
                                                                            maxRows={3}
                                                                        />
                                                                    </Grid>
                                                                    :
                                                                    <Grid size={{ xs: 12, sm: 6, md: md }} key={uuidv4()}>
                                                                        <TextInput
                                                                            label={label}
                                                                            variant='outlined'
                                                                            fullWidth
                                                                            {...register(field, required ? { required: `${_spacing(field)} is a required field` } : {})}
                                                                            inputProps={{ ...inputProps }}
                                                                            error={!!errors[field]}
                                                                            helperText={helperText ? helperText : errors[field]?.message}
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