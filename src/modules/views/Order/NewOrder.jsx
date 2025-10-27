import React from 'react'
import { Grid } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import OrderForm from './OrderForms'
import global from '../../global'
import CounterApi from '../../apis/Counter.api'
import { useSnackbar } from 'notistack'

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
                    <OrderForm
                        initialValues={{ username: authedUser?.username}}
                        onSubmit={{}}
                        isGenerating
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )

}