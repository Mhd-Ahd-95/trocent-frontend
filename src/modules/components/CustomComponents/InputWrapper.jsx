import React, { useState, useCallback, memo } from 'react'
import TextInput from './TextInput'
import { colors, FormHelperText, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import global from '../../global'

const EmailChip = memo(({ value, index, onRemove }) => {
  const trimValue = value.split(',')[0].trim()

  return (
    <Typography
      variant='caption'
      display={'inline-flex'}
      alignItems={'center'}
      flexWrap={1}
      gap={1}
      align='center'
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
      {trimValue}{' '}
      <span
        style={{ cursor: 'pointer', fontWeight: 600, fontSize: 14, marginTop: -2 }}
        onClick={() => onRemove(index)}
      >
        x
      </span>
    </Typography>
  )
})

EmailChip.displayName = 'EmailChip'

function InputWrapper(props) {
  const theme = useTheme()
  const { setValue, data, field, placeholder, textHelper, noSpace, validatedEmail, label, shrinkOut } = props
  const [inputValue, setInputValue] = useState('')
  const [focus, setFocus] = useState(false)
  const [error, setError] = useState('')
  const { isEmail } = global.methods

  const handleRemove = useCallback((index) => {
    const refs = [...data]
    refs.splice(index, 1)
    setValue(field, refs)
    setInputValue('')
  }, [data, field, setValue])

  const handleChange = useCallback((e) => {
    const value = e.target.value
    setInputValue(value)

    if (validatedEmail) setError('')

    const splitComma = value.includes(',')
    const splitSpace = value.includes(' ')
    const trimValue = value.split(',')[0].trim()

    if (validatedEmail && !isEmail(trimValue) && splitComma) {
      setError(`${trimValue} must be email.`)
      setInputValue(trimValue)
      return
    }

    if (splitComma) {
      if (data.includes(trimValue)) {
        setInputValue('')
        return
      }
      setValue(field, [trimValue, ...data])
      setInputValue('')
      return
    }

    if (!noSpace && splitSpace) {
      if (data.includes(trimValue)) {
        setInputValue('')
        return
      }
      setValue(field, [trimValue, ...data])
      setInputValue('')
    }
  }, [data, field, isEmail, noSpace, setValue, validatedEmail])

  const handleFocus = useCallback(() => setFocus(true), [])
  const handleBlur = useCallback(() => setFocus(false), [])

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Tab' && inputValue.trim() && props.isTapped) {
      e.preventDefault()
      if (data.includes(inputValue.trim())) {
        setInputValue('')
        return
      }
      setValue(field, [inputValue.trim(), ...data])
      setInputValue('')
    }
  }, [inputValue])

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
            label={label || ''}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onMouseEnter={(e) => {

            }}
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
              '& .MuiInputLabel-shrink': shrinkOut === 'true' ? {
                zIndex: 100,
                paddingInline: 1,
                backgroundColor: '#fff'
              } : {}
            }}
          />
        </Grid>
        {data?.length > 0 && (
          <Grid size={12} px={1} py={0.5}>
            {data.map((ref, index) => (
              <EmailChip
                key={`${field}-${index}`}
                value={ref}
                index={index}
                onRemove={handleRemove}
              />
            ))}
          </Grid>
        )}
      </Grid>
      {textHelper && <FormHelperText>{textHelper}</FormHelperText>}
      {error && validatedEmail && (
        <FormHelperText sx={{ color: '#e74c3c' }}>
          {error}
        </FormHelperText>
      )}
    </Grid>
  )
}

export default memo(InputWrapper)