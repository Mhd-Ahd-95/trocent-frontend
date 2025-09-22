import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, CustomCell, Table } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { RoleContext } from '../../contexts'

export default function Roles () {
  const navigate = useNavigate()
  const { roles, loading } = React.useContext(RoleContext)

  return (
    <MainLayout
      title='Roles'
      activeDrawer={{ active: 'Roles' }}
      chip={roles.length}
      breadcrumbs={
        <Breadcrumbs
          items={[{ text: 'Roles', url: '/roles' }, { text: 'List' }]}
        />
      }
      grid
      button
      btnProps={{ label: 'New Role', onClick: () => navigate('/roles/create') }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 20, 30]}
            pageSize={10}
            checkboxSelection
            options={{
              filtering: false,
              search: true,
              columns: false
            }}
            columns={[
              {
                headerName: 'Name',
                field: 'name',
                minWidth: 200,
                flex: 1
              },
              {
                headerName: 'Permissions',
                field: 'permissions',
                minWidth: 200,
                renderCell: params => (
                  <CustomCell color='green'>
                    {params.value?.length ?? 0}
                  </CustomCell>
                ),
                flex: 1
              },
              {
                headerName: 'Updated At',
                field: 'updated_at',
                minWidth: 200,
                flex: 1,
                valueFormatter: rowData =>
                  moment(rowData).format('MMM DD, YYYY hh:mm:ss')
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                minWidth: 200,
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
                      onClick={() => navigate(`/roles/edit/${params.row.id}`)}
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
            loading={loading}
            data={[...roles].sort(
              (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
            )}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
