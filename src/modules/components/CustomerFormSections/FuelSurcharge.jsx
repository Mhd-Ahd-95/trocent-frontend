import React from 'react'
import {
    Grid,
    Switch,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
} from '@mui/material'
import { TextInput, CustomFormControlLabel } from '../../components'
import { Controller, useWatch } from 'react-hook-form'

function FuelSurcharge(props) {

    const { control } = props

    const watch_ltl = useWatch({
        control,
        name: 'fuel_ltl_other'
    })

    const watch_ftl = useWatch({
        control,
        name: 'fuel_ftl_other'
    })

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Controller
                    name='fuel_ltl'
                    rules={{ required: 'Fuel LTL is a required field' }}
                    control={control}
                    render={(({ field, fieldState }) => (
                        <TextInput
                            {...field}
                            label='Fuel LTL*'
                            variant='outlined'
                            inputRef={field.ref}
                            type='number'
                            inputProps={{ step: 'any' }}
                            fullWidth
                            error={!!fieldState?.error}
                            helperText={fieldState?.error?.message}
                        />
                    ))}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Controller
                    name='fuel_ftl'
                    rules={{ required: 'Fuel FTL is a required field' }}
                    control={control}
                    render={(({ field, fieldState }) => (
                        <TextInput
                            {...field}
                            label='Fuel FTL*'
                            variant='outlined'
                            inputRef={field.ref}
                            type='number'
                            inputProps={{ step: 'any' }}
                            fullWidth
                            error={!!fieldState?.error}
                            helperText={fieldState?.error?.message}
                        />
                    ))}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <FormControl>
                    <CustomFormControlLabel
                        control={
                            <Controller
                                name='fuel_ltl_other'
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
                        label='Fuel LTL Other'
                    />
                </FormControl>
            </Grid>
            {watch_ltl &&
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Controller
                        name='fuel_ltl_other_value'
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                label='Fuel LTL other value'
                                variant='outlined'
                                fullWidth
                                type='number'
                                inputProps={{ step: 'any' }}
                                {...field}
                            />
                        )}
                    />
                </Grid>
            }
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <FormControl>
                    <CustomFormControlLabel
                        control={
                            <Controller
                                name='fuel_ftl_other'
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
                        label='Fuel FTL Other'
                    />
                </FormControl>
            </Grid>
            {watch_ftl &&
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Controller
                        name='fuel_ftl_other_value'
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                type='number'
                                inputProps={{ step: 'any' }}
                                label='Fuel FTL other value'
                                variant='outlined'
                                fullWidth
                                {...field}
                            />
                        )}
                    />
                </Grid>
            }
            {/* <Grid size={12}>
                <Divider />
            </Grid> */}
            <Grid size={{ xs: 12, sm: 12, md: 12 }} pt={1}>
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label" sx={{ fontWeight: 600 }}>Tax Options</FormLabel>
                    <Controller
                        name="tax_options"
                        control={control}
                        render={({ field }) => (
                            <>
                                <RadioGroup
                                    {...field}
                                    aria-labelledby="tax-label"
                                >
                                    <Grid container spacing={0}>
                                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                            <CustomFormControlLabel
                                                value="no_tax"
                                                control={<Radio />}
                                                label="No Tax"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                            <CustomFormControlLabel
                                                value="both_pst_gst"
                                                control={<Radio />}
                                                label="Apply Both (GST + PST)"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                            <CustomFormControlLabel
                                                value="pst"
                                                control={<Radio />}
                                                label="Provincial Only (PST)"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                            <CustomFormControlLabel
                                                value="gst"
                                                control={<Radio />}
                                                label="Federal Only (GST)"
                                            />
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </>
                        )}
                    />
                </FormControl>
            </Grid>
        </Grid>
    )
}

export default React.memo(FuelSurcharge)
