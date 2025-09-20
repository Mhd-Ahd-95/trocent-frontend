import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table, CustomCell } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function Accessorials () {
  const navigate = useNavigate()

  return (
    <MainLayout
      title='Accessorials'
      activeDrawer={{ active: 'Accessorials' }}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: 'Accessorials', url: '/accessorials' },
            { text: 'List' }
          ]}
        />
      }
      grid
      button
      btnProps={{
        label: 'New Accessorial',
        onClick: () => navigate('/new-accessorial')
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
                minWidth: 250,
                flex: 1
              },
              {
                headerName: 'Type',
                field: 'type',
                minWidth: 150,
                flex: 1,
                renderCell: params => <CustomCell>{params.value}</CustomCell>
              },
              {
                headerName: 'Visible Driver',
                field: 'visible_driver',
                minWidth: 110,
                flex: 1
              },
              {
                headerName: 'Amount',
                field: 'amount',
                minWidth: 100,
                flex: 1
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                flex: 1,
                minWidth: 200,
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
            data={[
              {
                id: 1,
                name: 'Mhd Ahd',
                type: 'fixed_price',
                visible_driver: 'No',
                amount: 200
              }
            ]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
