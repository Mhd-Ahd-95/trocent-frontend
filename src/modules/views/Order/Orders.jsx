import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, CustomCell, Table, Modal, Confirmation } from '../../components'
import { Grid, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip, CircularProgress, Typography } from '@mui/material'
import moment from 'moment/moment'
import { useNavigate } from 'react-router-dom'
import { useOrderMutations, useOrderPagination } from '../../hooks/useOrders'
import { MoreHoriz, Edit, Cancel, Download, RotateLeftOutlined } from '@mui/icons-material'
import globalVariables from '../../global'
import { useQueryClient } from '@tanstack/react-query'
import OrderApi from '../../apis/Order.api'
import { generateBillOfLadingPDF } from '../../components/OrderFormSections/generateBillOfLadingPDF'
import { useSnackbar } from 'notistack'

export default function OrdersView() {
  const navigate = useNavigate()
  const authedUser = globalVariables.auth.user
  const [anchorEl, setAnchorEl] = React.useState(null)
  const selectedRowRef = React.useRef()
  const [actionLoading, setActionLoading] = React.useState(false)
  const { patchStatus } = useOrderMutations()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const [downloading, setDownloading] = React.useState(false)
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(50);
  const [openModal, setOpenModal] = React.useState(false)

  const { data, isLoading, isFetching } = useOrderPagination(page + 1, pageSize);

  const handleClick = React.useCallback((event, rowData) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    selectedRowRef.current = rowData
  }, [])

  const handleClose = React.useCallback(() => {
    setAnchorEl(null)
    selectedRowRef.current = null
  }, [])

  const handleCancel = React.useCallback(async (sts) => {
    setActionLoading(true)
    try {
      await patchStatus.mutateAsync({ id: selectedRowRef.current.id, uid: authedUser.id, sts: sts })
      handleClose()
    }
    catch (err) {
      //
    }
    finally {
      setActionLoading(false)
    }
  }, [selectedRowRef.current])

  const handleDownloadInvoice = React.useCallback(async (e) => {
    e.preventDefault()
    setDownloading(true)
    try {
      const orderId = selectedRowRef.current?.id
      if (!orderId) return
      let currentData = queryClient.getQueryData(['order', Number(orderId)])
      const messagers = queryClient.getQueryData(['addressBookByName', 'messagers'])
      if (!currentData) {
        currentData = await queryClient.fetchQuery({
          queryKey: ['order', Number(orderId)],
          queryFn: async () => {
            const res = await OrderApi.getOrderById(orderId)
            return res.data
          },
          staleTime: 5 * 60 * 1000,
          gcTime: 60 * 60 * 1000,
          refetchOnWindowFocus: false,
          retry: 0,
        })
      }
      currentData['customer_accessorials'] = currentData['accessorials_customer']
      currentData['customer_vehicle_types'] = currentData['vehicle_types_customer']
      const language = currentData?.customer?.language || 'en'
      currentData['messagers'] = messagers
      currentData['customer_number'] = currentData['customer']['account_number']
      const pdf = await generateBillOfLadingPDF(currentData, language);
      pdf.save(`${language === 'en' ? 'BOL' : 'Connaissement'}_${currentData.order_number}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      enqueueSnackbar('PDF generation error', { variant: 'error' })
    }
    finally {
      setDownloading(false)
      handleClose()
    }
  }, [selectedRowRef.current, handleClose])


  const columns = React.useMemo(() => [
    {
      headerName: 'Order #',
      field: 'order_number',
      flex: 1,
      minWidth: 60
    },
    {
      headerName: 'Customer',
      field: 'customer_name',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: 'References',
      field: 'reference_numbers',
      flex: 1,
      minWidth: 100,
      renderCell: params => params.value && params.value.length > 0 ? params.value[0] : ''
    },
    {
      headerName: 'Status',
      field: 'order_status',
      flex: 1,
      minWidth: 90,
      renderCell: params => params.value ? (
        <CustomCell
          color={
            params.value === 'Canceled' ? 'red' :
              params.value === 'Entered' ? 'blue' :
                params.value === 'Dispatched' ? 'green' :
                  null
          }
        >
          {params.value}
        </CustomCell>
      ) : ''
    },
    {
      headerName: 'Shipper Name',
      field: 'shipper_name',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Shipper Address',
      field: 'shipper_address',
      flex: 1,
      minWidth: 230,
      description: 'Shipper: Address, City, Province, Postal Code',
      display: 'flex',
      renderCell: params => {
        const fullAddress = (
          <div style={{ whiteSpace: 'pre-line' }}>
            {params.row.shipper_address || ''}<br></br>
            {params.row.shipper_city || '-'}<br></br>
            {params.row.shipper_province || '-'}<br></br>
            {params.row.shipper_postal_code || '-'}
          </div>
        )
        return <Tooltip placement='auto-end' title={fullAddress} arrow ><Box style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Typography variant='caption'>{params.row.shipper_address ? params.row.shipper_address : '-'}</Typography>
          <Typography variant='caption'>{params.row.shipper_city ? params.row.shipper_city : '-'} | {params.row.shipper_province ? params.row.shipper_province : '-'} | {params.row.shipper_postal_code ? params.row.shipper_postal_code : '-'}</Typography>
          {/* <Typography variant='caption'>{params.row.shipper_province ? params.row.shipper_province : ''}</Typography>
          <Typography variant='caption'>{params.row.shipper_postal_code ? params.row.shipper_postal_code : ''}</Typography> */}
        </Box>
        </Tooltip>
      }
    },
    {
      headerName: 'Receiver Name',
      field: 'receiver_name',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Receiver Address',
      field: 'receiver_address',
      flex: 1,
      minWidth: 230,
      description: 'Receiver: Address, City, Province, Postal Code',
      display: 'flex',
      renderCell: params => {
        const fullAddress = (
          <div style={{ whiteSpace: 'pre-line' }}>
            {params.row.receiver_address || ''}<br></br>
            {params.row.receiver_city || '-'}<br></br>
            {params.row.receiver_province || '-'}<br></br>
            {params.row.receiver_postal_code || '-'}
          </div>
        )
        return <Tooltip placement='auto-end' title={fullAddress} arrow ><Box style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Typography variant='caption'>{params.row.receiver_address ? params.row.receiver_address : '-'}</Typography>
          <Typography variant='caption'>{params.row.receiver_city ? params.row.receiver_city : '-'} | {params.row.receiver_province ? params.row.receiver_province : '-'} | {params.row.receiver_postal_code ? params.row.receiver_postal_code : '-'}</Typography>
          {/* <Typography variant='caption'>{params.row.shipper_province ? params.row.shipper_province : ''}</Typography>
          <Typography variant='caption'>{params.row.shipper_postal_code ? params.row.shipper_postal_code : ''}</Typography> */}
        </Box>
        </Tooltip>
      }
    },
    {
      headerName: 'PickUp',
      field: 'pickup_date',
      flex: 1,
      minWidth: 160,
      valueFormatter: val => moment(val).format('MMM DD, YYYY')
    },
    {
      headerName: 'Delivery',
      field: 'delivery_date',
      flex: 1,
      minWidth: 160,
      valueFormatter: val => moment(val).format('MMM DD, YYYY')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 1,
      headerAlign: 'center',
      minWidth: 80,
      disableColumnMenu: true,
      filterable: false,
      editable: false,
      renderCell: params => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Tooltip title='Actions'>
            <span>
              <IconButton
                onClick={(e) => handleClick(e, params.row)}
              // size="small"
              >
                <MoreHoriz />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )
    }
  ], [handleClick])

  return (
    <MainLayout
      title='Orders'
      activeDrawer={{ active: 'Orders' }}
      breadcrumbs={
        <Breadcrumbs
          items={[{ text: 'Order', url: '/orders' }, { text: 'List' }]}
        />
      }
      grid
      button
      btnProps={{ label: 'New Order', onClick: () => navigate('/orders/create') }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[50, 100, 150]}
            pageSize={50}
            height={50}
            rowCount={data?.meta?.total[0] || 0}
            paginationMode="server"
            loading={isLoading || isFetching}
            options={{
              filtering: true,
              search: true
            }}
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
            disableRowSelectionOnClick
            onRowClick={(rowData) => navigate(`/orders/edit/${rowData.row.id}`)}
            columns={columns}
            data={data?.data ?? []}
          />
          <Menu
            id="order-actions-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            slotProps={{
              list: {
                'aria-labelledby': 'order-actions-button',
              },
            }}
          >
            {selectedRowRef.current?.order_status === 'Canceled' ?
              <MenuItem onClick={(e) => setOpenModal(1)} disabled={actionLoading || downloading}>
                <ListItemIcon>
                  {actionLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <RotateLeftOutlined fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText primary="Restore" />
              </MenuItem>
              :
              <MenuItem onClick={(e) => setOpenModal(2)} disabled={actionLoading || downloading}>
                <ListItemIcon>
                  {actionLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Cancel fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText primary="Cancel" />
              </MenuItem>
            }
            <MenuItem onClick={handleDownloadInvoice} disabled={actionLoading || downloading}>
              <ListItemIcon>
                {downloading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Download fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText primary="Download BOL" />
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <Modal open={openModal === 2} handleClose={() => setOpenModal(false)}>
        <Confirmation
          noIcon
          title='Cancel Order Confirmation'
          subtitle='Please confirm if you want to cancel this order.'
          handleSubmit={() => handleCancel('Canceled')}
          handleClose={() => setOpenModal(false)}
        />
      </Modal>

      <Modal open={openModal === 1} handleClose={() => setOpenModal(false)}>
        <Confirmation
          noIcon
          title='Restore Order Confirmation'
          subtitle='Please confirm if you want to restore this order.'
          handleSubmit={() => handleCancel('Entered')}
          handleClose={() => setOpenModal(false)}
        />
      </Modal>
    </MainLayout>
  )
}