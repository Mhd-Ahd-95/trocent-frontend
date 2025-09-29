import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, ConfirmModal, DrawerForm, Modal, Table } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { AccessTime, CheckCircleOutline, Close, DeleteForever } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { AddressBookContext } from '../../contexts'
import AddressBooksApi from '../../apis/AddressBooks.api'
import AddressBookForm from './AddressBookForm'

export default function AddressBook() {
  const { enqueueSnackbar } = useSnackbar()
  const { addressBooks, loading, setAddressBooks } = React.useContext(AddressBookContext)
  const [addressBook, setAddressBook] = React.useState({})
  const selectedRef = React.useRef()
  const [selectedBooks, setSelectedBooks] = React.useState([])
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [openModal, setOpenModal] = React.useState(false)

  const handleDeleteAddressBook = (ids) => {
    AddressBooksApi.deleteAddressBooks(ids)
      .then(res => {
        if (res.data) {
          const filtered = addressBooks.filter((ab) => !ids.includes(ab.id))
          setAddressBooks([...filtered])
          enqueueSnackbar('Address book has been successfully deleted', { variant: 'success' })
        }
      })
      .catch(error => {
        const message = error.response?.data.message
        const status = error.response?.status
        const errorMessage = message ? message + ' - ' + status : error.message
        enqueueSnackbar(errorMessage, { variant: 'error' })
      })
      .finally(() => setOpenModal(false))
  }

  const [rowSelectionModel, setRowSelectionModel] = React.useState({
    type: 'include',
    ids: new Set()
  })

  const handleSelectionChange = newModel => {
    setRowSelectionModel(newModel)
    let selectedIds = Array.from(newModel.ids)
    if (newModel.type === 'exclude' && selectedIds.length === 0) {
      selectedIds = addressBooks.map(row => row.id)
    }
    setSelectedBooks(selectedIds)
  }

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
        label: 'New Address Book',
        onClick: () => setOpenDrawer(1)
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 20, 30]}
            pageSize={10}
            checkboxSelection
            deleteSelected={selectedBooks.length > 0}
            handleDeleteSelected={() => setOpenModal(2)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            loading={loading}
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
                renderCell: rowData => rowData.value ? <AccessTime sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='primary' /> : <Close sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='action'/>
              },
              {
                headerName: 'No Wait',
                field: 'no_waiting_time',
                minWidth: 100,
                flex: 1,
                renderCell: rowData => rowData.value ? <CheckCircleOutline sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='success' /> : <Close sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='action'/>
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
            data={addressBooks}
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
        <DrawerForm title='Create Address Book' setOpen={setOpenDrawer} open={openDrawer === 1}>
          <AddressBookForm
            initialValues={{}}
            submit={(payload) => AddressBooksApi.createAddressBook(payload)}
            addressBooks={addressBooks}
            setAddressBooks={setAddressBooks}
            setOpen={setOpenDrawer}
          />
        </DrawerForm>
      }
      {openDrawer === 2 &&
        <DrawerForm title='Edit Address Book' setOpen={setOpenDrawer} open={openDrawer === 2}>
          <AddressBookForm
            initialValues={{ ...addressBook }}
            submit={(payload) => AddressBooksApi.updateAddressBook(addressBook.id, payload)}
            addressBooks={addressBooks}
            setAddressBooks={setAddressBooks}
            editMode
            setOpen={setOpenDrawer}
          />
        </DrawerForm>
      }
    </MainLayout>
  )
}
