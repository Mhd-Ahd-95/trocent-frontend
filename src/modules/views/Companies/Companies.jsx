import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table } from '../../components'
import { Grid, Button } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { useNavigate } from 'react-router-dom'

export default function Companies () {
  const navigate = useNavigate()

  return (
    <MainLayout
      title='Companies'
      activeDrawer={{ active: 'Companies' }}
      breadcrumbs={
        <Breadcrumbs
          items={[{ text: 'Companies', url: '/companies' }, { text: 'List' }]}
        />
      }
      grid
      button
      btnProps={{
        label: 'New Company',
        onClick: () => navigate('/new-company')
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 20, 30]}
            pageSize={10}
            checkboxSelection
            options={{
              filtering: false,
              search: true
            }}
            columns={[
              {
                headerName: 'Operating Name',
                field: 'name',
                flex: 1,
                minWidth: 150
              },
              {
                headerName: 'Legal Name',
                field: 'legal_name',
                flex: 1,
                minWidth: 150
              },
              {
                headerName: 'Phone',
                field: 'phone',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Email',
                field: 'email',
                flex: 1,
                minWidth: 150
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                flex: 1,
                minWidth: 150,
                renderCell: params => (
                  <Button
                    startIcon={<EditSquareIcon />}
                    onClick={() => console.log(params)}
                    variant='text'
                    size='small'
                    sx={{ textTransform: 'capitalize' }}
                  >
                    Edit
                  </Button>
                )
              }
            ]}
            data={[]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
