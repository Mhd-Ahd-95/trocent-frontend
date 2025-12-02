import React from 'react'
import { Grid, Typography, Box, Button, colors, useTheme } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { generateBillOfLadingPDF } from './generateBillOfLadingPDF'
import { Download, FileUpload } from '@mui/icons-material'

export default function Consignment(props) {

    const {
        getValues
    } = useFormContext()

    const downloadPDF = async () => {
        const currentData = getValues();
        try {
            const pdf = await generateBillOfLadingPDF(currentData);
            pdf.save(`connaissement-${currentData.order_number || 'bill'}.pdf`);
        } catch (error) {
            console.error("PDF generation error:", error);
        }
    };

    const theme = useTheme()

    return (
        <Grid container spacing={3}>
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
                            startIcon={<Download />}
                        >
                            Download
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={12}>
                <Box
                    component="button"
                    type="button"
                    sx={{
                        borderRadius: 1,
                        p: 0,
                        m: 0,
                        border: `1px solid ${theme.palette.primary.main}`,
                        width: "100%",
                        textAlign: "left",
                        background: theme.palette.background.paper,
                        fontSize: 15,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",

                        "&:hover": {
                            backgroundColor: 'rgba(221, 145, 0, 0.04)',
                        }
                    }}
                >
                    <Box
                        sx={{
                            py: 1.5,
                            px: 2,
                            color: theme.palette.primary.main,
                            borderRight: `1px solid ${theme.palette.primary.main}`,
                            fontWeight: 600,
                            letterSpacing: '0.2px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <FileUpload />
                        Browse
                    </Box>

                    <Box
                        sx={{
                            py: 1.5,
                            px: 2,
                            color: colors.grey[600],
                            fontWeight: 500
                        }}
                    >
                        Choose PDF Files
                    </Box>
                </Box>

            </Grid>
        </Grid>
    )

}