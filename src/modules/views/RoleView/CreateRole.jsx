import React from 'react'
import { Grid } from '@mui/material'
import RoleForm from './RoleForm'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import RoleApi from '../../apis/Role.api'

export default function CreateRole () {
  return (
    <MainLayout
      title='Create Role'
      activeDrawer={{ active: 'Roles' }}
      breadcrumbs={
        <Breadcrumbs
          items={[{ text: 'Roles', url: '/roles' }, { text: 'Create' }]}
        />
      }
    >
      <Grid container>
        <Grid size={12}>
          <RoleForm initialValues={{}} submit={(payload) => RoleApi.createRole(payload)} />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
