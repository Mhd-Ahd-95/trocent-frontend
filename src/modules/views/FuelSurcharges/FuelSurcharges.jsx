import React from "react";
import { MainLayout } from "../../layouts";
import { Breadcrumbs, Table } from "../../components";
import { Grid, Button, Box } from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { DeleteForever } from "@mui/icons-material";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function FuelSurcharges() {

  const navigate = useNavigate()

  return (
    <MainLayout
      title="Fuel Surcharges"
      activeDrawer={{ active: "Fuel Surcharges" }}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: "Fuel Surcharges", url: "/fuel-surcharge" },
            { text: "List" },
          ]}
        />
      }
      grid
      button
      btnProps={{label: 'New Fuel Surcharge', onClick: () => navigate('/new-fuel-surcharge')}}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            noToolbar
            pageSizeOptions={[10, 20, 30]}
            pageSize={10}
            checkboxSelection
            options={{
              filtering: true,
              search: true,
            }}
            columns={[
              {
                headerName: "LTL %",
                field: "ltl",
                flex: 1,
                minWidth: 100,
              },
              {
                headerName: "FTL %#",
                field: "ftl",
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
                      onClick={() => console.log(params)}
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
                      onClick={() => console.log(params)}
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
            data={[
              {
                id: 1,
                ltl: 20,
                ftl: 30,
                from_date: new Date(),
                to_date: new Date(),
              },
            ]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  );
}
