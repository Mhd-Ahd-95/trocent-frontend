import React from "react";
import { AccordionComponent, TextInput, UploadFile } from "../../components";
import { Controller, useWatch } from "react-hook-form";
import { Grid, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import globalVariables from "../../global";

function DriverDocument(props) {

    const { setValue, remove, control, index } = props
    const { _spacing } = globalVariables.methods
    const driverDocument = useWatch({
        control,
        name: `driver_documents.${index}`
    })


    const handleRemove = React.useCallback(() => remove(index), [index, remove])

    const formatTitle = {
        license: 'License',
        tdg: 'TDG Certificate',
        record: 'Driver Record',
        background: 'Background Check',
        residence_history: 'Work & Residence History'
    }

    return (
        <AccordionComponent
            handleDelete={handleRemove}
            key={index}
            title={formatTitle[driverDocument?.type] || ''}
            content={
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Controller
                            name={`driver_documents.${index}.type`}
                            control={control}
                            rules={{ required: 'Type is a required field' }}
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
                            name={`driver_documents.${index}.file`}
                            control={control}
                            rules={!driverDocument?.fname && !driverDocument?.fsize ? { required: 'File is required' } : {}}
                            render={({ field, fieldState }) => (
                                <UploadFile
                                    editMode={props.editMode}
                                    field={field}
                                    driverDocument={driverDocument}
                                    fieldState={fieldState}
                                    index={index}
                                    setValue={setValue}
                                />
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
                                    value={field.value ? moment(field.value) : null}
                                    onChange={date => field.onChange(date ? date.toISOString() : null)}
                                    slotProps={{
                                        textField: {
                                            error: !!fieldState?.error,
                                            helperText: fieldState?.error?.message,
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

export default React.memo(DriverDocument)