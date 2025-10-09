import React from 'react'
import { Grid } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import OrderForm from './OrderForms'

export default function NewOrder(){

    return (
        <MainLayout
            title='New Order'
            activeDrawer={{active: 'Orders'}}
            breadcrumbs={<Breadcrumbs 
                items={[
                    {text: 'Orders', url: '/orders'},
                    {text: 'Create'}
                ]}
            />}
        >
            <Grid container>
                <Grid size={12}>
                    <OrderForm 
                        initialValues={{}}
                        onSubmit={{}}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )

}