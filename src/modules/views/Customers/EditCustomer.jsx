import React from 'react'
import { CircularProgress, Grid, Box } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, CustomerForm } from '../../components'
import { useCustomer, useCustomerMutation } from '../../hooks/useCustomers'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export default function EditCustomer() {

    const { id } = useParams()
    const { enqueueSnackbar } = useSnackbar()
    const { update } = useCustomerMutation()
    const { data, isLoading, isRefetching, error, isError } = useCustomer(id)

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            const errorMessage = message ? `${message} - ${status}` : error.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [isError, error])

    return (
        <MainLayout
            title='Edit Customer'
            activeDrawer={{ active: 'Customers' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Customers', url: '/customers' }, { text: 'Edit' }]}
                />
            }
        >
            <Grid container>
                {!isLoading && !isRefetching ?
                    <Grid size={12}>
                        <CustomerForm
                            initialValues={{ ...data }}
                            editMode
                            customer_id={id}
                            submit={async (payload) => await update.mutateAsync({ id, payload })} />
                    </Grid>
                    :
                    <Grid size={12} container component={Box} py={15} justifyContent='center' alignItems='center'>
                        <CircularProgress />
                    </Grid>
                }
            </Grid>
        </MainLayout>
    )
}
