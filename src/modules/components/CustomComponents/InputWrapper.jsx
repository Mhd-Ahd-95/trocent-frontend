import React from 'react'
import TextInput from './TextInput'
import { colors, FormHelperText, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export default function InputWrapper (props) {
  const theme = useTheme()
  const { setValue, data, field, placeholder, textHelper, noSpace } = props
  const [inputValue, setInputValue] = React.useState('')
  const [focus, setFocus] = React.useState(false)

  const handleRemove = index => {
    const refs = [...data]
    refs.splice(index, 1)
    setValue(field, refs)
    setInputValue('')
  }

  const handleChange = e => {
    const value = e.target.value
    setInputValue(value)
    const splitComma = value.includes(',')
    const splitSpace = value.includes(' ')
    if (splitComma) {
      setValue(field, [...data, value])
      setInputValue('')
    }
    if (!noSpace) {
      if (splitSpace) {
        setValue(field, [...data, value])
        setInputValue('')
      }
    }
  }

  return (
    <Grid container>
      <Grid
        container
        sx={{
          border:
            data?.length > 0 && !focus
              ? `1px solid ${theme.palette.grey[400]}`
              : data?.length > 0 && focus
              ? `2px solid ${theme.palette.primary.main}`
              : 'none',
          borderRadius: 1,
          width: '100%'
        }}
      >
        <Grid size={12}>
          <TextInput
            placeholder={placeholder}
            variant='outlined'
            fullWidth
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            sx={{
              '& .MuiOutlinedInput-root': {
                border:
                  data?.length > 0
                    ? 'none'
                    : data?.length === 0 && focus
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.grey[400]}`,
                borderBottom:
                  data?.length === 0 && focus
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.grey[400]}`,
                borderBottomLeftRadius: data?.length > 0 ? 0 : 4,
                borderBottomRightRadius: data?.length > 0 ? 0 : 4,
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' }
              },
              '& .MuiOutlinedInput-input': {
                outline: 'none',
                boxShadow: 'none'
              }
            }}
            // helperText={'Add multiple reference numbers (use comma or space)'}
          />
        </Grid>
        <Grid size={12} px={1} py={0.5}>
          {data.map((ref, index) => {
            const trimRef = ref.split(',')[0].trim()
            return (
              <Typography
                variant='caption'
                display={'inline-flex'}
                alignItems={'center'}
                flexWrap={1}
                gap={1}
                align='center'
                key={index}
                color='primary'
                sx={{
                  borderRadius: 1,
                  border: `0.01rem solid ${colors.yellow[200]}`,
                  background: colors.yellow[50],
                  paddingInline: 1,
                  paddingBlock: 0.2,
                  marginRight: 1,
                  marginBlock: 0.5
                }}
              >
                {trimRef}{' '}
                <span
                  style={{ cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
                  onClick={() => handleRemove(index)}
                >
                  x
                </span>
              </Typography>
            )
          })}
        </Grid>
      </Grid>
      {textHelper && <FormHelperText>{textHelper}</FormHelperText>}
    </Grid>
  )
}
