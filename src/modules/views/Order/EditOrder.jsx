import React from 'react'
import { CircularProgress, Grid, Box } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useOrderMutations, useOrder } from '../../hooks/useOrders'

const OrderForm = React.lazy(() => import('./OrderForms'))

export default function EditOrder() {

    const { id } = useParams()
    const { enqueueSnackbar } = useSnackbar()
    // const { update } = useOrderMutations()
    const { data, isLoading, isRefetching, error, isError } = useOrder(id)

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            const errorMessage = message ? `${message} - ${status}` : error.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [isError, error])

    // console.log(data);

    return (
        <MainLayout
            title='Edit Order'
            activeDrawer={{ active: 'Orders' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Orders', url: '/orders' }, { text: 'Edit' }]}
                />
            }
        >
            <Grid container>
                {!isLoading && !isRefetching ?
                    <Grid size={12}>
                        <OrderForm
                            initialValues={{ ...data }}
                            editMode
                            order_id={id}
                        // submit={async (payload) => await update.mutateAsync({ id, payload })} 
                        />
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
