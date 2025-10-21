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
                    items={[{ text: 'Interliners', url: '/interliners', state: { fromEditOrCreate: true } }, { text: 'Create' }]}
                />
            }
        >
            <Grid container>
                <Grid size={12}>
                    <InterlinerForm
                        initialValues={{}}
                        submit={async (payload) => await create.mutateAsync(payload)}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )
}
