import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table, CustomCell, Modal, ConfirmModal } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { useNavigate } from 'react-router-dom'
import { useCustomerMutation, useCustomers } from '../../hooks/useCustomers'
import { CheckCircleOutline, DeleteForever, HighlightOffOutlined } from '@mui/icons-material'

export default function CustomerView() {

  const navigate = useNavigate()
  const { data, isLoading, isFetching, isError, error } = useCustomers()
  const { removeMany } = useCustomerMutation()
  const selectedRef = React.useRef()
  const [selectedCustomers, setSelectedCustomers] = React.useState([])
  const [openModal, setOpenModal] = React.useState(false)

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
    setSelectedCustomers(selectedIds)
  }

  const handleDeleteCustomers = (iids) => {
    removeMany.mutate(iids)
    setSelectedCustomers([])
    selectedRef.current = {}
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
      title='Customers'
      activeDrawer={{ active: 'Customers' }}
      breadcrumbs={
        <Breadcrumbs
          items={[{ text: 'Customers', url: '/customers' }, { text: 'List' }]}
        />
      }
      grid
      button
      btnProps={{
        label: 'New Customer',
        onClick: () => navigate('/customer/create')
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            options={{
              filtering: true,
              search: true
            }}
            disableRowSelectionOnClick
            deleteSelected={selectedCustomers.length > 0}
            handleDeleteSelected={() => setOpenModal(2)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            loading={isLoading || isFetching}
            columns={[
              {
                headerName: 'Name',
                field: 'name',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Account#',
                field: 'account_number',
                flex: 1,
                minWidth: 150
              },
              {
                headerName: 'Phone',
                field: 'phone_number',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Invoicing',
                field: 'invoicing',
                flex: 1,
                minWidth: 80,
                renderCell: params => params.value ? <CustomCell>{params.value}</CustomCell> : ''
              },
              {
                headerName: 'Language',
                field: 'language',
                flex: 1,
                minWidth: 90,
                renderCell: params => params.value ? <CustomCell>{params.value === 'en' ? 'English' : params.value === 'fr' ? 'French' : ''}</CustomCell> : ''
              },
              {
                headerName: 'Status',
                field: 'account_active',
                flex: 1,
                minWidth: 80,
                renderCell: params => params.value ? <CheckCircleOutline sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='success' /> : <HighlightOffOutlined sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='action' />
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                flex: 1,
                minWidth: 120,
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
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/customer/edit/${params.row.id}`)
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
                      startIcon={<DeleteForever />}
                      onClick={(e) => {
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
                {selectedRef.current?.name ?? 'Customer'}
              </strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteCustomers([selectedRef.current.id])}
        />
      </Modal>
      <Modal open={openModal === 2} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>Customers</strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteCustomers([...selectedCustomers])}
        />
      </Modal>
    </MainLayout>
  )
}
