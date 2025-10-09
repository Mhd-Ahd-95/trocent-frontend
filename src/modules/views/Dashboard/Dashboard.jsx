import React from "react";
import { MainLayout } from "../../layouts";
import { Breadcrumbs, Table } from "../../components";
import { Grid, colors } from "@mui/material";
import CardDashoard from "./Card";
import {
  TrendingUp as TrendUp,
  TrendingDown as TrendDown,
} from "@mui/icons-material";
import moment from "moment";

export default function Dashboard() {
  return (
    <MainLayout title="Dashboard" activeDrawer={{ active: "Dashboard" }} grid>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <CardDashoard
                title="Total Customer"
                number={1}
                statistic="↑ 0 new (100.0% vs last week)"
                icon={<TrendUp sx={{mb: -0.8}}/>}
                color={colors.green[400]}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <CardDashoard
                title="Total Orders"
                number={200}
                statistic="↑ 5 new this week"
                icon={<TrendUp sx={{mb: -0.8}}/>}
                color={colors.green[400]}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <CardDashoard
                title="Revenue"
                number="21%"
                statistic="7% decrease"
                icon={<TrendDown sx={{mb: -0.8}}/>}
                color={colors.red[400]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Table 
            title='Latest Fuel Surcharge'
            checkBoxSelection={false}
            pageSizeOptions={[10, 20, 30]}
            pageSize={10}
            options={{
              search: false,
              filtering: false,
              columns: false,
              export: false
            }}
            data={
              [
                {id: 1, ltl: 20.9, ftl: 49.10, created_at: new Date()},
                {id: 2, ltl: 21.9, ftl: 50.10, created_at: new Date()},
                {id: 3, ltl: 22.9, ftl: 60.10, created_at: new Date()},
                {id: 4, ltl: 23.9, ftl: 30.10, created_at: new Date()},
                {id: 5, ltl: 23.9, ftl: 30.10, created_at: new Date()},
                {id: 6, ltl: 23.9, ftl: 30.10, created_at: new Date()},
                {id: 7, ltl: 23.9, ftl: 30.10, created_at: new Date()},
                {id: 8, ltl: 93.9, ftl: 30.10, created_at: new Date()},
                {id: 9, ltl: 93.9, ftl: 30.10, created_at: new Date()},
                {id: 10, ltl: 93.9, ftl: 30.10, created_at: new Date()},
              ]
            }
            columns={
              [
                {
                  field: 'ltl',
                  headerName: 'LTL Surcharge %',
                  flex: 1,
                  minWidth: 150
                },
                {
                  field: 'ftl',
                  flex: 1,
                  headerName: 'FTL Surcharge %',
                  minWidth: 150
                },
                {
                  field: 'created_at',
                  flex: 1,
                  headerName: 'Created At',
                  valueFormatter: (rowData) => moment(rowData).format('MMM DD, YYYY hh:mm:ss'),
                  minWidth: 200
                }
              ]
            }
          />
        </Grid>
      </Grid>
    </MainLayout>
  );
}
