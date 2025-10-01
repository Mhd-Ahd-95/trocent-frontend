import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table, Modal, ConfirmModal } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { DeleteForever } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useInterlinerMutations, useInterliners } from '../../hooks/useInterliners'
import { useSnackbar } from 'notistack'

export default function Interliners() {
  const navigate = useNavigate()
  const { data, isLoading, error, isError } = useInterliners()
  const { removeMany } = useInterlinerMutations()
  const { enqueueSnackbar } = useSnackbar()
  const [openModal, setOpenModal] = React.useState(false)
  const [selectedInterliners, setSelectedInterliners] = React.useState([])
  const selectedRef = React.useRef()

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
    setSelectedInterliners(selectedIds)
  }

  const handleDeleteInterliners = (iids) => {
    removeMany.mutate(iids)
    setSelectedInterliners([])
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
      title='Interliners'
      activeDrawer={{ active: 'Interliners' }}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: 'Interliners', url: '/interliners' },
            { text: 'List' }
          ]}
        />
      }
      grid
      button
      btnProps={{
        label: 'New Interliner',
        onClick: () => navigate('/interliner/create')
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 20, 30]}
            pageSize={10}
            checkboxSelection
            deleteSelected={selectedInterliners.length > 0}
            handleDeleteSelected={() => setOpenModal(2)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            options={{
              filtering: false,
              search: true
            }}
            loading={isLoading}
            columns={[
              {
                headerName: 'Company Name',
                field: 'name',
                minWidth: 220,
                flex: 1
              },
              {
                headerName: 'Contact Name',
                field: 'contact_name',
                minWidth: 150,
                flex: 1
              },
              {
                headerName: 'Phone',
                field: 'phone',
                minWidth: 130,
                flex: 1
              },
              {
                headerName: 'Email',
                field: 'email',
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
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                flex: 1,
                minWidth: 150,
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
                        navigate(`/interliner/edit/${params.row.id}`)
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
                {selectedRef.current?.name ?? 'Interliner'}
              </strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteInterliners([selectedRef.current.id])}
        />
      </Modal>
      <Modal open={openModal === 2} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>Interliners</strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteInterliners([...selectedInterliners])}
        />
      </Modal>
    </MainLayout>
  )
}
