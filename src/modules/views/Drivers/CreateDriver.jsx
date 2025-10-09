import React from 'react'
import { Grid } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import { useDriverMutation } from '../../hooks/useDrivers'
import DriverForm from './DriverForm'

export default function CreateDriver() {

    const { create } = useDriverMutation()

    return (
        <MainLayout
            title='Create Driver'
            activeDrawer={{ active: 'Drivers' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Drivers', url: '/drivers' }, { text: 'Create' }]}
                />
            }
        >
            <Grid container>
                <Grid size={12}>
                    <DriverForm
                        initialValues={{}}
                        submit={async (payload) => await create.mutateAsync(payload)}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )
}
