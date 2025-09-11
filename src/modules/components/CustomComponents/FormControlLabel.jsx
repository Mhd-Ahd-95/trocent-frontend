import { styled } from '@mui/material/styles'
import {  FormControlLabel } from '@mui/material'


export default styled(FormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '13px',
    fontWeight: 500
  }
}))