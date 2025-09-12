import React, { useState } from 'react'
import { Autocomplete } from '@mui/material'
import { Controller } from 'react-hook-form'
import TextInput from './TextInput'

export default function SearchableInput (props) {
  const { label, onSelect, name, control, fieldProp } = props
  const [options, setOptions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedValue, setSelectedValue] = useState(null)

  const fetchSuggestions = query => {
    if (query.length < 2) {
      setOptions([])
      return
    }
    const searching =
      props.options?.filter(opt =>
        opt[fieldProp].toLowerCase().includes(query.toLowerCase())
      ) || []
    setOptions(searching)
  }

  return (
    <Controller
      name={name}
      rules={props.rules || {}}
      control={control}
      render={({ field, fieldState }) => (
        <Autocomplete
          {...field}
          freeSolo
          options={options.map(o => o[fieldProp])}
          inputValue={inputValue}
          onInputChange={(e, value) => {
            setInputValue(value)
            fetchSuggestions(value)
          }}
          onChange={(e, value) => {
            if (value) {
              setSelectedValue(value)
              field.onChange(value)
              const selected = options.find(op => op[fieldProp] === value)
              onSelect(selected)
            }
          }}
          onBlur={() => {
            if (inputValue && !selectedValue) {
              field.onChange(inputValue)
            }
          }}
          renderInput={params => (
            <TextInput
              {...params}
              placeholder={props.placeholder || ''}
              label={label || ''}
              variant='outlined'
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      )}
    />
  )
}
