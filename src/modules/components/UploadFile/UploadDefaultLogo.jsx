import React from 'react'
import { Box, Grid, Button, CircularProgress, Typography, alpha } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTheme } from '@mui/material/styles'
import { Delete, CloudUpload, CheckCircle, Image as ImageIcon } from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'
import LogoApi from '../../apis/Logo.api'

function UploadDefaultLogo() {

    const { enqueueSnackbar } = useSnackbar()
    const theme = useTheme()
    const [image, setImage] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [uploading, setUploading] = React.useState(false)
    const [deleting, setDeleting] = React.useState(false)
    
    const loadDefaultLogo = React.useCallback(() => {
        setLoading(true)
        LogoApi.loadDefaultLogo()
            .then(res => {
                const result = res.data
                setImage(typeof result === 'string' ? result : null)
            })
            .catch(error => {
                const message = error.response?.data?.message
                const status = error.response?.status
                enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' })
            })
            .finally(() => setLoading(false))
    }, [])

    React.useEffect(() => { loadDefaultLogo() }, [loadDefaultLogo])

    const handleUpload = React.useCallback((base64) => {
        setUploading(true)
        LogoApi.uploadDefaultLogo({ image: base64 })
            .then(() => {
                setImage(base64)
                enqueueSnackbar('Logo uploaded successfully', { variant: 'success' })
            })
            .catch(error => {
                const message = error.response?.data?.message
                const status = error.response?.status
                enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' })
            })
            .finally(() => setUploading(false))
    }, [])

    const readAndUpload = React.useCallback((file) => {
        const reader = new FileReader()
        reader.onload = (e) => handleUpload(e.target.result)
        reader.readAsDataURL(file)
    }, [handleUpload])

    const handleRemove = React.useCallback(() => {
        setDeleting(true)
        LogoApi.removeLogo()
            .then(() => {
                setImage(null)
                enqueueSnackbar('Logo removed successfully', { variant: 'info' })
            })
            .catch(error => {
                const message = error.response?.data?.message
                const status = error.response?.status
                enqueueSnackbar(message ? `${message} - ${status}` : error.message, { variant: 'error' })
            })
            .finally(() => setDeleting(false))
    }, [])

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop: (files) => { if (files[0]) readAndUpload(files[0]) },
        accept: { 'image/*': [] },
        multiple: false,
        noClick: true,
        noKeyboard: true,
        disabled: uploading || deleting,
    })

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
        </Box>
    )

    return (
        <Box {...getRootProps()}>
            <input {...getInputProps()} />
            {image ? (
                <Box>
                    <Box sx={{ border: `1.5px solid #ccc`, borderRadius: 3, overflow: 'hidden', background: '#fff',  mb: 2, }}>
                        <Box sx={{ background: `repeating-conic-gradient(${alpha('#000', 0.04)} 0% 25%, transparent 0% 50%) 0 0 / 16px 16px`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, p: 4, position: 'relative', }}>
                            <img
                                src={image}
                                alt='Default BOL Logo'
                                style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain', display: 'block' }}
                            />
                            <Box sx={{
                                position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.4, borderRadius: 5,
                                background: alpha('#10B981', 0.12), border: `1px solid ${alpha('#10B981', 0.25)}`,
                            }}>
                                <CheckCircle sx={{ fontSize: 12, color: '#059669' }} />
                                <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#059669' }}>Active</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.07)}`, background: alpha(theme.palette.primary.main, 0.02) }}>
                            <ImageIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#1E293B', flex: 1 }}>
                                Default BOL Logo
                            </Typography>
                        </Box>
                    </Box>
                    <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Button
                                fullWidth variant='outlined' color='error'
                                startIcon={deleting ? <CircularProgress size={14} color='inherit' /> : <Delete />}
                                disabled={deleting || uploading}
                                onClick={handleRemove}
                                sx={{ textTransform: 'none', fontWeight: 700, fontSize: 15, borderRadius: 2, height: 43, borderStyle: 'dashed', }}
                            >
                                {deleting ? 'Removing...' : 'Remove Logo'}
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Button
                                fullWidth variant='outlined'
                                startIcon={uploading ? <CircularProgress size={14} color='inherit' /> : <CloudUpload />}
                                disabled={deleting || uploading}
                                onClick={open}
                                sx={{ textTransform: 'none', fontWeight: 700, fontSize: 15, borderRadius: 2, height: 43, }}
                            >
                                {uploading ? 'Uploading...' : 'Replace Logo'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Box
                    onClick={open}
                    sx={{
                        border: `2px dashed ${isDragActive ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.25)}`,
                        borderRadius: 3, minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                        cursor: uploading ? 'not-allowed' : 'pointer', background: isDragActive ? alpha(theme.palette.primary.main, 0.04) : alpha(theme.palette.primary.main, 0.01),
                        transition: 'all 0.2s ease', px: 3, '&:hover': !uploading ? { borderColor: theme.palette.primary.main, background: alpha(theme.palette.primary.main, 0.03), } : {},
                    }}
                >
                    {uploading ? (
                        <>
                            <CircularProgress size={36} sx={{ color: theme.palette.primary.main }} />
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>
                                Uploading...
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Box sx={{
                                width: 60, height: 60, borderRadius: '50%', background: alpha(theme.palette.primary.main, 0.08), border: `1.5px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', ...(isDragActive && { transform: 'scale(1.1)' }),
                            }}>
                                <CloudUpload sx={{ fontSize: 28, color: theme.palette.primary.main }} />
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>
                                    {isDragActive ? 'Drop your logo here' : 'Drag & drop your logo'}
                                </Typography>
                                <Typography sx={{ fontSize: 12.5, color: '#94A3B8', mt: 0.5 }}>
                                    or{' '}
                                    <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                                        click to browse
                                    </span>
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: 11, color: '#CBD5E1' }}>
                                PNG, JPG, SVG, WEBP · Max 5 MB
                            </Typography>
                        </>
                    )}
                </Box>
            )}
        </Box>
    )
}

export default React.memo(UploadDefaultLogo)