import * as React from 'react'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import CustomToolbar from './Toolbar'
import CustomNoRows from './NoRows'
import CustomNoResultsOverlay from './NoResultFound'

const TableLayout = styled('div')(({ theme }) => ({
  // overflow: "hidden",
  borderRadius: 25,
  height: 603,
  width: '100%'
  // boxShadow:
  //   "0px 2px 2px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
}))

function customCheckbox(theme) {
  return {
    '& .MuiCheckbox-root svg': {
      width: 18,
      height: 18,
      backgroundColor: 'transparent',
      //   border: "1px solid #d9d9d9",
      borderRadius: 2,
      ...theme.applyStyles('dark', {
        borderColor: 'rgb(67, 67, 67)'
      })
    },
    '& .MuiCheckbox-root svg path': {
      //   display: "none",
    }
  }
}

const DataGridTable = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.grey[100]
    }
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: theme.palette.grey[100]
  },
  ...customCheckbox(theme)
}))

export default function Table(props) {
  let { columns, data, options, tableType, title, actions } = props

  return (
    <TableLayout>
      <DataGridTable
        columns={columns}
        rows={data || []}
        rowHeight={45}
        loading={props.loading}
        sx={{
          width: '100%',
          borderRadius: 3
        }}
        pageSizeOptions={props.pageSizeOptions}
        columnHeaderHeight={45}
        slots={{
          toolbar: () => (
            <CustomToolbar
              title={title}
              options={options}
              deleteSelected={props.deleteSelected}
              handleDeleteSelected={props.handleDeleteSelected}
            />
          ), // pass the component, NOT a function
          noRowsOverlay: () => <CustomNoRows row={props.row} />,
          noResultsOverlay: CustomNoResultsOverlay
        }}
        showToolbar={!props.noToolbar}
        onRowSelectionModelChange={props.onRowSelectionModelChange}
        rowSelectionModel={props.rowSelectionModel}
        checkboxSelection={props.checkboxSelection}
        // isRowSelectable={(params) => params.row.quantity > 50000}
        disableRowSelectionOnClick={props.disableRowSelectionOnClick}
        // disableMultipleRowSelection
        getRowClassName={params =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          ...data.initialState,
          pagination: { paginationModel: { pageSize: props.pageSize } }
        }}
      />
    </TableLayout>
  )
}
