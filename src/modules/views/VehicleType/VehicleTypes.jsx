import React from 'react'
import { MainLayout } from '../../layouts'
import {
  Breadcrumbs,
  Table,
  Modal,
  ConfirmModal,
  DrawerForm
} from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import VehicleTypeForm from './VehicleTypeForm'
import { useVehicleTypeMutations, useVehicleTypes } from '../../hooks/useVehicleType'

export default function VehicleTypes() {
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [openModal, setOpenModal] = React.useState(false)
  const [selectedTypes, setSelectedTypes] = React.useState([])
  const [vehicleType, setVehicleType] = React.useState({})
  const selectedRef = React.useRef()
  const { enqueueSnackbar } = useSnackbar()
  const { data, isLoading, isFetching, isError, error } = useVehicleTypes()
  const { create, update, removeMany } = useVehicleTypeMutations()

  const handleClear = () => {
    setSelectedTypes([])
    selectedRef.current = null
    setRowSelectionModel({ type: 'include', ids: new Set() })
    setOpenModal(false)
  }

  const handleDeleteVehicleType = ids => {
    removeMany.mutate(ids)
    handleClear()
  }

  const [rowSelectionModel, setRowSelectionModel] = React.useState({
    type: 'include',
    ids: new Set()
  })

  const handleSelectionChange = newModel => {
    setRowSelectionModel(newModel)
    let selectedIds = Array.from(newModel.ids)
    if (newModel.type === 'exclude' && selectedIds.length === 0) {
      selectedIds = vehicleTypes.map(row => row.id)
    }
    setSelectedTypes(selectedIds)
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
        onClick: () => setOpenDrawer(1)
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            loading={isLoading || isFetching}
            checkboxSelection
            deleteSelected={selectedTypes.length > 0}
            handleDeleteSelected={() => setOpenModal(2)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
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
                    <Button
                      startIcon={<EditSquareIcon />}
                      onClick={e => {
                        e.stopPropagation()
                        setVehicleType(params.row)
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
                    </Button>
                  </Box>
                )
              }
            ]}
            data={data || []}
          />
        </Grid>
      </Grid>
      {openDrawer === 1 && (
        <DrawerForm
          title='Create Vehicle Type'
          open={openDrawer === 1}
          setOpen={setOpenDrawer}
        >
          <VehicleTypeForm
            initialValues={{}}
            submit={async (payload) => create.mutateAsync(payload)}
            setOpen={setOpenDrawer}
          />
        </DrawerForm>
      )}
      {openDrawer === 2 && (
        <DrawerForm
          title='Edit Vehicle Type'
          open={openDrawer === 2}
          setOpen={setOpenDrawer}
        >
          <VehicleTypeForm
            initialValues={{ ...vehicleType }}
            submit={async (payload) => await update.mutateAsync({ id: vehicleType.id, payload })}
            editMode
            setOpen={setOpenDrawer}
          />
        </DrawerForm>
      )}
      <Modal open={openModal === 1} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>
                {selectedRef.current?.name ?? 'Vehicle Type'}
              </strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteVehicleType([selectedRef.current.id])}
        />
      </Modal>
      <Modal open={openModal === 2} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>
                Vehicle Types
              </strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteVehicleType([...selectedTypes])}
        />
      </Modal>
    </MainLayout>
  )
}
