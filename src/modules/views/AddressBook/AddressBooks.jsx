import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, ConfirmModal, DrawerForm, Modal, Table } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { AccessTime, CheckCircleOutline, DeleteForever, HighlightOffOutlined } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useAddressBookMutations, useAddressBooks } from '../../hooks/useAddressBooks'
import AddressBookForm from './AddressBookForm'

export default function AddressBook() {
  const { enqueueSnackbar } = useSnackbar()
  const [addressBook, setAddressBook] = React.useState({})
  const selectedRef = React.useRef()
  const [selectedBooks, setSelectedBooks] = React.useState([])
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [openModal, setOpenModal] = React.useState(false)
  const [rowSelectionModel, setRowSelectionModel] = React.useState({
    type: 'include',
    ids: new Set()
  })

  const { data, isLoading, isError, error } = useAddressBooks()
  const { removeMany, create, update } = useAddressBookMutations()

  const handleDeleteAddressBook = (ids) => {
    removeMany.mutate(ids)
    selectedRef.current = null
    setSelectedBooks([])
    setRowSelectionModel({
      type: 'include',
      ids: new Set()
    })
    setOpenModal(false)
  }

  const handleSelectionChange = newModel => {
    setRowSelectionModel(newModel)
    let selectedIds = Array.from(newModel.ids)
    if (newModel.type === 'exclude' && selectedIds.length === 0) {
      selectedIds = data?.map(row => row.id)
    }
    setSelectedBooks(selectedIds)
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
      title='Address Book'
      activeDrawer={{ active: 'Address Book' }}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: 'Address Book', url: '/address-book' },
            { text: 'List' }
          ]}
        />
      }
      grid
      button
      btnProps={{
        label: 'New Address',
        onClick: () => setOpenDrawer(1)
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            checkboxSelection
            deleteSelected={selectedBooks.length > 0}
            handleDeleteSelected={() => setOpenModal(2)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            loading={isLoading}
            options={{
              filtering: true,
              search: true,
              columns: true
            }}
            columns={[
              {
                headerName: 'Company/Location',
                field: 'name',
                minWidth: 150,
                flex: 1,
                renderCell: rowData => <strong style={{ fontWeight: 600 }}>{rowData.value}</strong>
              },
              {
                headerName: 'Contact',
                field: 'contact_name',
                minWidth: 100,
                flex: 1
              },
              {
                headerName: 'Address',
                field: 'address',
                minWidth: 200,
                flex: 1
              },
              {
                headerName: 'City',
                field: 'city',
                minWidth: 130,
                flex: 1
              },
              {
                headerName: 'Province',
                field: 'province',
                minWidth: 100,
                flex: 1
              },
              {
                headerName: 'Phone',
                field: 'phone_number',
                minWidth: 120,
                flex: 1
              },
              {
                headerName: 'Appt',
                field: 'requires_appointment',
                minWidth: 100,
                flex: 1,
                renderCell: rowData => rowData.value ? <AccessTime sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='primary' /> : <HighlightOffOutlined sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='action' />
              },
              {
                headerName: 'No Wait',
                field: 'no_waiting_time',
                minWidth: 100,
                flex: 1,
                renderCell: rowData => rowData.value ? <CheckCircleOutline sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='success' /> : <HighlightOffOutlined sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='action' />
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                minWidth: 150,
                flex: 1,
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
                        setAddressBook(params.row)
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
                {selectedRef.current?.name ?? 'Address Book'}
              </strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteAddressBook([selectedRef.current.id])}
        />
      </Modal>
      <Modal open={openModal === 2} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>Address Books</strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteAddressBook([...selectedBooks])}
        />
      </Modal>
      {openDrawer === 1 &&
        <DrawerForm title='Create Address' setOpen={setOpenDrawer} open={openDrawer === 1}>
          <AddressBookForm
            initialValues={{}}
            submit={async (payload) => await create.mutateAsync(payload)}
            setOpen={setOpenDrawer}
          />
        </DrawerForm>
      }
      {openDrawer === 2 &&
        <DrawerForm title='Edit Address' setOpen={setOpenDrawer} open={openDrawer === 2}>
          <AddressBookForm
            initialValues={{ ...addressBook }}
            submit={async (payload) => update.mutateAsync({ id: addressBook.id, payload })}
            editMode
            setOpen={setOpenDrawer}
          />
        </DrawerForm>
      }
    </MainLayout>
  )
}
