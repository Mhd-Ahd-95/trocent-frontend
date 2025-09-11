import { styled } from '@mui/material/styles'
import { TextField } from '@mui/material'

export default styled(TextField)(({ theme, size }) => ({
  '& .MuiInputBase-root': {
    height: size === 'small' ? 40 : 45
  },
  '& .MuiOutlinedInput-input': {
    fontSize: size === 'small' ? '13px' : '14px'
  },
  '& .MuiInputLabel-root': {
    fontSize: size === 'small' ? '12px' : '13px',
    marginTop: size === 'small' ? 5 : 0
  },
  '& .MuiInputLabel-shrink': {
    fontSize: size === 'small' ? '13px' : '14px',
    marginTop: size === 'small' ? 2 : 0
  }
}))