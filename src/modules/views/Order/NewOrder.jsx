import React from 'react'
import { CircularProgress, Grid } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
// import OrderForm from './OrderForms'
import global from '../../global'
import CounterApi from '../../apis/Counter.api'
import { useSnackbar } from 'notistack'

const OrderForm = React.lazy(() => import('./OrderForms'))

export default function NewOrder() {

    const authedUser = global.auth.user

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
                    <React.Suspense fallback={<Grid container justifyContent={'center'} py={15} sx={{width: '100%'}}><CircularProgress /></Grid>}>
                        <OrderForm
                            initialValues={{ username: authedUser?.username }}
                            onSubmit={{}}
                            isGenerating
                        />
                    </React.Suspense>
                </Grid>
            </Grid>
        </MainLayout>
    )

}