import React from 'react'
import { Grid } from '@mui/material'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import CompanyForm from './CompanyForm'
import { useCompanyMutation } from '../../hooks/useComapnies'

export default function CreateCompany() {

    const { create } = useCompanyMutation()

    return (
        <MainLayout
            title='Create Company'
            activeDrawer={{ active: 'Companies' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[{ text: 'Companies', url: '/companies' }, { text: 'Create' }]}
                />
            }
        >
            <Grid container>
                <Grid size={12}>
                    <CompanyForm
                        initialValues={{}}
                        submit={async (payload) => await create.mutateAsync(payload)}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )
}
