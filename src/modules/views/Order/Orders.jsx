import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, CustomCell, Table } from '../../components'
import { Grid } from '@mui/material'
import moment from 'moment/moment'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../../hooks/useOrders'

export default function OrdersView() {
  const navigate = useNavigate()

  const { data, isLoading, isFetching } = useOrders()

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
      btnProps={{ label: 'New Order', onClick: () => navigate('/new-order') }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            loading={isLoading || isFetching}
            options={{
              filtering: true,
              search: true
            }}
            columns={[
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
                headerName: 'Service',
                field: 'service_type',
                flex: 1,
                minWidth: 90,
                renderCell: params => params.value ? <CustomCell>{params.value}</CustomCell> : ''
              },
              {
                headerName: 'Status',
                field: 'order_status',
                flex: 1,
                minWidth: 90,
                renderCell: params => params.value ? <CustomCell>{params.value}</CustomCell> : ''
              },
              {
                headerName: 'Shipper Name',
                field: 'shipper_contact_name',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Origin City',
                field: 'shipper_city',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Receiver Name',
                field: 'receiver_contact_name',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Destination City',
                field: 'receiver_city',
                flex: 1,
                minWidth: 120
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
                headerName: 'Created At',
                field: 'created_at',
                flex: 1,
                minWidth: 160,
                valueFormatter: val => moment(val).format('MMM DD, YYYY')
              }
            ]}
            data={data || []}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
