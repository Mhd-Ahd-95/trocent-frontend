import React from 'react'
import { Grid, Typography, Box, Button } from '@mui/material'
import StyledButton from '../StyledButton/StyledButton'
import { useFormContext } from 'react-hook-form'
import BillOfLading from './BillOfLading'

export default function Consignment(props) {

    const {
        getValues
    } = useFormContext()

    const [data, setData] = React.useState(getValues())

    const downloadPDF = () => {
        const wrapper = document.getElementById("bill-of-lading-wrapper");
        const element = document.getElementById("bill-of-lading-document");

        // wrapper.style.display = "block";

        const opt = {
            margin: 0.5,
            filename: `connaissement-${data.order_number}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        setTimeout(() => {
            window.html2pdf()
                .set(opt)
                .from(element)
                .save()
                .then(() => {
                    wrapper.style.display = "none";
                });
        }, 300);
    };


    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Grid container justifyContent={'space-between'} alignItems={'center'}>
                    <Grid size='auto'>
                        <Typography variant='subtitle1'>System Generated BOL</Typography>
                    </Grid>
                    <Grid size='auto'>
                        <Button
                            variant='outlined'
                            color='primary'
                            onClick={downloadPDF}
                            sx={{ textTransform: 'capitalize' }}
                        >
                            Download
                        </Button>
                    </Grid>
                </Grid>
                {/* <Box
                    id="bill-of-lading-wrapper"
                    // sx={{
                    //     position: "absolute",
                    //     top: 0,
                    //     left: 0,
                    //     opacity: 0,
                    //     pointerEvents: "none"
                    // }}
                >
                    <BillOfLading data={data} />
                </Box> */}
            </Grid>
        </Grid>
    )

}