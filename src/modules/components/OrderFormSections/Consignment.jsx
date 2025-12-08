import React from 'react'
import { Grid, Typography, Box, Button, colors, useTheme, IconButton, Tooltip, CircularProgress } from '@mui/material'
import { useFormContext, useWatch } from 'react-hook-form'
import { generateBillOfLadingPDF } from './generateBillOfLadingPDF'
import { Delete, Download, FileUpload, InsertDriveFileOutlined } from '@mui/icons-material'
import { Modal } from '..'
import UploadPDFFile from './UploadPDFFile'
import OrderApi from '../../apis/Order.api'
import { saveAs } from 'file-saver'
import { useOrderMutations } from '../../hooks/useOrders'
import { useSnackbar } from 'notistack'

function CardFile(props) {

    const { file, index, order_id } = props
    const { deleteFile } = useOrderMutations()
    const [downloading, setDownloading] = React.useState(false)
    const [deleting, setDeleting] = React.useState(false)
    const { enqueueSnackbar } = useSnackbar()

    function formatFileSize(sizeInBytes) {
        const KB = 1024
        const MB = KB * 1024

        if (sizeInBytes >= MB) {
            return (sizeInBytes / MB).toFixed(2) + " MB"
        }
        return (sizeInBytes / KB).toFixed(2) + " KB"
    }

    const downloadPDFFILE = (e, file) => {
        e.preventDefault()
        setDownloading(true)
        OrderApi.downloadFile(file.file_id)
            .then(res => {
                saveAs(res.data, file?.fname || 'THD')
            })
            .catch(error => {
                const message = error.response?.data?.message;
                const status = error.response?.status;
                const errorMessage = message ? `${message} - ${status}` : error.message;
                enqueueSnackbar(errorMessage, { variant: 'error' });
            })
            .finally(() => setDownloading(false))
    }

    const deletePDFFILE = async (e, fid) => {
        e.preventDefault()
        setDeleting(true)
        try {
            const res = await deleteFile.mutateAsync({ fid: Number(fid), oid: order_id })
            if (res) props.handleFileUploadSuccess(res)
        }
        catch (e) {
            //
        }
        finally {
            setDeleting(false)
        }
    }

    return (
        <Grid container>
            <Grid size={12}>
                <Tooltip title='Delete File'>
                    <IconButton
                        sx={{ position: 'absolute', top: 1, right: 1 }}
                        disabled={deleting || downloading}
                        onClick={(e) => deletePDFFILE(e, file.file_id)}
                    >
                        {deleting ?
                            <CircularProgress size={'15px'} />
                            :
                            <Delete color='error' />
                        }
                    </IconButton>
                </Tooltip>
                <Grid container spacing={0} direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Grid size={'auto'} >
                        <InsertDriveFileOutlined color='primary' sx={{ backgroundColor: 'rgba(221, 145, 0, 0.1)', padding: 1, borderRadius: 5 }} />
                    </Grid>
                    <Grid size={'auto'}>
                        <Typography variant='subtitle1' fontWeight={600}>{file.fname}</Typography>
                    </Grid>
                    <Grid size={'auto'}>
                        <Typography variant='caption' >{formatFileSize(file.fsize)}</Typography>
                    </Grid>
                    <Grid size={'auto'}>
                        <Tooltip title='Download File'>
                            <IconButton
                                disabled={downloading}
                            >
                                {downloading ?
                                    <CircularProgress size={'15px'} />
                                    :

                                    <Download color='primary'
                                        onClick={(e) => downloadPDFFILE(e, file)}
                                    />
                                }
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

}

function Consignment(props) {

    const {
        getValues,
        control,
        setValue
    } = useFormContext()

    const [openModal, setOpenModal] = React.useState(false)
    const { enqueueSnackbar } = useSnackbar()

    const downloadBillAsPDF = async () => {
        const currentData = getValues();
        const language = getValues('customer_language') ?? 'en'
        try {
            const pdf = await generateBillOfLadingPDF(currentData, language);
            pdf.save(`connaissement-${currentData.order_number || 'bill'}.pdf`);
        } catch (error) {
            console.error("PDF generation error:", error);
            enqueueSnackbar('PDF generation error', { variant: 'error' })
        }
    };

    const handleFileUploadSuccess = (res) => {
        setValue('files', res, { shouldValidate: true })
    }

    const theme = useTheme()

    const files = useWatch({ name: 'files', control: control })

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
                            onClick={downloadBillAsPDF}
                            sx={{ textTransform: 'capitalize' }}
                            startIcon={<Download />}
                        >
                            Download
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={12}>
                <Grid container spacing={2}>
                    {files && files.length > 0 ? files.map((file, index) => (
                        <Grid size={{ xs: 12, sm: 12, md: 6 }} key={index} sx={{
                            padding: 2,
                            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                            position: 'relative',
                            '&:hover': {
                                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
                            }
                        }}>
                            <CardFile
                                file={file}
                                index={index}
                                key={file.file_id}
                                order_id={props.order_id}
                                handleFileUploadSuccess={handleFileUploadSuccess}
                            />
                        </Grid>
                    )) :
                        <Grid size={12}>
                            <Grid container spacing={1} justifyContent={'center'} alignItems={'center'}>
                                <Grid size={'auto'}><InsertDriveFileOutlined color='disabled' sx={{ backgroundColor: 'rgba(160, 159, 158, 0.1)', padding: 1, borderRadius: 5 }} /></Grid>
                                <Grid size={'auto'}><Typography variant='caption' color='textDisabled'>No File Uploaded</Typography></Grid>
                            </Grid>
                        </Grid>
                    }
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
                    onClick={() => setOpenModal(true)}
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
            <Modal open={openModal} handleClose={() => setOpenModal(false)}>
                <UploadPDFFile
                    handleClose={() => setOpenModal(false)}
                    order_id={props.order_id}
                    onUploadSuccess={handleFileUploadSuccess}
                />
            </Modal>
        </Grid>
    )

}

export default React.memo(Consignment)