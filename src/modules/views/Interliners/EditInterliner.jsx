import React from 'react'
import { CircularProgress, Grid, Box } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import InterlinerForm from './InterlinerForm'
import InterlinersApi from '../../apis/Interliners.api'
import { useParams } from 'react-router-dom'
import { useInterliner, useInterlinerMutations } from '../../hooks/useInterliners'
import { useSnackbar } from 'notistack'

export default function EditInterliner() {

    const { id } = useParams()
    const { enqueueSnackbar } = useSnackbar()

    const { data, isLoading, isError, error, refetch } = useInterliner(id)
    const { update } = useInterlinerMutations()

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
            title='Edit Interliner'
            activeDrawer={{ active: 'Interliners' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Interliners', url: '/interliners' }, { text: 'Create' }]}
                />
            }
        >
            <Grid container>
                {isLoading ? <Grid size={12} container component={Box} py={15} justifyContent='center' alignItems='center'>
                    <CircularProgress />
                </Grid>
                    :
                    <Grid size={12}>
                        <InterlinerForm
                            initialValues={{ ...data }}
                            editMode
                            refetch={refetch}
                            submit={async (payload) => await update.mutateAsync({ id, payload })} />
                    </Grid>
                }
            </Grid>
        </MainLayout>
    )
}
