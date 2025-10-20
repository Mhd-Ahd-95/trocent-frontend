import React from "react";
import { MainLayout } from "../../layouts";
import { Breadcrumbs, Table, CustomCell, Modal, ConfirmModal } from "../../components";
import { Box, Grid, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useRateSheetMutations, useRateSheets } from "../../hooks/useRateSheets";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircleOutline, HighlightOffOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";

export default function RateSheets() {

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const queryClient = useQueryClient()
  const state = queryClient.getQueryState(['rateSheets'])
  const fromEditOrCreate = location.state?.fromEditOrCreate || false;
  const { data, isLoading, isFetching, isError, error } = useRateSheets()
  const [selectedRateSheets, setSelectedRateSheets] = React.useState([])
  const { removeMany } = useRateSheetMutations()
  const [openModal, setOpenModal] = React.useState(false)

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      const errorMessage = message ? `${message} - ${status}` : error.message;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
    if (state?.dataUpdateCount === 1 && fromEditOrCreate) {
      refetchInterliners()
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
      selectedIds = data.map(row => row.id)
    }
    setSelectedRateSheets(selectedIds)
  }

  const handleDeleteSheets = (sids) => {
    removeMany.mutate(sids)
    setSelectedRateSheets([])
    setOpenModal(false)
  }

  const calculateBracketColumnWidth = (rateSheets) => {
    if (!rateSheets || rateSheets.length === 0) return 150;

    const maxBrackets = Math.max(
      ...rateSheets.map(row => row.brackets?.length || 0)
    );

    const rateBrackets = []
    rateSheets.forEach(dt => {
      dt?.brackets.forEach((br) => {
        rateBrackets.push(String(br.rate_bracket)?.length || 0)
        rateBrackets.push(String(br.rate)?.length || 0)
      })
    })
    const maxRateBraketorrate = Math.max(...rateBrackets || 1)

    const calculatedWidth = maxBrackets * (maxRateBraketorrate * 5) + 20;

    return Math.max(150, calculatedWidth);
  };


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
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            checkboxSelection
            deleteSelected={selectedRateSheets.length > 0}
            handleDeleteSelected={() => setOpenModal(true)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            loading={isLoading || isFetching}
            height={60}
            data={data || []}
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
                minWidth: 80,
                renderCell: params => params.value ? <CustomCell>{params.value}</CustomCell> : ''
              },
              {
                headerName: "Skip By Weight",
                field: "skip_by_weight",
                flex: 1,
                minWidth: 70,
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
              {
                headerName: "Rate Brackets",
                field: "brackets",
                flex: 1,
                minWidth: isLoading || isFetching ? 120 : calculateBracketColumnWidth(data),
                renderCell: params => {
                  return (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1.5,
                        height: '100%',
                        alignItems: 'center',
                      }}
                    >
                      {params.value?.map((val, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            p: 0.5,
                            gap: 0.5,
                            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
                          }}
                        >
                          <Typography variant="caption" fontWeight={600}>{val.rate_bracket}</Typography>
                          <Typography variant="caption">{val.rate}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )
                }
              }
            ]}
          />
        </Grid>
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
