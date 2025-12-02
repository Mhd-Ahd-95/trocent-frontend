import React from 'react'
import { Grid, Typography, Box, Button } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { generateBillOfLadingPDF } from './generateBillOfLadingPDF'

export default function Consignment(props) {

    const {
        getValues
    } = useFormContext()

    const downloadPDF = async () => {
        const currentData = getValues();
        try {
            const pdf = await generateBillOfLadingPDF(currentData);
            pdf.save(`connaissement-${currentData.order_number || 'bill'}.pdf`);
            console.log("PDF generated successfully");
        } catch (error) {
            console.error("PDF generation error:", error);
        }
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
            </Grid>
        </Grid>
    )

}