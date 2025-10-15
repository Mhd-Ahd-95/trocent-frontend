import React from 'react'
import { Grid } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, CustomerForm } from '../../components'
import { useCustomerMutation } from '../../hooks/useCustomers'

export default function CreateInterliner() {

    const { create } = useCustomerMutation()

    return (
        <MainLayout
            title='Create Customer'
            activeDrawer={{ active: 'Customers' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Customers', url: '/customers' }, { text: 'Create' }]}
                />
            }
        >
            <Grid container>
                <Grid size={12}>
                    <CustomerForm
                        initialValues={{}}
                        submit={async (payload) => await create.mutateAsync(payload)}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )
}
