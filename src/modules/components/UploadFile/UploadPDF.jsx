import React from 'react'
import { Box, Button, CircularProgress, colors, IconButton, Typography, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Close } from '@mui/icons-material'

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


export default function UploadPDF(props) {

    const { setValue, value } = props
    const [loading, setLoading] = React.useState(false)

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

    const handleChange = async (e) => {
        if (e.target.files.length) {
            setLoading(true)
            const file = e.target.files[0]
            e.target.value = "";
            setValue((prev) => ({ ...prev, fname: file.name, fsize: file.size, file: file }))
            await sleep(300)
            setLoading(false)
        }
    }

    const handleClose = (e) => {
        e.stopPropagation()
        setValue((prev) => ({ ...prev, fname: '', fsize: '', file: null }))
    }

    return (
        <Box style={{ position: 'relative' }}>
            <input
                type='file'
                id={`contained-button-file-pdf`}
                style={{ display: 'none' }}
                onChange={handleChange}
            />
            <label htmlFor={`contained-button-file-pdf`}>
                <UploadButton
                    focusRipple
                    component="span"
                >
                    Drag & Drop file or {' '} <span> Browser</span>
                </UploadButton>
            </label>
            {value?.fname &&
                <CustomFileDetails loading={loading ? 'true' : 'false'} fsize={value?.fsize}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 5 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Tooltip title={value.fname}>
                                <Typography component='p' className='fname' noWrap style={{ maxWidth: 180 }}>{value.fname}</Typography>
                            </Tooltip>
                            <Typography component='p' className='fsize'>{value.fsize ? formatFileSize(value.fsize) : 'File more than 5 MB.'}</Typography>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingRight: 5, }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography component='p' className='fname' align='end'>{loading ? 'Uploading' : !value.fsize ? 'Failed upload' : 'Upload Complete'}</Typography>
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
                                        backgroundColor: !value.fsize ? colors.red[900] : colors.green[900],
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
        </Box>
    )

}