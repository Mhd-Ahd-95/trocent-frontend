import React from "react";
import { AccordionComponent, TextInput } from "../../components";
import { Controller, useWatch } from "react-hook-form";
import { Grid, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function DriverDocument(props) {

    const { setValue, remove, control, index, item } = props

    const driverDocument = useWatch({
        control,
        name: `driver_documents.${index}`
    })


    const handleRemove = React.useCallback(() => remove(index), [index, remove])

    return (
        <AccordionComponent
            handleDelete={handleRemove}
            key={index}
            title={driverDocument?.type || ''}
            content={
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Controller
                            name={`driver_documents.${index}.type`}
                            control={control}
                            rules={{ required: 'Type is required' }}
                            render={({ field, fieldState }) => (
                                <TextInput
                                    {...field}
                                    label='Type*'
                                    variant='outlined'
                                    select
                                    fullWidth
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                >
                                    <MenuItem value='license'>License</MenuItem>
                                    <MenuItem value='tdg'>TDG Certificate</MenuItem>
                                    <MenuItem value='record'>Driver Record</MenuItem>
                                    <MenuItem value='background'>Background Check</MenuItem>
                                    <MenuItem value='residence_history'>Work & Residence History</MenuItem>
                                </TextInput>
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Controller
                            name={`driver_documents.${index}.type`}
                            control={control}
                            rules={{ required: 'Type is required' }}
                            render={({ field, fieldState }) => (
                                <TextInput
                                    {...field}
                                    label='Upload File*'
                                    variant='outlined'
                                    select
                                    fullWidth
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                >
                                    <MenuItem value='license'>License</MenuItem>
                                </TextInput>
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Controller
                            name={`driver_documents.${index}.expiry_date`}
                            control={control}
                            rules={{ required: 'Expiry Date is required' }}
                            render={({ field, fieldState }) => (
                                <DatePicker
                                    label={'Expiry Date*'}
                                    views={['year', 'month', 'day']}
                                    value={field.value}
                                    onChange={date => field.onChange(date)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
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
                </Grid>
            }
            icons
            noClone
        />
    )

}