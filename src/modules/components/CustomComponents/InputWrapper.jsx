import React from 'react'
import TextInput from './TextInput'
import { colors, FormHelperText, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import global from '../../global'

function InputWrapper(props) {

  const theme = useTheme()
  const { setValue, data, field, placeholder, textHelper, noSpace } = props
  const [inputValue, setInputValue] = React.useState('')
  const [focus, setFocus] = React.useState(false)
  const [error, setError] = React.useState('')
  const { isEmail } = global.methods
  const handleRemove = index => {
    const refs = [...data]
    refs.splice(index, 1)
    setValue(field, refs)
    setInputValue('')
  }

  const handleChange = e => {

    const value = e.target.value
    setInputValue(value)

    if (props.validatedEmail) setError('');
    const splitComma = value.includes(',')
    const splitSpace = value.includes(' ')
    const trimValue = value.split(',')[0].trim()

    if (props.validatedEmail && !isEmail(trimValue) && splitComma) {
      setError(`${trimValue} must be email.`)
      setInputValue(trimValue)
      return
    }

    if (splitComma) {
      if (data.includes(trimValue)) {
        setInputValue('')
        return
      }
      setValue(field, [...data, trimValue])
      setInputValue('')
    }

    if (!noSpace) {
      if (splitSpace) {
        if (data.includes(trimValue)) {
          setInputValue('')
          return
        }
        setValue(field, [...data, trimValue])
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
            label={props.label || ''}
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            sx={{
              '& .MuiOutlinedInput-root': {
                zIndex: 1,
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
              },
              '& .MuiInputLabel-shrink': props.shrinkOut === 'true' ? {
                zIndex: 100,
                paddingInline: 1,
                backgroundColor: '#fff'
              } : {}
            }}
          />
        </Grid>
        <Grid size={12} px={1} py={0.5}>
          {data?.map((ref, index) => {
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
                  style={{ cursor: 'pointer', fontWeight: 600, fontSize: 14, marginTop: -2 }}
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
      {error && props.validatedEmail && <FormHelperText sx={{ color: props.validatedEmail ? '#e74c3c' : '' }}>{error}</FormHelperText>}
    </Grid>
  )
}


export default React.memo(InputWrapper)