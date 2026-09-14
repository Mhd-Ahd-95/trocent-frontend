import React, { useTransition, useState } from "react";
import { Grid } from "@mui/material";
import { Breadcrumbs, SideMenu } from "../../../components";
import { MainLayout } from "../../../layouts";
import FilterBarRegisterBatch from "../Filterbar/FilterbarBatchStatus";
import useStyles from './Driver.styles'
import { useSnackbar } from "notistack";
import { useDriverPayHourlyRegistered } from "../../../hooks/useBillings";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function RegisteredPayments() {

    const { classes } = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const companyRef = React.useRef()

    const { data, isLoading } = useDriverPayHourlyRegistered(appliedFilters, page, rowsPerPage)
    console.log(data)

    const handleSearch = (filters) => {
        setAppliedFilters(filters)
    }

    console.log(appliedFilters)


    return (
        <MainLayout
            title='Registered Payments'
            sideMenu={SideMenu}
            activeDrawer={{ active: 'Driver Hourly Register' }}
            breadcrumbs={
                <Breadcrumbs
                    items={[
                        { text: 'Driver Pay Hourly Register', url: '/accounting/driver-hourly-register' },
                        { text: 'Batch Status' }
                    ]}
                />
            }
        >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <FilterBarRegisterBatch
                        EMPTY_FILTERS={{ payDateFrom: '', payDateTo: '', batch_number: '', keyword: '', quickFilter: 'today' }}
                        onSearch={handleSearch}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )

}