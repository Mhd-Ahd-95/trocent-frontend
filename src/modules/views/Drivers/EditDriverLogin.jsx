import React from 'react'
import { Box, CircularProgress, Grid } from '@mui/material'
import DriverLogin from './CreateDriverLogin'
import { useUser, useUserMutations } from '../../hooks/useUsers'

export default function EditLogin(props) {

    const { user_id, setOpenDrawer } = props

    const { data, isLoading, isError, error, refetch } = useUser(user_id)

    const { update } = useUserMutations()

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            const errorMessage = message ? `${message} - ${status}` : error.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [isError, error])

    return (
        <Grid container sx={{ height: '100%' }}>
            {isLoading ?
                <Grid container component={Box} justifyContent='center' alignItems='center' py={15} size={12}>
                    <CircularProgress />
                </Grid>
                :
                <Grid size={12}>
                    <DriverLogin
                        initialValues={{ ...data }}
                        submit={async (payload) => await update.mutateAsync({ id: user_id, payload })}
                        setOpen={setOpenDrawer}
                        refetchUser={refetch}
                        editMode
                    />
                </Grid>
            }
        </Grid>
    )

}