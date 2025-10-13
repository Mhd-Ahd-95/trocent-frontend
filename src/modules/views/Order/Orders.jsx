import React from 'react'
import { MainLayout } from '../../layouts'
import { Breadcrumbs, Table } from '../../components'
import { Grid } from '@mui/material'
import moment from 'moment/moment'
import { useNavigate } from 'react-router-dom'

export default function OrdersView () {
  const navigate = useNavigate()

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
            options={{
              filtering: true,
              search: true
            }}
            columns={[
              {
                headerName: 'Order #',
                field: 'order_code',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Customer',
                field: 'customerName',
                flex: 1,
                minWidth: 150
              },
              {
                headerName: 'Reference',
                field: 'reference',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Service',
                field: 'service_type',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Status',
                field: 'status',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Origin',
                field: 'shipper_city',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Destination',
                field: 'receiver_city',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'PickUp',
                field: 'pickup_date',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Delivery',
                field: 'delivery_date',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Pieces',
                field: 'total_pieces',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Grand',
                field: 'grand_total',
                flex: 1,
                minWidth: 120
              },
              {
                headerName: 'Created At',
                field: 'created_at',
                flex: 1,
                minWidth: 200,
                valueFormatter: val =>
                  moment(val).format('MMM DD, YYYY hh:mm:ss')
              }
            ]}
            data={[]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  )
}
