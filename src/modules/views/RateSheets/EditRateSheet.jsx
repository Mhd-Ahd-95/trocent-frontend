import React from 'react'
import { CircularProgress, Grid, Box } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useRateSheet, useRateSheetMutations } from '../../hooks/useRateSheets'
import RateSheetForm from './RateSheetForm'

export default function EditRateSheet() {

    const { id, cid } = useParams()
    const { enqueueSnackbar } = useSnackbar()

    const { data, isLoading, isError, error, isRefetching } = useRateSheet(id)
    const { update } = useRateSheetMutations()

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
            title='Edit Rate Sheet'
            activeDrawer={{ active: 'Rate Sheets' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Rate Sheets', url: '/rate-sheets', state: { customer_id: cid } }, { text: 'Edit' }]}
                />
            }
        >
            <Grid container>
                {!isLoading && !isRefetching ?
                    <Grid size={12}>
                        <RateSheetForm
                            customerID={cid}
                            initialValues={{ ...data }}
                            editMode
                            submit={async (payload) => await update.mutateAsync({ cid, id, payload })} />
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
