import React from 'react'
import { Box, Button, CircularProgress, colors, FormHelperText, IconButton, Typography, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Close, Download } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import DriversApi from '../../apis/Drivers.api'
import { saveAs } from 'file-saver'

const UploadButton = styled(Button)(({ theme, iserror }) => ({
    width: '100%',
    height: '80px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    border: iserror === 'true' ? '1px solid ' + theme.palette.error.main : '1px solid ' + colors.grey[400],
    fontSize: 14,
    color: colors.grey[500],
    borderRadius: 5,
    textTransform: 'capitalize',
    position: 'relative',
    '& span': {
        color: theme.palette.primary.main,
        paddingLeft: 4
    },
    '&:hover': {
        backgroundColor: 'transparent'
    }
}))

const CustomFileDetails = styled('div')(({ theme, loading, fsize }) => ({
    position: 'absolute',
    height: '40px',
    width: '100%',
    top: 0,
    left: 0,
    borderRadius: 3,
    backgroundColor: loading === 'true' ? colors.grey[800] : !fsize ? theme.palette.error.main : colors.green['700'],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(0.5),
    '& .fname': {
        fontWeight: 600,
        fontSize: 11,
        color: theme.palette.background.paper,
    },
    '& .fsize': {
        color: theme.palette.grey[400],
        fontSize: 10
    },
    '& svg': {
        fontSize: 20
    },
    '&:hover': {
        backgroundColor: 'none'
    }
}))

const HelperText = styled(FormHelperText)(({ theme }) => ({
    color: theme.palette.error.main
}))

export default function UploadFile(props) {

    const { enqueueSnackbar } = useSnackbar()
    const { field, fieldState, index, driverDocument, setValue } = props
    const [loading, setLoading] = React.useState(false)
    const [downloading, setDownloading] = React.useState(false)

    function customSleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const sleep = async (ms) => await customSleep(ms);

    function formatFileSize(sizeInBytes) {
        const KB = 1024
        const MB = KB * 1024

        if (sizeInBytes >= MB) {
            return (sizeInBytes / MB).toFixed(2) + " MB"
        }
        return (sizeInBytes / KB).toFixed(2) + " KB"
    }

    function isValidFile(file) {
        const MB = 1024 * 1024
        const maxSize = 5 * MB
        return file.size <= maxSize
    }
    const handleChange = async (e) => {
        if (e.target.files.length) {
            setLoading(true)
            const file = e.target.files[0]
            e.target.value = "";
            setValue(`driver_documents.${index}.fname`, file.name)
            // if (!isValidFile(file)) {
            //     enqueueSnackbar(`File ${file.name} cannot be more than 5 MB.`, { variant: 'warning' })
            //     await sleep(300)
            //     setLoading(false)
            //     return
            // }
            setValue(`driver_documents.${index}.fsize`, file.size)
            await sleep(300)
            field.onChange(file)
            setLoading(false)
        }
    }

    const handleClose = (e) => {
        e.stopPropagation()
        field.onChange(null)
        setValue(`driver_documents.${index}.fname`, null)
        setValue(`driver_documents.${index}.fsize`, null)
        if (driverDocument?.id || driverDocument?.file_path) {
            setValue(`driver_documents.${index}.file_path`, null)
            setValue(`driver_documents.${index}.id`, null)
        }
    }

    const handleDownload = (e) => {
        e.preventDefault()
        setDownloading(true)
        const ddid = driverDocument?.id
        DriversApi.downloadFile(ddid)
            .then(res => {
                saveAs(res.data, driverDocument?.fname || 'driver-doc')
            })
            .catch(error => {
                const message = error.response?.data?.message;
                const status = error.response?.status;
                const errorMessage = message ? `${message} - ${status}` : error.message;
                enqueueSnackbar(errorMessage, { variant: 'error' });
            })
            .finally(() => setDownloading(false))
    }

    return (
        <Box style={{ position: 'relative' }}>
            <input
                type='file'
                id={`contained-button-file-${index}`}
                style={{ display: 'none' }}
                onChange={handleChange}
            />
            <label htmlFor={`contained-button-file-${index}`}>
                <UploadButton
                    iserror={fieldState.error ? 'true' : 'false'}
                    focusRipple
                    component="span"
                >
                    Grag & Drop file or {' '} <span> Browser</span>
                </UploadButton>
            </label>
            {driverDocument?.fname &&
                <CustomFileDetails loading={loading ? 'true' : 'false'} fsize={driverDocument.fsize}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 5 }}>
                        {props.editMode && driverDocument?.file_path && !downloading ?
                            <Tooltip title='Download'>
                                <IconButton
                                    onClick={handleDownload}
                                    onMouseDown={(e) => e.preventDefault()}
                                    style={{
                                        backgroundColor: !driverDocument.fsize ? colors.red[900] : colors.green[900],
                                        color: '#fff',
                                    }}
                                    size='small'
                                >
                                    <Download />
                                </IconButton>
                            </Tooltip>
                            : downloading ? 
                            <CircularProgress size={'20px'} style={{ color: '#fff' }} /> : null
                        }
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Tooltip title={driverDocument.fname}>
                                <Typography component='p' className='fname' noWrap style={{maxWidth: 180}}>{driverDocument.fname}</Typography>
                            </Tooltip>
                            <Typography component='p' className='fsize'>{driverDocument.fsize ? formatFileSize(driverDocument.fsize) : 'File more than 5 MB.'}</Typography>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingRight: 5, }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography component='p' className='fname' align='end'>{loading ? 'Uploading' : !driverDocument.fsize ? 'Failed upload' : 'Upload Complete'}</Typography>
                            <Typography component='p' className='fsize' align='end'>Tap to {loading ? 'cancel' : 'undo'}</Typography>
                        </div>
                        {loading ?
                            <CircularProgress size={'20px'} style={{ color: '#fff' }} />
                            :
                            <Tooltip title='Remove'>
                                <IconButton
                                    onClick={handleClose}
                                    onMouseDown={(e) => e.preventDefault()}
                                    style={{
                                        backgroundColor: !driverDocument.fsize ? colors.red[900] : colors.green[900],
                                        color: '#fff',
                                    }}
                                    size='small'
                                >
                                    <Close />
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                </CustomFileDetails>
            }
            {!!fieldState.error && <HelperText>{fieldState.error?.message}</HelperText>}
        </Box>
    )

}