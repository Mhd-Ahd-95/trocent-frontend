import React from 'react'
import {
    Grid,
} from '@mui/material'
import { TextInput } from '../../components'
import { Controller, useFormContext } from 'react-hook-form';

function CustomerBasicInfo(props) {

    const { register, control } = useFormContext()

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Controller
                    name='account_number'
                    rules={{ required: 'Account Number is a required field.' }}
                    control={control}
                    render={(({ field, fieldState }) => (
                        <TextInput
                            {...field}
                            label='Account Number*'
                            variant='outlined'
                            fullWidth
                            inputRef={field.ref}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    ))}
                />

            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Controller
                    name='name'
                    rules={{ required: 'Name is a required field.' }}
                    control={control}
                    render={(({ field, fieldState }) => (
                        <TextInput
                            {...field}
                            label='Name*'
                            inputRef={field.ref}
                            variant='outlined'
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    ))}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <TextInput
                    label='Address'
                    variant='outlined'
                    fullWidth
                    {...register('address')}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <TextInput
                    label='Suite'
                    variant='outlined'
                    fullWidth
                    {...register('suite')}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <TextInput
                    label='City'
                    variant='outlined'
                    fullWidth
                    {...register('city')}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <TextInput
                    label='Province'
                    variant='outlined'
                    fullWidth
                    {...register('province')}
                    inputProps={{ maxLength: 2 }}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <TextInput
                    label='Postal Code'
                    variant='outlined'
                    fullWidth
                    {...register('postal_code')}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <TextInput
                    label='Account Contact'
                    variant='outlined'
                    fullWidth
                    {...register('account_contact')}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <TextInput
                    label='Telephone Number'
                    variant='outlined'
                    fullWidth
                    {...register('phone_number')}
                />
            </Grid>
        </Grid>
    )
}

export default React.memo(CustomerBasicInfo)
