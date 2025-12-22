import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table, CustomCell, Modal, ConfirmModal, DrawerForm } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import AccessorialsApi from '../../apis/Accessorials.api'
import { useSnackbar } from 'notistack'
import AccessorialForm from './AccessorialForm'
import global from '../../global'
import { useAccessorialMutations, useAccessorials } from '../../hooks/useAccessorials'

export default function Accessorials() {

  const { _spacing } = global.methods
  const [accessorial, setAccessorial] = React.useState({})
  const [selectedAccessorials, setSelectedAccessorials] = React.useState([])
  const [openModal, setOpenModal] = React.useState(false)
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { data, isLoading, isError, error } = useAccessorials()

  const { create, update, removeMany } = useAccessorialMutations()


  const [rowSelectionModel, setRowSelectionModel] = React.useState({
    type: 'include',
    ids: new Set()
  })

  const handleSelectionChange = newModel => {
    setRowSelectionModel(newModel)
    let selectedIds = Array.from(newModel.ids)
    if (newModel.type === 'exclude' && selectedIds.length === 0) {
      selectedIds = data.map(row => row.id)
    }
    setSelectedAccessorials(selectedIds)
  }

  const handleDeleteAccessorials = (ids) => {
    removeMany.mutate(ids)
    setOpenModal(false)
  }

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      const errorMessage = message ? `${message} - ${status}` : error.message;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [isError, error])

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
        onClick: () => setOpenDrawer(1)
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            checkboxSelection
            deleteSelected={selectedAccessorials.length > 0}
            handleDeleteSelected={() => setOpenModal(2)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            loading={isLoading}
            options={{
              filtering: false,
              search: true
            }}
            onRowClick={(params) => {
              setAccessorial(params.row)
              setOpenDrawer(2)
            }}
            columns={[
              {
                headerName: 'Name',
                field: 'name',
                minWidth: 400,
                flex: 1,
                sortable: true
              },
              {
                headerName: 'Type',
                field: 'type',
                minWidth: 150,
                flex: 1,
                renderCell: params => <CustomCell color={params.value === 'fuel_based' ? 'red' : params.value === 'transport_based' ? 'green' : params.value === 'time_based' ? 'blue' : ''}>
                  {(_spacing(params.value))}
                </CustomCell>
              },
              {
                headerName: 'Visible Driver',
                field: 'is_driver',
                minWidth: 110,
                flex: 1,
                renderCell: params => params.value ? <CustomCell color='green'>Yes</CustomCell> : 'No'
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
                minWidth: 100,
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
                      onClick={(e) => {
                        e.stopPropagation()
                        setAccessorial(params.row)
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
                    {/* <Button
                      startIcon={<EditSquareIcon />}
                      onClick={(e) => {
                        e.stopPropagation()
                        setAccessorial(params.row)
                        setOpenDrawer(2)
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
                  </Box>
                )
              }
            ]}
            data={data || []}
          />
        </Grid>
      </Grid>
      <Modal open={openModal === 1} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>
                {accessorial?.name ?? 'Address Book'}
              </strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteAccessorials([accessorial.id])}
        />
      </Modal>
      <Modal open={openModal === 2} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>Accessorials</strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteAccessorials([...selectedAccessorials])}
        />
      </Modal>
      {openDrawer === 1 &&
        <DrawerForm title='Create Accessorial' setOpen={setOpenDrawer} open={openDrawer === 1}>
          <AccessorialForm
            initialValues={{}}
            submit={async (payload) => create.mutateAsync(payload)}
            setOpen={setOpenDrawer}
          />
        </DrawerForm>
      }
      {openDrawer === 2 &&
        <DrawerForm title='Edit Accessorial' setOpen={setOpenDrawer} open={openDrawer === 2}>
          <AccessorialForm
            initialValues={{ ...accessorial }}
            submit={async (payload) => await update.mutateAsync({ id: accessorial.id, payload })}
            setOpen={setOpenDrawer}
            editMode
          />
        </DrawerForm>
      }
    </MainLayout>
  )
}
