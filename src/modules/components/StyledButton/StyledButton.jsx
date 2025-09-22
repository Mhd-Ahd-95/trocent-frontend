import React from 'react'
import { Button, Tooltip, styled } from '@mui/material'

const CustomButton = styled(Button, {
  shouldForwardProp: prop => !['spacing', 'size'].includes(prop)
})(
  ({
    theme,
    color = 'primary',
    spacing = true,
    size = 'medium',
    variant = 'contained',
    disabled
  }) => ({
    display: 'flex',
    overflow: 'hidden',
    width: '100%',
    height: '40px',
    borderRadius: 10,
    boxShadow: disabled
      ? 'none'
      : variant === 'contained'
      ? '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
      : 'none',
    marginInline: spacing ? theme.spacing(0.5) : 0,
    fontWeight: size === 'small' || size === 'tiny' ? 500 : 600,
    fontSize: size === 'small' || size === 'tiny' ? 13 : 16,
    ...(variant === 'outlined'
      ? {
          border: `1px solid ${
            disabled ? '#0000001f' : theme.palette[color]?.main
          }`,
          color: theme.palette[color]?.main,
          '&:hover': {
            backgroundColor:
              theme.palette[color]?.hover || theme.palette[color]?.main + '20',
            boxShadow: 'none'
          }
        }
      : {
          backgroundColor: disabled ? '#0000001f' : theme.palette[color]?.main,
          color: theme.palette[color]?.contrastText,
          '&:hover': {
            backgroundColor:
              theme.palette[color]?.light || theme.palette[color]?.main,
            boxShadow:
              '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)'
          }
        })
  })
)

// StyledButton component
const StyledButton = props => {
  const {
    children,
    tooltip,
    color,
    padding,
    margin,
    size = 'medium',
    spacing = true,
    style,
    py,
    px,
    textTransform,
    ...otherProps
  } = props

  const buttonElement = (
    <CustomButton
      color={color}
      size={size}
      spacing={spacing}
      style={{
        padding: padding || '',
        marginInline: margin || '',
        textTransform: textTransform || '',
        paddingInline: px || '',
        paddingBlock: py || '',
        ...style
      }}
      {...otherProps}
    >
      {children}
    </CustomButton>
  )

  return tooltip ? (
    <Tooltip title={tooltip} placement='bottom'>
      {buttonElement}
    </Tooltip>
  ) : (
    buttonElement
  )
}

export default StyledButton
