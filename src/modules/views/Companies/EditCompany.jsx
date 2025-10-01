import React from 'react'
import { CircularProgress, Grid, Box } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useCompany, useCompanyMutation } from '../../hooks/useComapnies'
import CompanyForm from './CompanyForm'

export default function EditCompany() {

    const { id } = useParams()
    const { enqueueSnackbar } = useSnackbar()

    const { data, isLoading, isError, error, isRefetching } = useCompany(id)
    const { update } = useCompanyMutation()

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
            title='Edit Company'
            activeDrawer={{ active: 'Companies' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Companies', url: '/companies' }, { text: 'Create' }]}
                />
            }
        >
            <Grid container>
                {!isLoading && !isRefetching ?
                    <Grid size={12}>
                        <CompanyForm
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
