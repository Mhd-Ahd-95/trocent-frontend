import React from 'react'
import { CircularProgress, Grid, Box } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useDriver, useDriverMutation } from '../../hooks/useDrivers'
import DriverForm from './DriverForm'

export default function EditDriver() {

    const { id } = useParams()
    const { enqueueSnackbar } = useSnackbar()

    const { data, isLoading, isError, error, isRefetching } = useDriver(id)
    const { update } = useDriverMutation()

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
            title='Edit Driver'
            activeDrawer={{ active: 'Drivers' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Drivers', url: '/drivers' }, { text: 'Create' }]}
                />
            }
        >
            <Grid container>
                {!isLoading && !isRefetching ?
                    <Grid size={12}>
                        <DriverForm
                            initialValues={{ ...data }}
                            editMode
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
