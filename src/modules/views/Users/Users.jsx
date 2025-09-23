import React from 'react'
import { MainLayout } from '../../layouts'
import {
  Breadcrumbs,
  Table,
  CustomCell,
  Tabs,
  DrawerForm,
  ConfirmModal,
  Modal
} from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import UserAPI from '../../apis/User.api'
import { useSnackbar } from 'notistack'
import UserForm from './UserForm'

function UsersTable (props) {
  const { data, loading } = props

  return (
    <Table
      pageSizeOptions={[10, 20, 30]}
      pageSize={10}
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
                  onClick={e => {
                    e.stopPropagation()
                    props.setSelected(params.row)
                    props.setOpenDrawer(2)
                  }}
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
                    onClick={e => {
                      e.stopPropagation()
                      props.setOpenModal(true)
                      props.setSelected(params.row)
                    }}
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
  const [loading, setLoading] = React.useState(true)
  const [users, setUsers] = React.useState([])
  const { enqueueSnackbar } = useSnackbar()
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState({})
  const [openModal, setOpenModal] = React.useState(false)

  const loadUsers = React.useCallback(() => {
    UserAPI.getUsers()
      .then(res => setUsers(res.data.data))
      .catch(err =>
        enqueueSnackbar('Failed to load users', { variant: 'error' })
      )
      .finally(() => setLoading(false))
  }, [enqueueSnackbar])

  React.useEffect(() => loadUsers(), [loadUsers])

  const handleDeleteUser = uid => {
    UserAPI.deleteUser(uid)
      .then(res => {
        if (res.data) {
          const filtered = users.filter(usr => usr.id !== uid)
          setUsers([...filtered])
          enqueueSnackbar('User has been successfully deleted', {
            variant: 'success'
          })
        }
      })
      .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
  }

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
      btnProps={{
        label: 'New User',
        onClick: () => setOpenDrawer(1)
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Grid container justifyContent={'center'}>
            <Grid size={12}>
              <Tabs
                labels={['All', 'Staff', 'Drivers', 'Customers']}
                contents={[
                  <UsersTable
                    setOpenModal={setOpenModal}
                    setOpenDrawer={setOpenDrawer}
                    setSelected={setSelectedUser}
                    data={users}
                    setData={setUsers}
                    loading={loading}
                  />,
                  <UsersTable
                    setOpenModal={setOpenModal}
                    setOpenDrawer={setOpenDrawer}
                    setSelected={setSelectedUser}
                    data={users.filter(user => user.type === 'staff')}
                    setData={setUsers}
                    loading={loading}
                  />,
                  <UsersTable
                    setOpenModal={setOpenModal}
                    setOpenDrawer={setOpenDrawer}
                    setSelected={setSelectedUser}
                    data={users.filter(user => user.type === 'driver')}
                    setData={setUsers}
                    loading={loading}
                  />,
                  <UsersTable
                    setOpenModal={setOpenModal}
                    setOpenDrawer={setOpenDrawer}
                    setSelected={setSelectedUser}
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
      {openDrawer === 1 && (
        <DrawerForm
          title='Create User'
          open={openDrawer === 1}
          setOpen={setOpenDrawer}
        >
          <UserForm
            initialValues={{ password: '' }}
            submit={payload => UserAPI.createUser(payload)}
            setUsers={setUsers}
            users={users}
            setOpen={setOpenDrawer}
          />
        </DrawerForm>
      )}
      {openDrawer === 2 && (
        <DrawerForm
          title='Edit User'
          open={openDrawer === 2}
          setOpen={setOpenDrawer}
        >
          <UserForm
            initialValues={{
              ...selectedUser,
              role: selectedUser?.role[0]?.name
            }}
            submit={payload => UserAPI.updateUser(selectedUser.id, payload)}
            setUsers={setUsers}
            users={users}
            setOpen={setOpenDrawer}
            editMode
          />
        </DrawerForm>
      )}
      <Modal open={openModal} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>
                {selectedUser?.name ?? 'User'}
              </strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteUser(selectedUser.id)}
        />
      </Modal>
    </MainLayout>
  )
}
