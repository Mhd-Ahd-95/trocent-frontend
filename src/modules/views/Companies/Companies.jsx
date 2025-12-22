import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table, Modal, ConfirmModal } from '../../components'
import { Grid, Button, Box } from '@mui/material'
import { DeleteForever, EditSquare } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useCompanies, useCompanyMutation } from '../../hooks/useComapnies'
import { useSnackbar } from 'notistack'

export default function Companies() {

  const navigate = useNavigate()
  const { data, isLoading, error, isError } = useCompanies()
  const { removeMany } = useCompanyMutation()
  const { enqueueSnackbar } = useSnackbar()
  const [openModal, setOpenModal] = React.useState(false)
  const [selectedCompanies, setSelectedCompanies] = React.useState([])
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
    setSelectedCompanies(selectedIds)
  }

  const handleDeleteCompanies = (iids) => {
    removeMany.mutate(iids)
    setSelectedCompanies([])
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
      title='Companies'
      activeDrawer={{ active: 'Companies' }}
      breadcrumbs={
        <Breadcrumbs
          items={[{ text: 'Companies', url: '/companies' }, { text: 'List' }]}
        />
      }
      grid
      button
      btnProps={{
        label: 'New Company',
        onClick: () => navigate('/company/create')
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            checkboxSelection
            deleteSelected={selectedCompanies.length > 0}
            handleDeleteSelected={() => setOpenModal(2)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            loading={isLoading}
            onRowClick={(params) => navigate(`/company/edit/${params.row.id}`)}
            options={{
              filtering: false,
              search: true
            }}
            field='operating_name'
            columns={[
              {
                headerName: 'Operating Name',
                field: 'operating_name',
                flex: 1,
                minWidth: 150,
                sortable: true
              },
              {
                headerName: 'Legal Name',
                field: 'legal_name',
                flex: 1,
                minWidth: 150
              },
              {
                headerName: 'Phone',
                field: 'phone',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Email',
                field: 'email',
                flex: 1,
                minWidth: 150
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
                      gap: 1,
                      marginTop: 1
                    }}
                  >
                    {/* <Button
                      startIcon={<EditSquare />}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/company/edit/${params.row.id}`)
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
                {selectedRef.current?.legal_name ?? 'Company'}
              </strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteCompanies([selectedRef.current.id])}
        />
      </Modal>
      <Modal open={openModal === 2} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>Companies</strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteCompanies([...selectedCompanies])}
        />
      </Modal>
    </MainLayout>
  )
}
