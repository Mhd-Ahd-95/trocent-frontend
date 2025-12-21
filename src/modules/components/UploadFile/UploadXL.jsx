import React from 'react'
import { useSnackbar } from 'notistack'
import { Box, colors, Button, Tooltip, IconButton, Typography, CircularProgress, FormHelperText } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Close } from '@mui/icons-material'
import dataProcessing from '../CustomerFormSections/dataProcessing'
import staticProperties from '../CustomerFormSections/StaticProperties'

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

const CustomError = styled('p')(({ theme }) => (
    {
        color:
            theme.palette.error.main,
        whiteSpace: 'pre-wrap',
        marginTop: '6px',
        fontSize: 12,
    }
))

const CustomFileDetails = styled('div')(({ theme, loading, fsize, error }) => ({
    position: 'absolute',
    height: '40px',
    width: '100%',
    top: 0,
    left: 0,
    borderRadius: 3,
    backgroundColor: loading === 'true' ? colors.grey[800] : !fsize ? theme.palette.error.main : error === 'true' ? theme.palette.error.main : colors.green['700'],
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

function trimObjectKeys(row) {
    return Object.keys(row).reduce((obj, key) => {
        obj[key.trim()] = row[key];
        return obj;
    }, {})
}
function loadSheetData(sheet, XLSX) {
    return XLSX.utils.sheet_to_json(sheet, { header: 2, defval: null }).map(row => {
        const trimmedRow = trimObjectKeys(row);
        return trimmedRow;
    })
}

const HelperText = styled(FormHelperText)(({ theme }) => ({
    color: theme.palette.error.main
}))

export default function UploadXlsx(props) {

    const { field, fieldState } = props
    const [fileName, setFileName] = React.useState('');
    const { enqueueSnackbar } = useSnackbar()
    const [fileSize, setFileSize] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(false)

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

    const onFileChange = (event) => {
        setLoading(true)
        if (event.target.files.length) {
            const f = event.target.files[0]
            event.target.value = ""
            setFileName(f.name)
            setFileSize(formatFileSize(f.size))
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                import('xlsx')
                    .then(XLSX => {
                        let excelData = XLSX.read(data, { type: 'binary' });
                        const sheetname = excelData.SheetNames[0]
                        const sheet = excelData.Sheets[sheetname]
                        if (!sheet) enqueueSnackbar(`"Rates" sheet not found`, { variant: 'warning' })
                        else {
                            const dataProcessed = dataProcessing(staticProperties, [...loadSheetData(sheet, XLSX)])
                            const dataSuccessed = dataProcessed[0]
                            const dataErrored = dataProcessed[1]
                            if (Object.keys(dataErrored).length === 0) {
                                field.onChange(dataSuccessed)
                            }
                            else {
                                let message = ''
                                if (Object.entries(dataErrored).length > 0) {
                                    setError(true)
                                    Object.entries(dataErrored).forEach(([key, value]) => {
                                        message += `<strong>${key}:</strong><br />`
                                        Object.entries(value).forEach(([k, v]) => {
                                            message += `&nbsp;&nbsp;- ${v}<br />`
                                        })
                                        message += `<br />`
                                    })
                                    props.setError('items', {
                                        type: 'manual',
                                        message: message
                                    })
                                }
                            }
                        }
                    })
                    .catch(err => enqueueSnackbar(`Failed to load excel file`, { variant: 'error', }))
                    .finally(async () => {
                        await sleep(500)
                        setLoading(false)
                    })
            };
            reader.readAsBinaryString(f)
        }
    }

    const handleClose = (e) => {
        e.stopPropagation()
        setFileName('')
        setFileSize('')
        field.onChange([])
        props.setError('items', { type: 'manual', message: '' })
        setError(false)
    }

    return (
        <Box style={{ position: 'relative' }}>
            <input
                accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                id="contained-button-file-bulk-excel"
                type="file"
                // name='contained-button-file-bulk-excel'
                style={{ display: 'none' }}
                disabled={fileName.length > 0}
                onChange={onFileChange}
            />
            <Typography variant='subtitle2'>Rate Sheet (.xlsx)*</Typography>
            <label htmlFor="contained-button-file-bulk-excel">
                <UploadButton
                    focusRipple
                    component="span"
                    disabled={fileName.length > 0}
                >
                    {fileName.length === 0 && <>
                        Drag & Drop Logo or {' '} <span> Browse</span>
                    </>}
                </UploadButton>
            </label>
            {fileName &&
                <CustomFileDetails loading={loading ? 'true' : 'false'} fsize={fileSize} error={error ? 'true' : 'false'}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 5 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Tooltip title={fileName}>
                                <Typography component='p' className='fname' noWrap style={{ maxWidth: 180 }}>{fileName}</Typography>
                            </Tooltip>
                            <Typography component='p' className='fsize'>{fileSize}</Typography>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingRight: 5, }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography component='p' className='fname' align='end'>{loading ? 'Uploading' : !fileSize ? 'Failed upload' : 'Upload Complete'}</Typography>
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
                                        backgroundColor: !fileSize || error ? colors.red[900] : colors.green[900],
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
            {!!fieldState.error && <CustomError dangerouslySetInnerHTML={{ __html: fieldState.error.message }} />}
        </Box>
    )
}