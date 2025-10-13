import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table, CustomCell } from '../../components'
import { Grid, Button } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { useNavigate } from 'react-router-dom'

export default function CustomerView () {
  const navigate = useNavigate()

  return (
    <MainLayout
      title='Customers'
      activeDrawer={{ active: 'Customers' }}
      breadcrumbs={
        <Breadcrumbs
          items={[{ text: 'Customers', url: '/customers' }, { text: 'List' }]}
        />
      }
      grid
      button
      btnProps={{
        label: 'New Customer',
        onClick: () => navigate('/new-customer')
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            options={{
              filtering: true,
              search: true
            }}
            columns={[
              {
                headerName: 'Name',
                field: 'name',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Account#',
                field: 'account',
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
                headerName: 'Invoicing',
                field: 'invoicing',
                flex: 1,
                minWidth: 80,
                renderCell: params => <CustomCell>{params.value}</CustomCell>
              },
              {
                headerName: 'Language',
                field: 'language',
                flex: 1,
                minWidth: 90,
                renderCell: params => <CustomCell>{params.value}</CustomCell>
              },
              {
                headerName: 'Status',
                field: 'status',
                flex: 1,
                minWidth: 80,
                renderCell: params => <CustomCell>{params.value}</CustomCell>
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                flex: 1,
                minWidth: 120,
                renderCell: params => (
                  <Button
                    startIcon={<EditSquareIcon />}
                    onClick={() => console.log(params)}
                    variant='text'
                    size='small'
                    sx={{
                      textTransform: 'capitalize',
                      '& .MuiButton-startIcon': { marginRight: 0.5 },
                      fontSize: '0.8rem',
                      minWidth: 'unset',
                      p: 0.5
                    }}
                  >
                    Edit
                  </Button>
                )
              }
            ]}
            data={[
              {
                id: 1,
                name: 'Mhd Ahd',
                account: 'mhd@gmail.com',
                phone: '03136125',
                invoicing: '#IN001',
                language: 'English',
                status: 'Pending'
              }
            ]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
