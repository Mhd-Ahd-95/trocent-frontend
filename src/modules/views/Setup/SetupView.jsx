import React from "react";
import { MainLayout } from '../../layouts'
import { SideMenu, Tabs } from "../../components";
import { Box, Grid } from "@mui/material";
import TerminalTab from "./TerminalTab";
import QuestionTab from './QuestionTab'
import LogoTab from "./LogoTab";
import AddressTab from "./AddressTab";
import EmailTab from "./EmailTab";
import SmtpConfiguration from "./SmtpConfiguration";

export default function SetUp() {

    const [tab, setTab] = React.useState(0)

    return (
        <MainLayout
            title='Set Up'
            activeDrawer={{ active: 'Set Up' }}
            sideMenu={SideMenu}
            grid
        >
            <Grid container justifyContent={'center'} component={Box}>
                <Grid size={12}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                        <Tabs
                            onTabChange={setTab}
                            size={'large'}
                            labels={['Terminal', 'Address', 'Questions', 'Emails', 'Logo', 'SMTP Configuration']}
                            contents={[
                                <TerminalTab
                                    enabled={tab === 0}
                                />,
                                <AddressTab enabled={tab === 1} />,
                                <QuestionTab enabled={tab === 2} />,
                                <EmailTab enabled={tab === 3} />,
                                <LogoTab enabled={tab === 4} />,
                                <SmtpConfiguration enabled={tab === 5} />,
                            ]}
                        />
                    </Box>
                </Grid>
            </Grid>
        </MainLayout >
    )
}