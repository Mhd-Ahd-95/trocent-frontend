import React from 'react'
import { Grid, Box, Typography, Switch, CircularProgress } from '@mui/material'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { TextInput, AccordionComponent } from '../'
import { useVehicleTypes } from '../../hooks/useVehicleType'
import { styled } from '@mui/material/styles'

const CustomGrid = styled(Grid)(({ theme }) => ({
    boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
    borderRadius: 5,
    paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(2)
}))

function CustomVehicleTypes(props) {

    const { control, watch } = props
    const { data, isLoading, isFetching } = useVehicleTypes()

    const vTypesSelected = watch('vehicle_types')

    const { fields, append, remove } = useFieldArray({
        name: 'vehicle_types',
        control
    })

    const handleChange = (e, vtype) => {
        const checked = e.target.checked
        if (checked) {
            const exists = vTypesSelected.find(vt => vt.id === vtype.id)
            if (!exists) append({
                vehicle_id: vtype.id,
                name: vtype.name,
                rate: Number(vtype.rate)
            })
        }
        else {
            const index = vTypesSelected.findIndex(vt => vt.vehicle_id === vtype.id)
            if (index !== -1) remove(index)
        }
    }

    const isChecked = (vid) => vTypesSelected.some(vt => vt.vehicle_id === vid)

    return (
        <AccordionComponent
            bordered='true'
            title='Vehicle Type Rates'
            subtitle='Enable and override vehicle type base rates per customer'
            content={
                !isLoading && !isFetching ?
                    <Grid container spacing={3}>
                        {data && data.map((vtype, index) => {
                            const checked = isChecked(vtype.id)
                            const indexSelected = vTypesSelected.findIndex((vt) => vt.vehicle_id === vtype.id)
                            const basePath = indexSelected !== -1 ? `vehicle_types.${indexSelected}` : ''

                            return (
                                <CustomGrid size={12} key={index}>
                                    <Grid container spacing={2} alignItems={'center'}>
                                        <Grid size={{ xs: 12, sm: 2, md: 2 }}>
                                            <Switch
                                                checked={checked}
                                                onChange={e => handleChange(e, vtype)}
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
                                                // defaultValue={vtype.rate ?? ''}
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
                                                            const value = e.target.value
                                                            field.onChange(Number(value))
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
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

export default React.memo(CustomVehicleTypes)