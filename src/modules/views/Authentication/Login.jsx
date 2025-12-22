import React from 'react'
import { AuthLayout } from '../../layouts'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  FormControlLabel,
  IconButton,
  InputAdornment,
  Grid,
  colors,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material'
import { StyledCheckBox, SubmitButton } from '../../components'
import { AuthContext } from '../../contexts'
import LoginAPI from '../../apis/login.api'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false)
  const handleClickShowPassword = () => setShowPassword(show => !show)
  const usernameRef = React.useRef()
  const passwordRef = React.useRef()
  const [remember, setRemember] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const authContext = React.useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.target)
    const email = formData.get('username')
    const password = formData.get('password')
    LoginAPI.login(email, password, remember)
      .then(res => {
        localStorage.setItem('token', res.data.access_token)
        authContext.handleAuth(true, JSON.stringify(res.data))
        navigate('/')
      })
      .catch(error => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        const errorMessage = message ? `${message} - ${status}` : error.message;
        enqueueSnackbar(errorMessage, { variant: 'error' });
        usernameRef.current.value = ''
        passwordRef.current.value = ''
      })

      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <AuthLayout title='Sign in'>
      <Grid
        container
        component={'form'}
        justifyContent={'flex-start'}
        alignItems={'flex-start'}
        spacing={2}
        onSubmit={handleSubmit}
      >
        <Grid size={12}>
          <TextField
            label='Username'
            variant='outlined'
            required
            fullWidth
            disabled={isLoading}
            name='username'
            inputRef={usernameRef}
            type='text'
            sx={{
              '& .MuiInputBase-root': {
                height: 45
              },
              '& .MuiOutlinedInput-input': {
                fontSize: '14px'
              },
              '& .MuiInputLabel-root': {
                fontSize: '13px'
              },
              '& .MuiInputLabel-shrink': {
                fontSize: '14px'
              }
            }}
          />
        </Grid>
        <Grid size={12}>
          <FormControl
            variant='outlined'
            fullWidth
            required
            sx={{
              '& .MuiInputBase-root': {
                height: 45
              },
              '& .MuiOutlinedInput-input': {
                fontSize: '14px'
              },
              '& .MuiInputLabel-root': {
                fontSize: '13px'
              },
              '& .MuiInputLabel-shrink': {
                fontSize: '14px'
              }
            }}
          >
            <InputLabel htmlFor='outlined-adornment-password'>
              Password
            </InputLabel>
            <OutlinedInput
              fullWidth
              name='password'
              required
              disabled={isLoading}
              inputRef={passwordRef}
              id='outlined-adornment-password'
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label={
                      showPassword
                        ? 'hide the password'
                        : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label='Password'
            />
          </FormControl>
        </Grid>

        <Grid size={12} component={Box} pt={1} pl={0.5}>
          <FormControlLabel
            control={
              <StyledCheckBox
                checked={remember}
                onChange={() => setRemember(!remember)}
                disabled={isLoading}
              />
            }
            label={
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '15px',
                  color: colors.grey[800]
                }}
              >
                Remember me
              </Typography>
            }
          />
        </Grid>
        <Grid size={12} component={Box} pt={1}>
          <SubmitButton
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            textTransform='capitalize'
            isLoading={isLoading}
          >
            Sign In
          </SubmitButton>
        </Grid>
      </Grid>
    </AuthLayout>
  )
}
