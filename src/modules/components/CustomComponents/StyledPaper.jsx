import { styled } from '@mui/material/styles'
import { Paper } from '@mui/material'

const PaperStyled = styled(Paper)(({ theme }) => ({
  boxShadow:
    'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
  paddingInline: theme.spacing(3),
  paddingBlock: theme.spacing(2),
  borderRadius: theme.spacing(1)
}))

export default PaperStyled
