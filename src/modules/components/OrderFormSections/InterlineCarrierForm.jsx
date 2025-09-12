import React from 'react'
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment
} from '@mui/material'
import { TextInput } from '../'
import PropTypes from 'prop-types'
import { useTheme, styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import SearchableInput from '../CustomComponents/SearchableInput'
import { Controller } from 'react-hook-form'
import global from '../../global'

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

export function InterlineCarrierForm (props) {
  const { interline_type, setValue, label, control } = props

  const inputName = nm => `interline_carrier.${interline_type}.${nm}`

  return (
    <Grid container spacing={2} mt={2}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <SearchableInput
          name={inputName('interline')}
          control={control}
          options={global.static.interliners}
          fieldProp='company_name'
          onSelect={value => {
            setValue(inputName('email'), value?.email || '')
            setValue(inputName('contact_name'), value?.contact_person || '')
            setValue(inputName('phone_number'), value?.phone_number || '')
            setValue(inputName('address'), value?.address || '')
            setValue(inputName('suite'), value?.suite || '')
            setValue(inputName('city'), value?.city || '')
            setValue(inputName('province'), value?.province || '')
            setValue(inputName('postal_code'), value?.postal_code || '')
          }}
          rules={{ required: 'Interline is a required field' }}
          label={label ? `${label} Interline*` : 'Interline*'}
          placeholder='Type name...'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name={inputName('email')}
          render={({ field, fieldState }) => (
            <TextInput {...field} label='Email' variant='outlined' fullWidth />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name={inputName('contact_name')}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Contact Name'
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name={inputName('phone_number')}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Phone Number'
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          control={control}
          name={inputName('address')}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Address'
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name={inputName('suite')}
          render={({ field, fieldState }) => (
            <TextInput {...field} label='Suite' variant='outlined' fullWidth />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name={inputName('city')}
          render={({ field, fieldState }) => (
            <TextInput {...field} label='City' variant='outlined' fullWidth />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name={inputName('province')}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Province/State'
              variant='outlined'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Controller
          control={control}
          name={inputName('postal_code')}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label='Postal Code'
              variant='outlined'
              fullWidth
            />
          )}
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
              minRows={3}
              maxRows={3}
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
              <FormControl
                variant='outlined'
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    height: 45
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '12px'
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '12px'
                  },
                  '& .MuiInputLabel-shrink': {
                    fontSize: '12px'
                  },
                  '& .MuiInputAdornment-root': {
                    marginLeft: -1
                  }
                }}
              >
                <InputLabel htmlFor='outlined-adornment-charge'>
                  Total Charge Amount
                </InputLabel>
                <Controller
                  control={control}
                  name={inputName('charge_amount')}
                  render={({ field, fieldState }) => (
                    <OutlinedInput
                      {...field}
                      fullWidth
                      type='number'
                      id='outlined-adornment-charge'
                      endAdornment={
                        <InputAdornment position='start'>$</InputAdornment>
                      }
                      label='Password'
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Controller
                control={control}
                name={inputName('invoice')}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
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

function TabPanel (props) {
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

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

export function TabInterlineForm (props) {
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
