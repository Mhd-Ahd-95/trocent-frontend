import React from 'react'
import { Grid, Typography, CircularProgress } from '@mui/material'
import { StyledButton } from '../../components'

export default function Confirmation(props) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmitStatus = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        await props.handleSubmit()
        props.handleClose()
    }
    return (
        <Grid container spacing={2} alignItems='center' justifyContent={'center'}>
            <Grid size={12}>
                <Typography variant='body2' color='textPrimary' align='center' fontWeight={600}>
                    {props.title}
                </Typography>
            </Grid>
            {props.subtitle && (
                <Grid size={12}>
                    <Typography
                        component='p'
                        color='textSecondary'
                        align='center'
                        gutterBottom
                        fontSize={'13px'}
                    >
                        {props.subtitle}
                    </Typography>
                </Grid>
            )}
            {props.subtitle2 && (
                <Grid size={12}>
                    <Typography variant='h5' color='primary' align='center'>
                        {props.subtitle2}
                    </Typography>
                </Grid>
            )}
            <Grid size={12}>
                <Grid
                    container
                    spacing={3}
                    justifyContent='center'
                    alignItems={'center'}
                >
                    <Grid size='auto'>
                        <StyledButton
                            variant='contained'
                            color={'primary'}
                            fullWidth
                            textTransform='capitalize'
                            disabled={isSubmitting}
                            onClick={handleSubmitStatus}
                        >
                            {isSubmitting && <CircularProgress style={{ marginRight: "10px" }} size={20} />}
                            Confirm
                        </StyledButton>
                    </Grid>
                    <Grid size='auto'>
                        <StyledButton
                            fullWidth
                            onClick={props.handleClose}
                            color='inherit'
                            textTransform='capitalize'
                        >
                            Cancel
                        </StyledButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
