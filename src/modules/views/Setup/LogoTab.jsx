import { Grid, Typography } from "@mui/material";
import React from "react";
import { UploadDefaultLogo } from "../../components";

function LogoTab({ enabled }) {

    return <Grid container justifyContent={'center'} spacing={3}>
        <Grid size={7}>
            <Typography variant="h6" fontWeight={700}>Upload Default Logo</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 9, md: 6 }}>
            <UploadDefaultLogo
                
            />
        </Grid>
    </Grid>
}

export default React.memo(LogoTab)