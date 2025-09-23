import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined'
import { useNavigate } from 'react-router-dom'

export default function Drivers () {
  const navigate = useNavigate()

  return (
    <MainLayout
      title='Drivers'
      activeDrawer={{ active: 'Drivers' }}
      breadcrumbs={
        <Breadcrumbs
          items={[{ text: 'Drivers', url: '/drivers' }, { text: 'List' }]}
        />
      }
      grid
      button
      btnProps={{ label: 'New Driver', onClick: () => navigate('/new-driver') }}
    >
      <Grid container spacing={2}>
        <Grid size={12} width={'100%'}>
          <Table
            pageSizeOptions={[10, 20, 30]}
            pageSize={10}
            checkboxSelection
            options={{
              filtering: true,
              search: true
            }}
            columns={[
              {
                headerName: 'Driver Number',
                field: 'driver_number',
                flex: 1,
                minWidth: 150
              },
              {
                headerName: 'First Name',
                field: 'fname',
                flex: 1,
                minWidth: 130
              },
              {
                headerName: 'Last Name',
                field: 'lname',
                flex: 1,
                minWidth: 130
              },
              {
                headerName: 'Company',
                field: 'company',
                flex: 1,
                minWidth: 150
              },
              {
                headerName: 'Login Email',
                field: 'email',
                flex: 1,
                minWidth: 180
              },
              {
                headerName: 'TDG',
                field: 'tdg',
                flex: 1,
                minWidth: 80
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                minWidth: 180,
                flex: 1,
                renderCell: params => (
                  <Box
                    sx={{
                      display: 'flex',
                      // justifyContent: "center",
                      alignItems: 'center',
                      gap: 1,
                      marginTop: 1,
                      '& svg': {
                        fontSize: 10
                      }
                    }}
                  >
                    <Button
                      startIcon={
                        <EditSquareIcon sx={{ fontSize: '10px', padding: 0 }} />
                      }
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
                      startIcon={<LockPersonOutlinedIcon />}
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
                      color='primary'
                    >
                      Create Login
                    </Button>
                  </Box>
                )
              }
            ]}
            data={[
              {
                id: 1,
                driver_number: 'D123',
                fname: 'Mhd',
                lname: 'Ahd',
                company: 'XYZ',
                Phone: '009613136125',
                email: 'ahdmhd@gmail.com',
                tdg: 'No'
              }
            ]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
