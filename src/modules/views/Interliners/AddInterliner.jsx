import React from 'react'
import { Grid } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import InterlinerForm from './InterlinerForm'
import { useInterlinerMutations } from '../../hooks/useInterliners'

export default function CreateInterliner() {

    const { create } = useInterlinerMutations()

    return (
        <MainLayout
            title='Create Interliner'
            activeDrawer={{ active: 'Interliners' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Interliners', url: '/interliners' }, { text: 'Create' }]}
                />
            }
        >
            <Grid container>
                <Grid size={12}>
                    <InterlinerForm
                        initialValues={{}}
                        submit={async (payload) => {
                            try {
                                await create.mutateAsync(payload)
                            } catch (error) {
                                // errors are already shown via enqueueSnackbar
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )
}
