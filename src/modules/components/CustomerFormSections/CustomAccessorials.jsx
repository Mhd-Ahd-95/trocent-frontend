import React, { useCallback, useMemo } from 'react'
import { CircularProgress, Grid, Box, Switch, Typography } from '@mui/material'
import { TextInput, AccordionComponent } from '../'
import { useAccessorials } from '../../hooks/useAccessorials'
import { styled } from '@mui/material/styles'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

const CustomGrid = styled(Grid)(({ theme }) => ({
    boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
    borderRadius: 5,
    paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(2)
}))

const AccessorialItem = React.memo(({ access, control, basePath, checked, onToggle }) => {
    return (
        <CustomGrid size={12}>
            <Grid container spacing={2} alignItems={'center'}>
                <Grid size={{ xs: 12, sm: 1, md: 1 }}>
                    <Switch
                        checked={checked}
                        onChange={onToggle}
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
                                onChange={(e) => {
                                    const value = e.target.value === '' ? '' : Number(e.target.value);
                                    field.onChange(value);
                                }}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </Grid>
                {access.min >= 0 && access.min !== null && (
                    <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                        <Controller
                            name={`${basePath}.min`}
                            control={control}
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
                                    onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            )}
                        />
                    </Grid>
                )}
                {access.max >= 0 && access.max !== null && (
                    <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                        <Controller
                            name={`${basePath}.max`}
                            control={control}
                            render={({ field }) => (
                                <TextInput
                                    {...field}
                                    label='Max'
                                    type='number'
                                    inputProps={{ step: 'any' }}
                                    variant='outlined'
                                    size='small'
                                    fullWidth
                                    disabled={!checked}
                                    value={field.value ?? access.max ?? ''}
                                    onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            )}
                        />
                    </Grid>
                )}
                {access.free_time >= 0 && access.free_time !== null && (
                    <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                        <Controller
                            name={`${basePath}.free_time`}
                            control={control}
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
                                    onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            )}
                        />
                    </Grid>
                )}
                {access.base_amount >= 0 && access.base_amount !== null && (
                    <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                        <Controller
                            name={`${basePath}.base_amount`}
                            control={control}
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
                                    onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            )}
                        />
                    </Grid>
                )}
            </Grid>
        </CustomGrid>
    )
}, (prevProps, nextProps) => {
    return (
        prevProps.checked === nextProps.checked &&
        prevProps.basePath === nextProps.basePath &&
        prevProps.access.id === nextProps.access.id
    )
})

AccessorialItem.displayName = 'AccessorialItem'

function CustomAccessorials(props) {

    const { control } = useFormContext()
    const { data, isLoading } = useAccessorials()

    const { fields, append, remove } = useFieldArray({ name: 'accessorials', control })
    const fieldIds = useMemo(() => new Set(fields.map(f => f.access_id)), [fields])

    const sortedData = useMemo(() => {
        if (!data) return null

        return [...data].sort((a, b) => {
            const aChecked = fieldIds.has(a.id)
            const bChecked = fieldIds.has(b.id)

            if (aChecked !== bChecked) {
                return aChecked ? -1 : 1
            }

            return a.name.localeCompare(b.name)
        })
    }, [data])

    const handleToggle = useCallback((access) => (e) => {
        const checked = e.target.checked

        if (checked) {
            const exists = fields.find(a => a.access_id === access.id)
            if (!exists) {
                append({
                    access_id: access.id,
                    name: access.name,
                    amount: access.amount,
                    min: access.min,
                    max: access.max,
                    base_amount: access.base_amount,
                    free_time: access.free_time
                })
            }
        } else {
            const index = fields.findIndex(a => a.access_id === access.id)
            if (index !== -1) {
                remove(index)
            }
        }
    }, [fields, append, remove])

    const accessorialItems = useMemo(() => {
        if (!sortedData) return null

        return sortedData.map((access) => {
            const selectedIndex = fields.findIndex(a => a.access_id === access.id)
            const checked = selectedIndex !== -1
            const basePath = checked ? `accessorials.${selectedIndex}` : ''

            return (
                <AccessorialItem
                    key={access.id}
                    access={access}
                    control={control}
                    basePath={basePath}
                    checked={checked}
                    onToggle={handleToggle(access)}
                />
            )
        })
    }, [sortedData, fields, control, handleToggle])

    return (
        <AccordionComponent
            bordered='true'
            title='Accessorial Charges'
            subtitle='Enable and customize accessorial charges per customer'
            content={
                !isLoading ? (
                    <Grid container spacing={3}>
                        {accessorialItems}
                    </Grid>
                ) : (
                    <Grid container component={Box} justifyContent='center' alignItems='center' py={10} sx={{ width: '100%' }}>
                        <CircularProgress />
                    </Grid>
                )
            }
        />
    )
}

export default React.memo(CustomAccessorials)