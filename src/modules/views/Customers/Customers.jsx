import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table, CustomCell } from '../../components'
import { Grid, Button } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCustomers } from '../../hooks/useCustomers'
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircleOutline, HighlightOffOutlined } from '@mui/icons-material'

export default function CustomerView() {

  const navigate = useNavigate()
  const location = useLocation()
  const fromEditOrCreate = location.state?.fromEditOrCreate || false;
  const { data, isLoading, isFetching, isError, error, refetch } = useCustomers()
  const queryClient = useQueryClient();
  const state = queryClient.getQueryState(['customers']);


  const refetchCustomers = React.useCallback(() => refetch(), [state])

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      const errorMessage = message ? `${message} - ${status}` : error.message;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
    if (state.dataUpdateCount === 1 && fromEditOrCreate) {
      refetchCustomers()
    }
  }, [isError, error, state?.dataUpdateCount])

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
                )
              }
            ]}
            data={data || []}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
