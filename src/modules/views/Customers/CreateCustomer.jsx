import React from 'react'
import { CircularProgress, Grid } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import { useCustomerMutation } from '../../hooks/useCustomers'

const CustomerForm = React.lazy(() => import('../../components/CustomerFormSections/CustomerForm'))

export default function createCustomer() {

    const { create } = useCustomerMutation()

    return (
        <MainLayout
            title='Create Customer'
            activeDrawer={{ active: 'Customers' }}
            grid
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Customers', url: '/customers' }, { text: 'Create' }]}
                />
            }
        >
            <Grid container>
                <Grid size={12}>
                    <React.Suspense fallback={<Grid container justifyContent={'center'} py={15} sx={{ width: '100%' }}><CircularProgress /></Grid>}>
                        <CustomerForm
                            initialValues={{}}
                            submit={async (payload) => await create.mutateAsync(payload)}
                        />
                    </React.Suspense>
                </Grid>
            </Grid>
        </MainLayout>
    )
}
