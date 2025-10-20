import React from 'react'
import { CircularProgress, Grid, Box, Switch, Typography } from '@mui/material'
import { TextInput, AccordionComponent } from '../'
import { useAccessorials } from '../../hooks/useAccessorials'
import { styled } from '@mui/material/styles'
import { Controller, useFieldArray } from 'react-hook-form'

const CustomGrid = styled(Grid)(({ theme }) => ({
    boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
    borderRadius: 5,
    paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(2)
}))


function CustomAccessorials(props) {

    const { control, watch } = props
    const { data, isLoading, } = useAccessorials()

    const { fields, append, remove } = useFieldArray({
        name: 'accessorials',
        control
    })

    const accessorialsSelected = watch('accessorials')

    const handleChange = (e, access) => {
        const checked = e.target.checked
        if (checked) {
            const exists = accessorialsSelected.find(a => a.id === access.id)
            if (!exists) append({
                access_id: access.id,
                name: access.name,
                amount: access.amount,
                min: access.min,
                max: access.max,
                base_amount: access.base_amount,
                free_time: access.free_time
            })
        }
        else {
            const index = accessorialsSelected.findIndex(a => a.access_id === access.id)
            if (index !== -1) remove(index)
        }
    }

    const isChecked = (aid) => accessorialsSelected.some(acc => acc.access_id === aid)

    return (
        <AccordionComponent
            bordered='true'
            title='Accessorial Charges'
            subtitle='Enable and customize accessorial charges per customer'
            content={
                !isLoading?
                    <Grid container spacing={3}>
                        {data && data.map((access, index) => {

                            const checked = isChecked(access.id)
                            const selectedIndex = accessorialsSelected.findIndex(a => a.access_id === access.id)
                            const basePath = selectedIndex !== -1 ? `accessorials.${selectedIndex}` : ''

                            return (
                                <CustomGrid size={12} key={index}>
                                    <Grid container spacing={2} alignItems={'center'}>
                                        <Grid size={{ xs: 12, sm: 1, md: 1 }}>
                                            <Switch
                                                checked={checked}
                                                onChange={e => handleChange(e, access)}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 11, md: 3 }}>
                                            <Typography variant='body2' sx={{ fontSize: 13, fontWeight: 600 }}>
                                                {access.name}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                                            <Controller
                                                name={`${basePath}.amount`}
                                                control={control}
                                                // defaultValue={access.amount ?? ''}
                                                render={({ field }) => (
                                                    <TextInput
                                                        {...field}
                                                        label='Amount'
                                                        variant='outlined'
                                                        size='small'
                                                        type='number'
                                                        inputProps={{ step: 'any' }}
                                                        fullWidth
                                                        disabled={!checked}
                                                        value={field.value ?? access.amount ?? ''}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        {access?.min &&
                                            <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                                                <Controller
                                                    name={`${basePath}.min`}
                                                    control={control}
                                                    // defaultValue={access.min ?? ''}
                                                    render={({ field }) => (
                                                        <TextInput
                                                            {...field}
                                                            label='Min'
                                                            variant='outlined'
                                                            size='small'
                                                            fullWidth
                                                            type='number'
                                                            inputProps={{ step: 'any' }}
                                                            disabled={!checked}
                                                            value={field.value ?? access.min ?? ''}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                        {access?.max &&
                                            <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                                                <Controller
                                                    name={`${basePath}.max`}
                                                    control={control}
                                                    // defaultValue={access.max ?? ''}
                                                    render={({ field }) => (
                                                        <TextInput
                                                            {...field}
                                                            label='max'
                                                            type='number'
                                                            inputProps={{ step: 'any' }}
                                                            variant='outlined'
                                                            size='small'
                                                            fullWidth
                                                            disabled={!checked}
                                                            value={field.value ?? access.max ?? ''}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                        {access?.free_time &&
                                            <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                                                <Controller
                                                    name={`${basePath}.free_time`}
                                                    control={control}
                                                    // defaultValue={access.free_time ?? ''}
                                                    render={({ field }) => (
                                                        <TextInput
                                                            {...field}
                                                            label='Free Time'
                                                            type='number'
                                                            inputProps={{ step: 'any' }}
                                                            variant='outlined'
                                                            size='small'
                                                            fullWidth
                                                            disabled={!checked}
                                                            value={field.value ?? access.free_time ?? ''}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                        {access?.base_amount &&
                                            <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                                                <Controller
                                                    name={`${basePath}.base_amount`}
                                                    control={control}
                                                    // defaultValue={access.base_amount ?? ''}
                                                    render={({ field }) => (
                                                        <TextInput
                                                            {...field}
                                                            label='Base Amount'
                                                            type='number'
                                                            inputProps={{ step: 'any' }}
                                                            variant='outlined'
                                                            size='small'
                                                            fullWidth
                                                            disabled={!checked}
                                                            value={field.value ?? access.base_amount ?? ''}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                    </Grid>
                                </CustomGrid>
                            )
                        })}
                    </Grid>
                    :
                    <Grid container component={Box} justifyContent='center' alignItems='center' py={10} sx={{ width: '100%' }}>
                        <CircularProgress />
                    </Grid>
            }
        />
    )

}

export default React.memo(CustomAccessorials)