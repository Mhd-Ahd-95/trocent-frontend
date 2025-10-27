import React from 'react'
import {
    Grid,
    Autocomplete,
    TextField
} from '@mui/material'
import { Controller, useWatch } from 'react-hook-form'
import { TextInput, InputWrapper } from '../../components'

function BasicInfo(props) {

    const { setValue, control } = props

    const options = ['Arrived at Pickup', 'Pickedup', 'Departed Pickup', 'Arrived at Delivery', 'Delivered', 'Departed from Delivery']

    const billing_emails = useWatch({
        name: 'billing_emails',
        control,
    })

    const pod_emails = useWatch({
        name: 'pod_emails',
        control,
    })

    const sts_emails = useWatch({
        name: 'status_update_emails',
        control,
    })

    return (
        <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }} pt={2}>
                <InputWrapper
                    shrinkOut='true'
                    noSpace
                    validatedEmail
                    setValue={setValue}
                    data={billing_emails || []}
                    field={'billing_emails'}
                    placeholder='Type and Press Comma'
                    label='Billing Emails'
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }} pt={2}>
                <InputWrapper
                    shrinkOut='true'
                    noSpace
                    validatedEmail
                    setValue={setValue}
                    data={pod_emails || []}
                    field={'pod_emails'}
                    placeholder='Type and Press Comma'
                    label='POD Emails'
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }} pt={2}>
                <InputWrapper
                    shrinkOut='true'
                    noSpace
                    validatedEmail
                    setValue={setValue}
                    data={sts_emails || []}
                    field={'status_update_emails'}
                    placeholder='Type and Press Comma'
                    label='Status Update Emails'
                />
            </Grid>
            <Grid size={12} pt={2}>
                <Controller
                    name='notification_preferences'
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            multiple
                            options={options}
                            getOptionLabel={(option) => option}
                            filterSelectedOptions
                            value={field.value || []}
                            onChange={(_, newValue) => field.onChange(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Notification Preferences"
                                    placeholder="Select an options"
                                    variant='outlined'
                                    fullWidth
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '13px',
                                            marginTop: 0.5
                                        },
                                        '& .MuiInputLabel-shrink': {
                                            fontSize: '14px',
                                            marginTop: -0.1
                                        }
                                    }}
                                />
                            )}
                        />
                    )}
                />
            </Grid>
        </Grid>
    )
}

export default React.memo(BasicInfo)
