import React from 'react'
import { MainLayout } from '../../layouts'
import {
  Breadcrumbs,
  ConfirmModal,
  CustomCell,
  Table,
  Modal
} from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { RoleContext } from '../../contexts'
import RoleApi from '../../apis/Role.api'
import { useSnackbar } from 'notistack'

export default function Roles() {
  const navigate = useNavigate()
  const { roles, loading, setRoles } = React.useContext(RoleContext)
  const [openModal, setOpenModal] = React.useState(false)
  const selectedRef = React.useRef({})
  const { enqueueSnackbar } = useSnackbar()
  const [selectedRoles, setSelectedRoles] = React.useState([])

  const handleDeleteRole = rids => {
    RoleApi.deleteRoles(rids)
      .then(res => {
        if (res.data) {
          const filtered = roles.filter(role => !rids.includes(role.id))
          setRoles([...filtered])
          enqueueSnackbar(`Roles has been deleted successfully`, {
            variant: 'success'
          })
          selectedRef.current = {}
          setSelectedRoles([])
          setOpenModal(false)
        }
      })
      .catch(error => {
        const message = error.response?.data.message
        const status = error.response?.status
        const errorMessage = message ? message + ' - ' + status : error.message
        enqueueSnackbar(errorMessage, { variant: 'error' })
      })
  }

  const [rowSelectionModel, setRowSelectionModel] = React.useState({
    type: 'include',
    ids: new Set()
  })

  const handleSelectionChange = newModel => {
    setRowSelectionModel(newModel)
    let selectedIds = Array.from(newModel.ids)
    if (newModel.type === 'exclude' && selectedIds.length === 0) {
      selectedIds = roles.map(row => row.id)
    }
    setSelectedRoles(selectedIds)
  }

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
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            checkboxSelection
            options={{
              filtering: false,
              search: true,
              columns: false
            }}
            deleteSelected={selectedRoles.length > 0}
            handleDeleteSelected={() => setOpenModal(2)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            onRowClick={(params) => navigate(`/roles/edit/${params.row.id}`)}
            columns={[
              {
                headerName: 'Name',
                field: 'name',
                minWidth: 220,
                flex: 1,
                sortable: true
              },
              {
                headerName: 'Permissions',
                field: 'permissions',
                minWidth: 220,
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
                minWidth: 220,
                flex: 1,
                valueFormatter: rowData =>
                  moment(rowData).format('MMM DD, YYYY hh:mm:ss')
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                minWidth: 100,
                renderCell: params => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      marginTop: 1
                    }}
                  >
                    {/* <Button
                      startIcon={<EditSquareIcon />}
                      onClick={e => {
                        e.stopPropagation()
                        navigate(`/roles/edit/${params.row.id}`)
                      }}
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
                    </Button> */}
                    <Button
                      startIcon={<DeleteForever />}
                      onClick={e => {
                        e.stopPropagation()
                        selectedRef.current = params.row
                        setOpenModal(1)
                      }}
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
      <Modal open={openModal === 1} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>
                {selectedRef.current?.name ?? 'Role'}
              </strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteRole([selectedRef.current.id])}
        />
      </Modal>
      <Modal open={openModal === 2} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>Roles</strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteRole([...selectedRoles])}
        />
      </Modal>
    </MainLayout>
  )
}
