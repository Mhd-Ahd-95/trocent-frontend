import React from "react";
import { MainLayout } from "../../layouts";
import { Breadcrumbs, Table, } from "../../components";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RateSheets() {

  const navigate = useNavigate()

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
      button
      btnProps={{label: 'New Rate Sheet', onClick: () => navigate('/new-rate-sheet')}}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table
            pageSizeOptions={[10, 25, 50]}
            pageSize={10}
            checkboxSelection
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
                field: "customer",
                flex: 1,
                minWidth: 120
              },
              {
                headerName: "Type",
                field: "type",
                flex: 1,
                minWidth: 120
              },
              {
                headerName: "Skip By Weight",
                field: "skip",
                flex: 1,
                minWidth: 120
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
                field: "ltl",
                flex: 1,
                minWidth: 120
              },
              {
                headerName: "Rate Brackets",
                field: "rate",
                flex: 1,
                minWidth: 120
              },
            ]}
            data={[
            ]}
          />
        </Grid>
      </Grid>
    </MainLayout>
  );
}
