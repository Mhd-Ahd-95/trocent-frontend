import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, CustomCell, Table } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import RoleAPI from '../../apis/Role.api'
import { useSnackbar } from 'notistack'

export default function Roles () {
  const navigate = useNavigate()
  const [roles, setRoles] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const { enqueueSnackbar } = useSnackbar()

  const loadRoles = React.useCallback(() => {
    RoleAPI.getRoles()
      .then(res => setRoles(res.data))
      .catch(err =>
        enqueueSnackbar('Failed to load role', { variant: 'error' })
      )
      .finally(() => setLoading(false))
  }, [enqueueSnackbar])

  React.useEffect(() => loadRoles(), [loadRoles])

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
      btnProps={{ label: 'New Role', onClick: () => navigate('/new-role') }}
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
                  <CustomCell color='green'>{params.value.length ?? 0}</CustomCell>
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
            loading={loading}
            data={[...roles]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
