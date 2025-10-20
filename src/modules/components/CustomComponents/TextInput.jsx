import { styled } from '@mui/material/styles'
import { TextField } from '@mui/material'

const TextInput = styled(TextField)(({ theme, size }) => ({
  '& .MuiInputBase-root': {
    zIndex: 100,
    height: size === 'small' ? 40 : 45
  },
  '& .MuiOutlinedInput-input': {
    fontSize: size === 'small' ? '13px' : '14px',
    '&::placeholder': {
      fontSize: size === 'small' ? '11px' : '12px',
      // opacity: 0.5
    }
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

export default TextInput