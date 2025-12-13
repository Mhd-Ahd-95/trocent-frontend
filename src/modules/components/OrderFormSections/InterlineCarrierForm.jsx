import React from 'react'
import {
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Autocomplete
} from '@mui/material'
import { TextInput } from '../'
import PropTypes from 'prop-types'
import { useTheme, styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { Controller } from 'react-hook-form'
import { AttachMoney } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useInterlinerSearch } from '../../hooks/useInterliners'
import { unstable_batchedUpdates } from 'react-dom'

const Appbar = styled(AppBar)(({ theme }) => ({
  borderRadius: 10,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  color: theme.palette.grey[600],
  backgroundColor: '#fff',
  borderColor: 0,
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  //   boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
  boxShadow: 'none'
}))

const Fieldset = styled('fieldset')(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: 4,
  paddingBlock: theme.spacing(3),
  '& .title': {
    fontSize: 13,
    fontWeight: 600
    // paddingInline: 5
  }
}))

export function InterlineCarrierForm(props) {

  const { interline_type, label, control, editMode, getValues } = props
  const { enqueueSnackbar } = useSnackbar()
  
  const inputName = nm => interline_type ? `interliner_${interline_type}_${nm}` : `interliner_${nm}`
  const [search, setSearch] = React.useState('')
  const [inputValue, setInputValue] = React.useState('')
  const [selectedInterliner, setSelectedInterliner] = React.useState(null)

  const { data, isLoading: isSearching, isFetching, isError, error } = useInterlinerSearch(search)

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message
      const status = error.response?.status
      const errorMessage = message ? `${message} - ${status}` : error.message
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }, [isError, error, enqueueSnackbar])

   const handleInterliner = React.useCallback(() => {
      const interlinerId = getValues(inputName('id'))
      if (editMode && interlinerId) {
        const interliner = getValues(interline_type ? `interliner_${interline_type}` : 'interliner')
        if (interliner) {
          setSelectedInterliner(interliner)
        }
      }
    }, [getValues])

    React.useEffect(() => {
      if (editMode){
        handleInterliner()
      }
    }, [editMode, handleInterliner])

  const isLoading = isSearching || isFetching

  React.useImperativeHandle(props.interlinerRef, () => ({
      resetInterliner: handleInterliner
    }), [handleInterliner])

  return (
    <Grid container spacing={2} mt={2}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          name={inputName('id')}
          control={control}
          rules={{ required: 'Interliner is a required field' }}
          render={({ field, fieldState }) => {
            return (
              <Autocomplete
                options={data || []}
                loading={isLoading}
                value={selectedInterliner}
                inputValue={inputValue || ''}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'input') {
                    setInputValue(newInputValue)
                    setSearch(newInputValue)
                  } else if (reason === 'reset') {
                    setInputValue(newInputValue)
                  }
                }}
                onChange={(_, value) => {
                  unstable_batchedUpdates(() => {
                    field.onChange(value?.id || '')
                    setSelectedInterliner(value)
                    if (value) {
                      setInputValue(`${value.name}`)
                    }
                  })
                }}
                getOptionLabel={option => option ? `${option.name}` : ''}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                filterOptions={(x) => x}
                noOptionsText={
                  search && search.length < 2
                    ? 'Type...'
                    : 'No Interliners found'
                }
                renderInput={params => (
                  <TextInput
                    {...params}
                    label={label ? `${label}*` : 'Interliner*'}
                    fullWidth
                    name={inputName('id')}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(isLoading || isFetching) ? (
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
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Email'
          disabled
          variant='outlined'
          fullWidth
          value={selectedInterliner?.email || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Contact Name'
          disabled
          variant='outlined'
          fullWidth
          value={selectedInterliner?.contact_name || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Phone Number'
          disabled
          variant='outlined'
          fullWidth
          value={selectedInterliner?.phone || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <TextInput
          label='Address'
          disabled
          variant='outlined'
          fullWidth
          value={selectedInterliner?.address || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Suite'
          disabled
          variant='outlined'
          fullWidth
          value={selectedInterliner?.suite || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='City'
          disabled
          variant='outlined'
          fullWidth
          value={selectedInterliner?.city || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Province/State'
          disabled
          variant='outlined'
          fullWidth
          value={selectedInterliner?.province || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label='Postal Code'
          disabled
          variant='outlined'
          fullWidth
          value={selectedInterliner?.postal_code || ''}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          control={control}
          name={inputName('special_instructions')}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Special Instructions'
              variant='outlined'
              multiline
              value={field.value || ''}
              minRows={2}
              maxRows={2}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '13px'
                }
              }}
            />
          )}
        />
      </Grid>
      <Grid size={12}>
        <Fieldset>
          <legend className='title'>
            {label ? label + ' Charges' : 'Charges'}
          </legend>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                name={inputName('charge_amount')}
                control={control}
                render={({ field }) => (
                  <TextInput
                    label='Total Charge Amount'
                    fullWidth
                    type='number'
                    variant='outlined'
                    inputProps={{ step: 'any' }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    slotProps={{
                      input: {
                        endAdornment:
                          <InputAdornment position='end'>
                            <AttachMoney />
                          </InputAdornment>

                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                control={control}
                name={inputName('invoice')}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    value={field.value || ''}
                    label='Reference/Invoice #'
                    variant='outlined'
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </Fieldset>
      </Grid>
    </Grid>
  )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      key={index}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {/* <Typography>{children}</Typography> */}
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

export function TabInterlineForm(props) {
  const { labels, contents } = props
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Grid
      container
      mt={2}
      sx={{ border: '1px solid ' + theme.palette.grey[200], borderRadius: 2 }}
    >
      <Grid size={12}>
        <Box
          sx={{
            bgcolor: 'transparent',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Appbar position='static'>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor='inherits'
              // centered
              textColor='primary'
              variant='scrollable'
              aria-label='full width tabs example'
            >
              {labels.map((label, index) => (
                <Tab
                  label={label}
                  key={index}
                  {...a11yProps(index)}
                  sx={{
                    fontSize: 14,
                    textTransform: 'capitalize',
                    fontWeight: 600
                  }}
                />
              ))}
            </Tabs>
          </Appbar>
        </Box>
      </Grid>
      <Grid size={12}>
        {contents.map((content, index) => (
          <TabPanel
            value={value}
            index={index}
            key={index}
            dir={theme.direction}
          >
            {content}
          </TabPanel>
        ))}
      </Grid>
    </Grid>
  )
}
