import React from "react";
import { MainLayout } from '../../layouts'
import { SideMenu, Tabs } from "../../components";
import { Grid } from "@mui/material";
import TerminalTab from "./TerminalTab";
import QuestionTab from './QuestionTab'
import LogoTab from "./LogoTab";

export default function SetUp() {

    const [tab, setTab] = React.useState(0)
    
    return (
        <MainLayout
            title='Set Up'
            activeDrawer={{ active: 'Set Up' }}
            sideMenu={SideMenu}
        >
            <Grid container justifyContent={'center'}>
                <Grid size={12}>
                    <Tabs
                        onTabChange={setTab}
                        size={'large'}
                        labels={['Terminal', 'Address', 'Questions', 'Emails', 'Logo']}
                        contents={[
                            <TerminalTab
                                enabled={tab === 0}
                            />,
                            <>Address</>,
                            <QuestionTab enabled={tab === 2} />,
                            <>Emails</>,
                            <LogoTab />,
                        ]}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )
}