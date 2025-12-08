import React from 'react'
import { Grid, IconButton, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import { StyledButton, SubmitButton } from '..'
import { useOrderMutations } from '../../hooks/useOrders'
import UploadPDF from '../UploadFile/UploadPDF'


export default function UploadPDFFile(props) {

    const { order_id } = props
    const [loading, setLoading] = React.useState(false)
    const { uploadFile } = useOrderMutations()

    const [data, setData] = React.useState({ fname: '', fsize: '', file: null })

    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        const formData = new FormData()
        formData.append('order_id', order_id)
        formData.append('fname', data.fname)
        formData.append('fsize', data.fsize)
        formData.append('file', data.file)
        try {
            const order = await uploadFile.mutateAsync(formData)
            if (props.onUploadSuccess && order) {
                props.onUploadSuccess(order)
            }
            props.handleClose()
        }
        catch (err) {
            //
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <Grid container spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                    <Grid size='auto'>
                        <Typography variant='boday1' align='center' fontWeight={600}>Upload File</Typography>
                    </Grid>
                    <Grid size='auto'>
                        <IconButton
                            onClick={() => props.handleClose()}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={12}>
                <UploadPDF
                    value={data}
                    setValue={setData}
                />
            </Grid>
            <Grid size={12}>
                <Grid container spacing={2}>
                    <Grid size='auto'>
                        <SubmitButton
                            type='button'
                            color='primary'
                            variant='contained'
                            size='small'
                            onClick={onSubmit}
                            textTransform='capitalize'
                            isLoading={loading}
                            disabled={!data.fname}
                        >
                            Upload
                        </SubmitButton>
                    </Grid>
                    <Grid size='auto'>
                        <StyledButton
                            variant='outlined'
                            color='error'
                            size='small'
                            disabled={loading}
                            textTransform='capitalize'
                            onClick={() => props.handleClose()}
                        >
                            Cancel
                        </StyledButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

}