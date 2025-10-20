import React from "react";
import { MainLayout } from "../../layouts";
import { Breadcrumbs, Table, Modal, ConfirmModal, DrawerForm } from "../../components";
import { Grid, Button, Box } from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { DeleteForever } from "@mui/icons-material";
import moment from "moment";
import { useFuelSurchargeMutations, useFuelSurcharges } from "../../hooks/useFuelSurcharges";
import FuelSurchargeForm from "./FuelSurchargeForm";
import { useSnackbar } from "notistack";

export default function FuelSurcharges() {

  const [selectedFuelSurcharges, setSelectedFuelSurcharges] = React.useState([])
  const [fuelSurcharge, setFuelSurcharge] = React.useState({})
  const [openModal, setOpenModal] = React.useState(false)
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const selectedRef = React.useRef()
  const { enqueueSnackbar } = useSnackbar()

  const { data, isLoading, isError, error, isFetching } = useFuelSurcharges()

  const { removeMany, refetch, create, update } = useFuelSurchargeMutations()

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
    setSelectedFuelSurcharges(selectedIds)
  }

  const handleDeleteFuelSurcharges = (iids) => {
    removeMany.mutate(iids)
    setSelectedFuelSurcharges([])
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
      title="Fuel Surcharges"
      activeDrawer={{ active: "Fuel Surcharges" }}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: "Fuel Surcharges", url: "/fuel-surcharges" },
            { text: "List" },
          ]}
        />
      }
      grid
      button
      btnProps={{ label: 'New Fuel Surcharge', onClick: () => setOpenDrawer(1) }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            checkboxSelection
            loading={isLoading || isFetching}
            deleteSelected={selectedFuelSurcharges.length > 0}
            handleDeleteSelected={() => setOpenModal(2)}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            options={{
              filtering: false,
              search: true,
            }}
            columns={[
              {
                headerName: "LTL %",
                field: "ltl_surcharge",
                flex: 1,
                minWidth: 100,
              },
              {
                headerName: "FTL %#",
                field: "ftl_surcharge",
                flex: 1,
                minWidth: 100,
              },
              {
                headerName: "From Date",
                field: "from_date",
                flex: 1,
                minWidth: 200,
                valueFormatter: (rowData) =>
                  moment(rowData).format("MMM DD, YYYY hh:mm:ss"),
              },
              {
                headerName: "To Date",
                field: "to_date",
                flex: 1,
                minWidth: 200,
                // renderCell: (params) => <CustomCell>{params.value}</CustomCell>,
                valueFormatter: (rowData) =>
                  moment(rowData).format("MMM DD, YYYY hh:mm:ss"),
              },
              {
                field: "actions",
                headerName: "Actions",
                sortable: false,
                flex: 1,
                minWidth: 150,
                renderCell: (params) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      marginTop: 1,
                    }}
                  >
                    <Button
                      startIcon={<EditSquareIcon />}
                      onClick={(e) => {
                        e.stopPropagation()
                        setFuelSurcharge(params.row)
                        setOpenDrawer(2)
                      }}
                      variant="text"
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        "& .MuiButton-startIcon": { marginRight: 0.5 },
                        fontSize: "0.8rem",
                        minWidth: "unset",
                        p: 0.5,
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteForever />}
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenModal(1)
                        selectedRef.current = params.row?.id
                      }}
                      variant="text"
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        "& .MuiButton-startIcon": { marginRight: 0.5 },
                        fontSize: "0.8rem",
                        minWidth: "unset",
                        p: 0.5,
                      }}
                      color="error"
                    >
                      Delete
                    </Button>
                  </Box>
                ),
              },
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
                {'Fuel Surcharge'}
              </strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteFuelSurcharges([selectedRef.current])}
        />
      </Modal>
      <Modal open={openModal === 2} handleClose={() => setOpenModal(false)}>
        <ConfirmModal
          title={
            <>
              Delete{' '}
              <strong style={{ fontSize: 15, paddingInline: 5 }}>Fuel Surcharges</strong>
            </>
          }
          subtitle='Are you sure you want to continue?'
          handleClose={() => setOpenModal(false)}
          handleSubmit={() => handleDeleteFuelSurcharges([...selectedFuelSurcharges])}
        />
      </Modal>
      {openDrawer === 1 &&
        <DrawerForm title='Create Fuel Surcharge' setOpen={setOpenDrawer} open={openDrawer === 1}>
          <FuelSurchargeForm
            initialValues={{}}
            submit={async (payload) => await create.mutateAsync(payload)}
            setOpen={setOpenDrawer}
          />
        </DrawerForm>
      }
      {openDrawer === 2 &&
        <DrawerForm title='Edit Fuel Surcharge' setOpen={setOpenDrawer} open={openDrawer === 2}>
          <FuelSurchargeForm
            initialValues={{ ...fuelSurcharge }}
            submit={async (payload) => await update.mutateAsync({ id: fuelSurcharge.id, payload })}
            setOpen={setOpenDrawer}
            editMode
          />
        </DrawerForm>
      }
    </MainLayout>
  );
}
