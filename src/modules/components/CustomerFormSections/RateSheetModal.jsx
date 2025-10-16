import React from 'react'
import { FormControl, FormHelperText, Grid, IconButton, MenuItem, Switch, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import TextInput from '../CustomComponents/TextInput'
import { CustomFormControlLabel, StyledButton, SubmitButton } from '..'
import UploadXlsx from '../UploadFile/UploadXL'
import { Controller, useForm } from 'react-hook-form'


export default function RateSheetModal(props) {

    const [loading, setLoading] = React.useState(false)

    const { control, setValue, handleSubmit } = useForm({
        defaultValues: {
            type: '',
            skid_by_weight: false,
            items: []
        }
    })

    const onSubmit = (data, e) => {
        e.preventDefault()
        console.log(data);
        console.log('submitted');
    }

    return (
        <Grid container spacing={3} component={'form'} onSubmit={handleSubmit(onSubmit)}>
            <Grid size={12}>
                <Grid container spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                    <Grid size='auto'>
                        <Typography variant='boday1' fontWeight={600}>Import Rate Sheet for this Customer</Typography>
                    </Grid>
                    <Grid size='auto'>
                        <IconButton
                            onClick={() => props.handleClose()}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={12}>
                <Controller
                    name='type'
                    rules={{ required: 'Type is a required field' }}
                    control={control}
                    render={(({ field, fieldState }) => (
                        <TextInput
                            {...field}
                            label='Rate Sheet Type*'
                            fullWidth
                            variant='outlined'
                            select
                            error={!!fieldState.error}
                            helperText={fieldState?.error?.message}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                        >
                            <MenuItem value=''><em>Select an Option</em></MenuItem>
                            <MenuItem value='skid_base'>Skid Base</MenuItem>
                            <MenuItem value='weight_base'>Weight Base</MenuItem>
                        </TextInput>
                    ))}
                />
            </Grid>
            <Grid size={12}>
                <FormControl>
                    <CustomFormControlLabel
                        control={
                            <Controller
                                name='skid_by_weight'
                                control={control}
                                render={(({ field }) => (
                                    <Switch
                                        name='skid_by_weight'
                                        checked={field.value || false}
                                        onChange={e => {
                                            const checked = e.target.checked
                                            field.onChange(checked)
                                        }}
                                    />
                                ))}
                            />

                        }
                        label='Skid → Weight'
                    />
                    <FormHelperText sx={{ marginLeft: -0.3 }}>Check this if the rate sheet is Skid by Weight</FormHelperText>
                </FormControl>
            </Grid>
            <Grid size={12}>
                <Controller
                    name='items'
                    rules={{ required: 'Rate Sheet XLSX is a required field' }}
                    control={control}
                    render={(({ field, fieldState }) => (
                        <UploadXlsx
                            field={field}
                            fieldState={fieldState}
                        />
                    ))}
                />

            </Grid>
            <Grid size={12}>
                <Grid container spacing={2}>
                    <Grid size='auto'>
                        <SubmitButton
                            type='submit'
                            color='primary'
                            variant='contained'
                            size='small'
                            textTransform='capitalize'
                            isLoading={loading}
                        >
                            Import
                        </SubmitButton>
                    </Grid>
                    <Grid size='auto'>
                        <StyledButton
                            variant='outlined'
                            color='error'
                            size='small'
                            disabled={loading}
                            textTransform='capitalize'
                            onClick={() => props.handleClose()}
                        >
                            Cancel
                        </StyledButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

}