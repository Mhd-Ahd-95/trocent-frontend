import React from 'react'
import {
    Grid,
    Button,
    useTheme,
    CircularProgress,
    colors
} from '@mui/material'
import { useWatch } from 'react-hook-form'
import CustomersApi from '../../apis/Customers.api'
import { useSnackbar } from 'notistack'
import { styled } from '@mui/material/styles'
import { CloudUpload, Delete } from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'

const UploadButton = styled(Button)(({ theme, isdragactive }) => ({
    width: '100%',
    height: '90px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    border: isdragactive === 'true' ? '1px dashed ' + colors.grey[600] : '1px solid ' + colors.grey[400],
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

function UploadLogo(props) {

    const { field, control, logo_path } = props
    const image = useWatch({ name: 'logo', control })
    const { enqueueSnackbar } = useSnackbar()
    const [downloading, setDownloading] = React.useState(false)

    const onImageUpload = event => {
        if (event.target.files.length) {
            const f = event.target.files[0]
            var reader = new FileReader();
            reader.onload = function (e) {
                field.onChange(reader.result)
            };
            reader.readAsDataURL(f)
        }
    };

    const theme = useTheme()

    const handleDownload = (e) => {
        e.preventDefault()
        setDownloading(true)
        const ddid = props.customerId
        CustomersApi.downloadFile(ddid)
            .then(res => {
                saveAs(res.data, 'customer-logo')
            })
            .catch(error => {
                const message = error.response?.data?.message;
                const status = error.response?.status;
                const errorMessage = message ? `${message} - ${status}` : error.message;
                enqueueSnackbar(errorMessage, { variant: 'error' });
            })
            .finally(() => setDownloading(false))
    }

    const onDrop = (files) => {
        if (files.length) {
            const f = files[0]
            var reader = new FileReader();
            reader.onload = function (e) {
                field.onChange(reader.result)
            };
            reader.readAsDataURL(f)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true, noKeyboard: true })


    return <Grid position={'relative'} container justifyContent='center' alignContent='center' alignItems='center' {...getRootProps()}>
        <input {...getInputProps()} style={{ display: 'none' }} />
        <Grid size={12} >
            {image
                ? <>
                    <img
                        src={image}
                        alt='Preview'
                        style={{
                            width: '100%',
                            height: '90px',
                            backgroundColor: theme.palette.background.paper,
                            border: '1px solid #c4c4c4',
                            boxShadow: 'none',
                        }}
                    />
                    <div style={{ padding: '5px 0', display: 'flex', flexDirection: 'row', gap: 5 }}>
                        <Button
                            variant='outlined'
                            color='error'
                            fullWidth
                            startIcon={<Delete />}
                            disabled={downloading}
                            onClick={() => field.onChange(null)}
                            sx={{ textTransform: 'capitalize', border: '1px dashed' }}
                        >
                            Remove
                        </Button>
                        {props.editMode && logo_path &&
                            <Button
                                variant='outlined'
                                color='info'
                                fullWidth
                                disabled={downloading}
                                startIcon={<CloudUpload />}
                                onClick={handleDownload}
                                sx={{ textTransform: 'capitalize', border: '1px dashed' }}
                            >
                                {downloading && <CircularProgress style={{ marginRight: "10px" }} size={20} />}
                                Download
                            </Button>
                        }
                    </div>
                </>
                : <>
                    <input
                        accept='image/*'
                        style={{ display: 'none' }}
                        id='image'
                        type='file'
                        name='image'
                        onChange={onImageUpload}
                    />

                    <label htmlFor='image' >
                        <UploadButton
                            focusRipple
                            component="span"
                            isdragactive={isDragActive ? 'true' : 'false'}
                        >
                            Drag & Drop Logo or {' '} <span> Browse</span>
                        </UploadButton>
                    </label>
                </>}
        </Grid>
    </Grid>

}

export default React.memo(UploadLogo)