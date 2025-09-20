import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function AddressBook () {
  const navigate = useNavigate()

  return (
    <MainLayout
      title='Address Book'
      activeDrawer={{ active: 'Address Book' }}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: 'Address Book', url: '/address-book' },
            { text: 'List' }
          ]}
        />
      }
      grid
      button
      btnProps={{
        label: 'New Address Book',
        onClick: () => navigate('/new-address-book')
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 20, 30]}
            pageSize={10}
            checkboxSelection
            options={{
              filtering: true,
              search: true,
              columns: true
            }}
            columns={[
              {
                headerName: 'Company/Location',
                field: 'company_location',
                minWidth: 150,
                flex: 1
              },
              {
                headerName: 'Contact',
                field: 'contact',
                minWidth: 100,
                flex: 1
              },
              {
                headerName: 'Address',
                field: 'address',
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
                headerName: 'Province',
                field: 'province',
                minWidth: 100,
                flex: 1
              },
              {
                headerName: 'Phone',
                field: 'phone',
                minWidth: 120,
                flex: 1
              },
              {
                headerName: 'Appt',
                field: 'appt',
                minWidth: 100,
                flex: 1
              },
              {
                headerName: 'No Wait',
                field: 'no_wait',
                minWidth: 100,
                flex: 1
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                minWidth: 150,
                flex: 1,
                renderCell: params => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginTop: 1
                    }}
                  >
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
                    <Button
                      startIcon={<DeleteForever />}
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
                      color='error'
                    >
                      Delete
                    </Button>
                  </Box>
                )
              }
            ]}
            data={[
              {
                id: 1,
                company_location: 'XYZ',
                contact: 'ABC',
                city: 'Tripoli',
                address: 'Abou Samra - block A/18',
                province: 'Akkar',
                phone: '00961 3 136 125',
                appt: 'Time',
                no_wait: true
              }
            ]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
