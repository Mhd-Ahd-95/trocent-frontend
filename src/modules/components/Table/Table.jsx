import * as React from 'react'
import { DataGrid, gridClasses, useGridApiContext, useGridSelector, gridPageCountSelector } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import CustomToolbar from './Toolbar'
import CustomNoRows from './NoRows'
import CustomNoResultsOverlay from './NoResultFound'
import MuiPagination from '@mui/material/Pagination';

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

const TableLayout = styled('div')(({ theme, data, tableType }) => ({
  // overflow: "hidden",
  borderRadius: 25,
  // height: 768,
  // width: '100%',
  // overflowX: 'auto',
  // overflowY: 'auto',
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
        rowHeight={props.height || 45}
        loading={props.loading}
        paginationMode={props.paginationMode || 'client'}
        rowCount={props.rowCount}
        paginationModel={props.paginationModel}
        onPaginationModelChange={props.onPaginationModelChange}
        sx={{
          width: '100%',
          overflowX: 'auto',
          borderRadius: 3,
        }}
        pageSizeOptions={props.pageSizeOptions || []}
        columnHeaderHeight={45}
        slotProps={{
          basePagination: {
            material: {
              ActionsComponent: Pagination,
            },
          },
        }}
        slots={{
          toolbar: () => (
            <CustomToolbar
              title={title}
              importedButton={props.importedButton}
              options={options}
              deleteSelected={props.deleteSelected}
              handleDeleteSelected={props.handleDeleteSelected}
              handleImportedButton={props.handleImportedButton}
            />
          ), // pass the component, NOT a function
          noRowsOverlay: () => <CustomNoRows row={props.row} />,
          noResultsOverlay: CustomNoResultsOverlay
        }}
        showToolbar={!props.noToolbar}
        onRowSelectionModelChange={props.onRowSelectionModelChange}
        rowSelectionModel={props.rowSelectionModel}
        checkboxSelection={props.checkboxSelection}
        onRowClick={props.onRowClick}
        // isRowSelectable={(params) => params.row.quantity > 50000}
        disableRowSelectionOnClick={props.disableRowSelectionOnClick || true}
        // disableMultipleRowSelection
        getRowClassName={params =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          ...data.initialState,
          sorting: {
            sortModel: [{ field: props.field || 'name', sort: 'asc' }],
          },
          pagination: { paginationModel: { pageSize: props.pageSize } }
        }}
      />
    </TableLayout>
  )
}
