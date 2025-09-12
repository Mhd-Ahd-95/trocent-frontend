import React, { useState } from 'react'
import { Autocomplete } from '@mui/material'
import global from '../../global'
import { Controller } from 'react-hook-form'
import TextInput from './TextInput'

export default function SearchableInput (props) {
  const addressBook = global.static.address_book
  const { label, onSelect, name, control } = props
  const [options, setOptions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedValue, setSelectedValue] = useState(null)

  const fetchSuggestions = query => {
    console.log(query)
    if (query.length < 2) {
      setOptions([])
      return
    }
    const searching = addressBook.filter(ab =>
      ab?.company_location.toLowerCase().includes(query.toLowerCase())
    )
    console.log(searching)
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
          options={options.map(o => o.company_location)}
          inputValue={inputValue}
          onInputChange={(e, value) => {
            setInputValue(value)
            fetchSuggestions(value)
          }}
          onChange={(e, value) => {
            console.log('value: ', value)
            if (value) {
              setSelectedValue(value)
              field.onChange(value)
              const selected = options.find(op => op.company_location === value)
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
              label={label}
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
