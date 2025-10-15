import { Box, colors } from '@mui/material'
import { styled } from '@mui/material/styles'

const CustomCell = styled(Box)(({ theme, color }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: color ? colors[color][50] : colors.yellow[50],
  color: color ? colors[color][500] : theme.palette.primary.main,
  paddingInline: 6,
  paddingBlock: 2,
  borderRadius: '5px',
  fontWeight: 600,
  lineHeight: 1.2,
  textTransform: 'capitalize',
  boxShadow: color
    ? colors[color][300] + ' 0px 0px 0px 1px;'
    : colors.yellow[300] + ' 0px 0px 0px 1px;',
  fontSize: 12
}))

export default CustomCell
