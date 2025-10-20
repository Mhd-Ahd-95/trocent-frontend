import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table, Modal, ConfirmModal, DrawerForm } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useDriverMutation, useDrivers } from '../../hooks/useDrivers'
import { CheckCircleOutline, HighlightOffOutlined } from '@mui/icons-material'
import { useQueryClient } from "@tanstack/react-query";
import DriverLogin from './CreateDriverLogin'
import EditLogin from './EditDriverLogin'


export default function Drivers() {

  const location = useLocation()
  const fromEditOrCreate = location.state?.fromEditOrCreate || false;
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const [selectedDrivers, setSelectedDrivers] = React.useState([])
  const { enqueueSnackbar } = useSnackbar()
  const { data, isLoading, isError, error, refetch, isFetching } = useDrivers()
  const [openModal, setOpenModal] = React.useState(false)
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const { removeMany, createDriverLogin } = useDriverMutation()
  const [driver, setDriver] = React.useState({})

  const state = queryClient.getQueryState(['drivers']);

  const [rowSelectionModel, setRowSelectionModel] = React.useState({
    type: 'include',
    ids: new Set(),
  })

  const handleSelectionChange = newModel => {
    setRowSelectionModel(newModel)
    let selectedIds = Array.from(newModel.ids)
    if (newModel.type === 'exclude' && selectedIds.length === 0) {
      selectedIds = data.map(row => row.id)
    }
    setSelectedDrivers(selectedIds)
  }

  const refetchDrivers = React.useCallback(() => refetch(), [state])


  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      const errorMessage = message ? `${message} - ${status}` : error.message;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
    if (state.dataUpdateCount === 1 && fromEditOrCreate) {
      refetchDrivers()
    }
  }, [isError, error, state?.dataUpdateCount])

  const handleDeleteDrivers = (dids) => {
    removeMany.mutate(dids)
    setSelectedDrivers([])
    setOpenModal(false)
  }

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
      btnProps={{ label: 'New Driver', onClick: () => navigate('/driver/create') }}
    >
      <Grid container spacing={2}>
        <Grid size={12} width={'100%'}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            checkboxSelection
            disableRowSelectionOnClick
            deleteSelected={selectedDrivers.length > 0}
            handleDeleteSelected={() => setOpenModal(true)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            loading={isLoading || isFetching}
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
                field: 'company_name',
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
                minWidth: 80,
                renderCell: rowData => rowData.value ? <CheckCircleOutline sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='success' /> : <HighlightOffOutlined sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='action' />
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
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/driver/edit/${params.row.id}`)
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
                    <Button
                      startIcon={<LockPersonOutlinedIcon />}
                      onClick={(e) => {
                        e.stopPropagation()
                        setDriver(params.row)
                        params.row?.user_id ? setOpenDrawer(2) : setOpenDrawer(1)
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
                      color='primary'
                    >
                      {params.row?.user_id ? 'Edit Login' : 'Create Login'}
                    </Button>
                  </Box>
                )
              }
            ]}
            data={data || []}
          />
        </Grid>
      </Grid>
      <Modal open={openModal} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>Drivers</strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteDrivers([...selectedDrivers])}
        />
      </Modal>
      {openDrawer && (
        <DrawerForm
          title='Create Login'
          open={openDrawer === 1}
          setOpen={setOpenDrawer}
        >
          <DriverLogin
            initialValues={{ type: 'driver', email: driver?.email || '', name: driver.fname }}
            submit={async (payload) => await createDriverLogin.mutateAsync({ id: driver.id, payload })}
            setOpen={setOpenDrawer}
          />
        </DrawerForm>
      )}

      {openDrawer && (
        <DrawerForm
          title='Create Login'
          open={openDrawer === 2}
          setOpen={setOpenDrawer}
        >
          <EditLogin
            user_id={driver.user_id}
            setOpenDrawer={setOpenDrawer}
          />
        </DrawerForm>
      )}
    </MainLayout>
  )
}
