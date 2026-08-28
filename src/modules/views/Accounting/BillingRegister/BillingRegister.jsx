import React from "react";
import { Grid } from "@mui/material";
import { SideMenu } from "../../../components";
import { MainLayout } from "../../../layouts";

export default function BillingRegister() {

    return (
        <MainLayout
            title='Billing Register'
            sideMenu={SideMenu}
            activeDrawer={{ active: 'Billing Register' }}
        >
            <>billing register</>
        </MainLayout>
    )

}