import React from 'react'
import { CircularProgress, Grid } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import global from '../../global'
import { useOrderMutations } from '../../hooks/useOrders'

const OrderForm = React.lazy(() => import('./OrderForms'))

export default function NewOrder() {

    const authedUser = global.auth.user
    
    const { create } = useOrderMutations()

    return (
        <MainLayout
            title='New Order'
            activeDrawer={{ active: 'Orders' }}
            breadcrumbs={<Breadcrumbs
                items={[
                    { text: 'Orders', url: '/orders' },
                    { text: 'Create' }
                ]}
            />}
        >
            <Grid container>
                <Grid size={12}>
                    <React.Suspense fallback={<Grid container justifyContent={'center'} py={15} sx={{ width: '100%' }}><CircularProgress /></Grid>}>
                        <OrderForm
                            initialValues={{ username: authedUser?.username, user_id: authedUser?.id, create_date: new Date(), }}
                            submit={async (payload) => await create.mutateAsync(payload)}
                            isGenerating
                        />
                    </React.Suspense>
                </Grid>
            </Grid>
        </MainLayout>
    )

}