import { Button } from '@mui/material'
import React from 'react'
import { AuthContext } from '../../contexts'
import { useNavigate } from 'react-router-dom'

function NotAuthorized() {
    const { handleAuth } = React.useContext(AuthContext)
    const navigate = useNavigate()
    return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h1>403 — Not Authorized</h1>
            <p>You don't have permission to access this page.</p>
            <Button
                color='primary'
                variant='contained'
                onClick={() => {
                    handleAuth(false)
                    navigate('/login')
                }}
            >
                Log Out
            </Button>
        </div>
    )
}

export default NotAuthorized