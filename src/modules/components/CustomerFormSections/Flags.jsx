import React from 'react'
import {
    FormControl,
    Grid,
    Switch
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { CustomFormControlLabel } from '../../components'

function Flags(props) {

    const { control } = props

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <FormControl>
                    <CustomFormControlLabel
                        control={
                            <Controller
                                name='account_active'
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
                        label='Account Active'
                    />
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <FormControl>
                    <CustomFormControlLabel
                        control={
                            <Controller
                                name='mandatory_reference_number'
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
                        label='Mandatory Reference Number'
                    />
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <FormControl>
                    <CustomFormControlLabel
                        control={
                            <Controller
                                name='summary_invoice'
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
                        label='Summary Invoice'
                    />
                </FormControl>
            </Grid>
            {/* <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <FormControl>
                    <CustomFormControlLabel
                        control={
                            <Controller
                                name='no_tax'
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
                        label='No Tax'
                    />
                </FormControl>
            </Grid> */}
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <FormControl>
                    <CustomFormControlLabel
                        control={
                            <Controller
                                name='receive_status_update'
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
                        label='Receive Status Update'
                    />
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <FormControl>
                    <CustomFormControlLabel
                        control={
                            <Controller
                                name='include_pod_with_invoice'
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
                        label='Include BOL/POD Copies with Invoice Emails'
                    />
                </FormControl>
            </Grid>
        </Grid>
    )
}

export default React.memo(Flags)
