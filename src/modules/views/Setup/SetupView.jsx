import React from "react";
import { MainLayout } from '../../layouts'
import { SideMenu, Tabs } from "../../components";
import { Grid } from "@mui/material";
import TerminalTab from "./TerminalTab";
import QuestionTab from './QuestionTab'
import LogoTab from "./LogoTab";
import AddressTab from "./AddressTab";
import EmailTab from "./EmailTab";

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
                            <AddressTab enabled={tab === 1} />,
                            <QuestionTab enabled={tab === 2} />,
                            <EmailTab enabled={tab === 3} />,
                            <LogoTab />,
                        ]}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    )
}