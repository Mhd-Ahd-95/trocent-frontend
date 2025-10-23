import React from "react";
import { MainLayout } from "../../layouts";
import { Breadcrumbs, Table, CustomCell, Modal, ConfirmModal, NoRows } from "../../components";
import { Autocomplete, Box, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useRateSheetMutations, useCustomersRateSheets } from "../../hooks/useRateSheets";
import { CheckCircleOutline, HighlightOffOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useCustomersNames } from "../../hooks/useCustomers";

export default function RateSheets() {

  const navigate = useNavigate()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const [selectedRateSheets, setSelectedRateSheets] = React.useState([])
  const { removeMany } = useRateSheetMutations()
  const [openModal, setOpenModal] = React.useState(false)
  const [customer, setCustomer] = React.useState(location.state?.customer_id || '')
  // const [paginationModel, setPaginationModel] = React.useState({
  //   page: 0,
  //   pageSize: 10,
  // });

  const { data, isLoading, isFetching, isError, error } = useCustomersNames()
  const { data: rateSheetsData, isLoading: isLoadingSheet, isFetching: isFetchingSheet, isError: isErrorSheet, error: errorSheet } = useCustomersRateSheets(customer)

  React.useEffect(() => {
    if ((isError && error) || (isErrorSheet || errorSheet)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      const errorMessage = message ? `${message} - ${status}` : error.message;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [isError, error])

  const [rowSelectionModel, setRowSelectionModel] = React.useState({
    type: 'include',
    ids: new Set()
  })

  const handleSelectionChange = newModel => {
    setRowSelectionModel(newModel)
    let selectedIds = Array.from(newModel.ids)
    if (newModel.type === 'exclude' && selectedIds.length === 0) {
      selectedIds = rateSheetsData?.map(row => row.id)
    }
    setSelectedRateSheets(selectedIds)
  }

  const handleDeleteSheets = (sids) => {
    removeMany.mutate({ cid: customer, iids: sids })
    setSelectedRateSheets([])
    setOpenModal(false)
    setRowSelectionModel({
      type: 'include',
      ids: new Set()
    })
  }

  // const calculateBracketColumnWidth = (rateSheets) => {
  //   if (!rateSheets || rateSheets.length === 0) return 150;

  //   const maxBrackets = Math.max(
  //     ...rateSheets.map(row => row.brackets?.length || 0)
  //   );

  //   const calculatedWidth = maxBrackets * 80;

  //   return Math.max(150, calculatedWidth);
  // };

  return (
    <MainLayout
      title="Rate Sheets"
      activeDrawer={{ active: "Rate Sheets" }}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: "Rate Sheets", url: "/rate-sheets" },
            { text: "List" },
          ]}
        />
      }
      grid
    >
      <Grid container spacing={3}>
        <Grid size={12}>
          <Autocomplete
            // open={openAutoComplete}
            // onOpen={handleAutoCompleteOepn}
            // onClose={() => setOpenAutoComplete(false)}
            options={data || []}
            loading={isLoading || isFetching}
            getOptionLabel={(option) => option.name || ""}
            isOptionEqualToValue={(option, value) => option.id === value}
            value={data?.find((item) => item.id === Number(customer)) || null}
            onChange={(e, newValue) => {
              const value = newValue?.id ?? ''
              setCustomer(value)
              if (!value) {
                navigate(location.pathname, { replace: true, state: {} });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={'Customers*'}
                fullWidth
                variant="outlined"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
        </Grid>
        {customer ?
          <Grid size={12}>
            <Table
              pageSizeOptions={[10, 25, 50]}
              pageSize={10}
              checkboxSelection
              // paginationMode={'server'}
              // rowCount={data?.meta?.total[0] || 0}
              // paginationModel={paginationModel}
              // onPaginationModelChange={(model) => setPaginationModel({ ...model })}
              deleteSelected={selectedRateSheets.length > 0}
              handleDeleteSelected={() => setOpenModal(true)}
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={rowSelectionModel}
              loading={isLoadingSheet || isFetchingSheet}
              height={60}
              onRowClick={(rowData) => navigate(`/rate-sheet/edit/${rowData.id}/${customer}`)}
              data={rateSheetsData || []}
              options={{
                filtering: true,
                search: true,
              }}
              columns={[
                {
                  headerName: "Rate Code",
                  field: "rate_code",
                  flex: 1,
                  minWidth: 120
                },
                {
                  headerName: "Customer",
                  field: "customer_name",
                  flex: 1,
                  minWidth: 120
                },
                {
                  headerName: "Type",
                  field: "type",
                  flex: 1,
                  lookup: { 'skid': 'skid', 'weight': 'weight' },
                  minWidth: 80,
                  renderCell: params => params.value ? <CustomCell>{params.value}</CustomCell> : ''
                },
                {
                  headerName: "Skid By Weight",
                  field: "skid_by_weight",
                  flex: 1,
                  minWidth: 120,
                  renderCell: rowData => rowData.value ? <CheckCircleOutline sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='success' /> : <HighlightOffOutlined sx={{ mt: 1.5, ml: 1 }} fontSize='small' color='error' />
                },
                {
                  headerName: "Destination",
                  field: "destination",
                  flex: 1,
                  minWidth: 120
                },
                {
                  headerName: "Province",
                  field: "province",
                  flex: 1,
                  minWidth: 120
                },
                {
                  headerName: "Min Rate",
                  field: "min_rate",
                  flex: 1,
                  minWidth: 120
                },
                {
                  headerName: "LTL",
                  field: "ltl_rate",
                  flex: 1,
                  minWidth: 120
                },
                // {
                //   headerName: "Rate Brackets",
                //   field: "brackets",
                //   flex: 1,
                //   minWidth: isLoading || isFetching ? 120 : calculateBracketColumnWidth(data),
                //   renderCell: params => {
                //     return (
                //       <Box
                //         sx={{
                //           display: 'flex',
                //           gap: 1.5,
                //           height: '100%',
                //           alignItems: 'center',
                //         }}
                //       >
                //         {params.value?.map((val, i) => (
                //           <Box
                //             key={i}
                //             sx={{
                //               display: 'flex',
                //               flexDirection: 'column',
                //               p: 0.5,
                //               gap: 0.5,
                //               boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
                //             }}
                //           >
                //             <Typography variant="caption" fontWeight={600}>{val.rate_bracket}</Typography>
                //             <Typography variant="caption" noWrap maxWidth={80}>{val.rate}</Typography>
                //           </Box>
                //         ))}
                //       </Box>
                //     )
                //   }
                // }
              ]}
            />
          </Grid>
          :
          <Grid size={12}>
            <Grid container component={Box} justifyContent={'center'} alignItems={'center'} py={15} direction={'column'} spacing={2}>
              <NoRows noRows={'true'} />
              <Typography variant="body1" fontWeight='light' fontSize={14}>Choose a customer to display the associated rate sheets.</Typography>
            </Grid>
          </Grid>
        }
      </Grid>
      <Modal open={openModal} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>Rate Sheets</strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteSheets([...selectedRateSheets])}
        />
      </Modal>
    </MainLayout>
  );
}
