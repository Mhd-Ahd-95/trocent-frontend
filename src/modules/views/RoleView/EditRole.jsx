import React from 'react'
import { Grid } from '@mui/material'
import RoleForm from './RoleForm'
import { MainLayout } from '../../layouts'
import { Breadcrumbs } from '../../components'
import { useParams } from 'react-router-dom'
import { RoleContext } from '../../contexts'
import RoleApi from '../../apis/Role.api'

export default function EditRole() {
  const { rid } = useParams()
  const { roles } = React.useContext(RoleContext)

  const role = roles.find(rol => rol.id === Number(rid))

  return (
    <MainLayout
      title='Edit Role'
      activeDrawer={{ active: 'Roles' }}
      breadcrumbs={
        <Breadcrumbs
          items={[{ text: 'Roles', url: '/roles' }, { text: 'Edit' }]}
        />
      }
    >
      <Grid container>
        <Grid size={12}>
          <RoleForm
            initialValues={role ? { ...role } : {}}
            submit={payload => RoleApi.updateRole(rid, payload)}
            editMode
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
