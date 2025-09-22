import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table, CustomCell, Tabs } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import UserAPI from '../../apis/User.api'
import { useSnackbar } from 'notistack'

function UsersTable (props) {
  const { data, setData, loading } = props

  return (
    <Table
      pageSizeOptions={[10, 20, 30]}
      pageSize={10}
      checkboxSelection
      loading={loading}
      options={{
        filtering: true,
        search: true,
        columns: false
      }}
      columns={[
        {
          headerName: 'Name',
          field: 'name',
          minWidth: 150,
          flex: 1
        },
        {
          headerName: 'Username',
          field: 'username',
          minWidth: 200,
          flex: 1
        },
        {
          headerName: 'Email',
          field: 'email',
          minWidth: 200,
          flex: 1
        },
        {
          headerName: 'Type',
          field: 'type',
          minWidth: 100,
          flex: 1,
          renderCell: params => <CustomCell>{params.value}</CustomCell>
        },
        {
          field: 'actions',
          headerName: 'Actions',
          sortable: false,
          minWidth: 200,
          renderCell: params => {
            return (
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
                    '& .MuiButton-startIcon': {
                      marginRight: 0.5
                    },
                    fontSize: '0.8rem',
                    minWidth: 'unset',
                    p: 0.5
                  }}
                >
                  Edit
                </Button>
                {params?.row?.type !== 'admin' && (
                  <Button
                    startIcon={<DeleteForever />}
                    onClick={() => console.log(params)}
                    variant='text'
                    size='small'
                    sx={{
                      textTransform: 'capitalize',
                      '& .MuiButton-startIcon': {
                        marginRight: 0.5
                      },
                      fontSize: '0.8rem',
                      minWidth: 'unset',
                      p: 0.5
                    }}
                    color='error'
                  >
                    Delete
                  </Button>
                )}
              </Box>
            )
          }
        }
      ]}
      data={[...data]}
    />
  )
}

export default function Users () {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [users, setUsers] = React.useState([])
  const { enqueueSnackbar } = useSnackbar()

  const loadUsers = React.useCallback(() => {
    UserAPI.getUsers()
      .then(res => setUsers(res.data.data))
      .catch(err =>
        enqueueSnackbar('Failed to load users', { variant: 'error' })
      )
      .finally(() => setLoading(false))
  }, [enqueueSnackbar])

  React.useEffect(() => loadUsers(), [loadUsers])

  return (
    <MainLayout
      title='Users'
      activeDrawer={{ active: 'Users' }}
      breadcrumbs={
        <Breadcrumbs
          items={[{ text: 'Users', url: '/users' }, { text: 'List' }]}
        />
      }
      grid
      button
      btnProps={{ label: 'New User', onClick: () => navigate('/new-user') }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Grid container justifyContent={'center'}>
            <Grid size={12}>
              <Tabs
                labels={['All', 'Staff', 'Drivers', 'Customers']}
                contents={[
                  <UsersTable
                    data={users}
                    setData={setUsers}
                    loading={loading}
                  />,
                  <UsersTable
                    data={users.filter(user => user.type === 'staff')}
                    setData={setUsers}
                    loading={loading}
                  />,
                  <UsersTable
                    data={users.filter(user => user.type === 'driver')}
                    setData={setUsers}
                    loading={loading}
                  />,
                  <UsersTable
                    data={users.filter(user => user.type === 'customer')}
                    setData={setUsers}
                    loading={loading}
                  />
                ]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainLayout>
  )
}
