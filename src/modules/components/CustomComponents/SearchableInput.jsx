import React, { useState } from 'react'
import { Autocomplete, CircularProgress } from '@mui/material'
import { Controller } from 'react-hook-form'
import TextInput from './TextInput'

export default function SearchableInput(props) {
  const { label, onSelect, name, control, fieldProp, options: propsOptions, onBlur: propsOnBlur, } = props
  const [options, setOptions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedValue, setSelectedValue] = useState(null)

  // const fetchSuggestions = query => {
  //   if (query.length < 2) {
  //     setOptions([])
  //     return
  //   }
  //   const searching =
  //     props.options?.filter(opt =>
  //       opt[fieldProp].toLowerCase().includes(query.toLowerCase())
  //     ) || []
  //   setOptions(searching)
  // }

  return (
    <Controller
      name={name}
      rules={props.rules || {}}
      control={control}
      render={({ field, fieldState }) => {
        const valueObject = propsOptions?.find(o => o.id === Number(field.value)) || null;
        return (
          <Autocomplete
            {...field}
            freeSolo
            loading={props.loading || false}
            options={propsOptions || []}
            inputValue={inputValue}
            onInputChange={(e, value) => {
              setInputValue(value)
              // fetchSuggestions(value)
              if (!value) setSelectedValue(null)
            }}
            value={valueObject || selectedValue || null}
            onChange={(e, value) => {
              if (value) {
                const selected = propsOptions.find(op => op.id === Number(value.id)) || value
                setSelectedValue(selected)
                field.onChange(selected.id)
                onSelect && onSelect(selected)
              } else {
                setSelectedValue(null)
                field.onChange('')
                onSelect && onSelect({})
              }
            }}
            onBlur={async () => {
              if (inputValue && !selectedValue) {
                if (propsOnBlur) {
                  const check_value = propsOptions.find(po => po[fieldProp]?.trim()?.toLowerCase() === inputValue?.trim()?.toLowerCase())
                  if (!check_value) {
                    const newRecord = await propsOnBlur(inputValue)
                    field.onChange(newRecord.id)
                    setSelectedValue(newRecord)
                  }
                  else {
                    field.onChange(check_value.id)
                    setSelectedValue(check_value)
                    onSelect && onSelect(check_value)
                  }
                }
              }
            }}
            getOptionLabel={option =>
              option ? `${option[fieldProp]}` : ''
            }
            slotProps={{
              popper: {
                placement: props.above ? 'top-start' : 'bottom',
              },
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
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {props.loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
        )
      }
      }
    />
  )
}
