import React, { useCallback, useMemo } from 'react'
import { Grid, Box, Typography, Switch, CircularProgress } from '@mui/material'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { TextInput, AccordionComponent } from '../'
import { useVehicleTypes } from '../../hooks/useVehicleType'
import { styled } from '@mui/material/styles'

const CustomGrid = styled(Grid)(({ theme }) => ({
    boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
    borderRadius: 5,
    paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(2)
}))

const VehicleTypeItem = React.memo(({ vtype, control, basePath, checked, onToggle }) => {
    return (
        <CustomGrid size={12}>
            <Grid container spacing={2} alignItems={'center'}>
                <Grid size={{ xs: 12, sm: 2, md: 2 }}>
                    <Switch
                        checked={checked}
                        onChange={onToggle}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 10, md: 5 }}>
                    <Typography variant='body2' sx={{ fontSize: 13, fontWeight: 600 }}>
                        {vtype.name}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 5 }}>
                    <Controller
                        name={`${basePath}.rate`}
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                label='Rate'
                                variant='outlined'
                                size='small'
                                type='number'
                                inputProps={{ step: 'any' }}
                                disabled={!checked}
                                fullWidth
                                value={field.value ?? vtype.rate ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value === '' ? '' : Number(e.target.value);
                                    field.onChange(value);
                                }}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </CustomGrid>
    )
}, (prevProps, nextProps) => {
    return (
        prevProps.checked === nextProps.checked &&
        prevProps.basePath === nextProps.basePath &&
        prevProps.vtype.id === nextProps.vtype.id
    )
})

VehicleTypeItem.displayName = 'VehicleTypeItem'

function CustomVehicleTypes(props) {

    const { control } = useFormContext()
    const { data, isLoading } = useVehicleTypes()

    const { fields, append, remove } = useFieldArray({ name: 'vehicle_types', control })

    const handleToggle = useCallback((vtype) => (e) => {
        const checked = e.target.checked

        if (checked) {
            const exists = fields.find(vt => vt.vehicle_id === vtype.id)
            if (!exists) {
                append({
                    vehicle_id: vtype.id,
                    name: vtype.name,
                    rate: Number(vtype.rate)
                })
            }
        } else {
            const index = fields.findIndex(vt => vt.vehicle_id === vtype.id)
            if (index !== -1) {
                remove(index)
            }
        }
    }, [fields, append, remove])

    const fieldIds = useMemo(() => new Set(fields.map(f => f.vehicle_id)), [fields])

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

    const vehicleTypeItems = useMemo(() => {
        if (!data) return null

        return sortedData.map((vtype) => {
            const selectedIndex = fields.findIndex((vt) => vt.vehicle_id === vtype.id)
            const checked = selectedIndex !== -1
            const basePath = checked ? `vehicle_types.${selectedIndex}` : ''

            return (
                <VehicleTypeItem
                    key={vtype.id}
                    vtype={vtype}
                    control={control}
                    basePath={basePath}
                    checked={checked}
                    onToggle={handleToggle(vtype)}
                />
            )
        })
    }, [sortedData, fields, control, handleToggle])

    return (
        <AccordionComponent
            bordered='true'
            title='Vehicle Type Rates'
            subtitle='Enable and override vehicle type base rates per customer'
            content={
                !isLoading ? (
                    <Grid container spacing={3}>
                        {vehicleTypeItems}
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

export default React.memo(CustomVehicleTypes)