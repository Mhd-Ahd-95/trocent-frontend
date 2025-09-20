import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table, StyledButton } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function VehicleTypes () {
  const navigate = useNavigate()

  return (
    <MainLayout
      title='Vehicle Types'
      activeDrawer={{ active: 'Vehicle Types' }}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: 'Vehicle Types', url: '/vehicle-types' },
            { text: 'List' }
          ]}
        />
      }
      grid
      button
      btnProps={{
        label: 'New Vehicle Type',
        onClick: () => navigate('/new-vehicle-type')
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
                headerName: 'Name',
                field: 'name',
                flex: 1,
                minWidth: 200
              },
              {
                headerName: 'Rate',
                field: 'rate',
                flex: 1,
                minWidth: 100
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                flex: 1,
                width: 200,
                renderCell: params => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      marginTop: 1
                    }}
                  >
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
                  </Box>
                )
              }
            ]}
            data={[{ id: 1, name: 'Mhd Ahd', rate: 2.75 }]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
