import React from "react";
import { Grid } from "@mui/material";
import { SideMenu } from "../../../components";
import { MainLayout } from "../../../layouts";

export default function DriverCommissionRegister() {

    return (
        <MainLayout
            title='Driver Pay Commission Register'
            sideMenu={SideMenu}
            activeDrawer={{ active: 'Driver Commission Register' }}
        >
            <>Driver pay commission register</>
        </MainLayout>
    )

}