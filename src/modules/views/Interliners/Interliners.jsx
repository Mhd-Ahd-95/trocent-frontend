import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table } from '../../components'
import { Grid, Button } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { useNavigate } from 'react-router-dom'

export default function Interliners () {
  const navigate = useNavigate()

  return (
    <MainLayout
      title='Interliners'
      activeDrawer={{ active: 'Interliners' }}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: 'Interliners', url: '/interliners' },
            { text: 'List' }
          ]}
        />
      }
      grid
      button
      btnProps={{
        label: 'New Interliner',
        onClick: () => navigate('/new-interliner')
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
                headerName: 'Company Name',
                field: 'name',
                minWidth: 220,
                flex: 1
              },
              {
                headerName: 'Contact Name',
                field: 'legal_name',
                minWidth: 150,
                flex: 1
              },
              {
                headerName: 'Phone',
                field: 'phone',
                minWidth: 130,
                flex: 1
              },
              {
                headerName: 'Email',
                field: 'email',
                minWidth: 200,
                flex: 1
              },
              {
                headerName: 'City',
                field: 'city',
                minWidth: 130,
                flex: 1
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
            data={[]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
