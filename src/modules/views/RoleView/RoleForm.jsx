import React from 'react'
import {
  FormHelperText,
  Grid,
  MenuItem,
  Typography,
  FormControl,
  Switch,
  colors,
  Box,
  CircularProgress,
  InputAdornment
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  TextInput,
  CustomFormControlLabel,
  StyledPaper,
  StyledTabs,
  AccordionComponent,
  StyledCheckBox,
  StyledButton,
  SubmitButton
} from '../../components'
import { useForm, Controller } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import global from '../../global'
import { Search } from '@mui/icons-material'
import { RoleContext } from '../../contexts'
import { useNavigate } from 'react-router-dom'

const WidgetsForm = React.memo(props => {
  const { widgets, control } = props
  const { _spacing } = global.methods
  const [widgetsFilter, setWidgetsFilter] = React.useState(widgets)

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <TextInput
          placeholder='Start typing to search...'
          variant='outlined'
          fullWidth
          onChange={e => {
            const value = e.target.value
            const filtered = widgets.filter(val =>
              val.name.toLowerCase().includes(value.toLowerCase())
            )
            setWidgetsFilter([...filtered])
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment>
                  <Search />
                </InputAdornment>
              )
            }
          }}
        />
      </Grid>
      <Grid size={12}>
        <Grid container spacing={2}>
          {widgetsFilter.map((widget, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <FormControl>
                <Controller
                  name='widgets'
                  control={control}
                  render={({ field }) => {
                    const value = widget.id
                    const checked = field.value?.includes(value) ?? false
                    const handleToggle = isChecked => {
                      if (isChecked) {
                        field.onChange([...field.value, value])
                      } else {
                        field.onChange(field.value.filter(v => v !== value))
                      }
                    }
                    return (
                      <CustomFormControlLabel
                        control={
                          <StyledCheckBox
                            checked={checked}
                            onChange={e => handleToggle(e.target.checked)}
                          />
                        }
                        label={_spacing(widget.name)}
                      />
                    )
                  }}
                />
              </FormControl>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
})

const PermissionsForm = React.memo(props => {
  const { permissions, resources, control, setValue } = props

  const { _spacing } = global.methods

  return (
    <Grid container spacing={2}>
      {resources.map(type => (
        <Grid size={12} key={type}>
          <AccordionComponent
            paddingBlock={1}
            title={_spacing(type)}
            bold={600}
            content={
              <Controller
                name='permissions'
                control={control}
                render={({ field }) => {
                  const valuesForType = permissions.map(
                    perm => `${perm}_${type}`
                  )

                  const allSelected = valuesForType.every(v =>
                    field.value.includes(v)
                  )

                  const handleSelectAll = () => {
                    if (allSelected) {
                      field.onChange(
                        field.value.filter(v => !valuesForType.includes(v))
                      )
                    } else {
                      const updated = Array.from(
                        new Set([...field.value, ...valuesForType])
                      )
                      field.onChange(updated)
                    }
                  }
                  return (
                    <Grid container spacing={1}>
                      <Grid size={12}>
                        <Typography
                          variant='caption'
                          sx={{
                            '&:hover': { textDecoration: 'underline' },
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                          color='primary'
                          fontWeight={'600'}
                          onClick={handleSelectAll}
                        >
                          {allSelected ? 'Deselect all' : 'Select all'}
                        </Typography>
                      </Grid>
                      {permissions.map(permission => {
                        const value = `${permission}_${type}`
                        return (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={value}>
                            <FormControl>
                              <Controller
                                name='permissions'
                                control={control}
                                render={({ field }) => {
                                  const checked =
                                    field.value?.includes(value) ?? false
                                  const handleToggle = isChecked => {
                                    if (isChecked) {
                                      field.onChange([...field.value, value])
                                    } else {
                                      setValue('select_all', false)
                                      field.onChange(
                                        field.value.filter(v => v !== value)
                                      )
                                    }
                                  }
                                  return (
                                    <CustomFormControlLabel
                                      control={
                                        <StyledCheckBox
                                          checked={checked}
                                          onChange={e =>
                                            handleToggle(e.target.checked)
                                          }
                                        />
                                      }
                                      label={_spacing(permission)}
                                    />
                                  )
                                }}
                              />
                            </FormControl>
                          </Grid>
                        )
                      })}
                    </Grid>
                  )
                }}
              />
            }
          />
        </Grid>
      ))}
    </Grid>
  )
})

export default function RoleForm (props) {
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const { initialValues, submit } = props
  const { permissions, resources } = global.prefix
  const { widgets, setRoles, roles, loading } = React.useContext(RoleContext)
  const [isLoading, setIsLoading] = React.useState(false)
  const navigate = useNavigate()
  console.log(initialValues);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      guard_name: 'api',
      select_all: false,
      permissions: [],
      widgets: [],
      ...initialValues
    }
  })

  console.log(watch('permissions'));

  const Title = props => (
    <Typography variant='body2' fontWeight={600}>
      {props.title}{' '}
      <span
        style={{
          fontSize: 12,
          color: theme.palette.primary.main,
          backgroundColor: colors.yellow[50],
          border: '1px solid ' + colors.yellow[300],
          paddingInline: 5,
          paddingBlock: 0.5,
          borderRadius: 4,
          marginLeft: 3
        }}
      >
        {props.numbers}
      </span>
    </Typography>
  )

  const handleChange = checked => {
    if (checked) {
      const allPermissions = resources.reduce((acc, type) => {
        permissions.forEach(permission => acc.push(`${permission}_${type}`))
        return acc
      }, [])
      setValue('permissions', allPermissions)
    } else {
      setValue('permissions', [])
    }
  }

  const onSubmit = data => {
    console.log(data)
    setIsLoading(true)
    submit(data)
      .then(res => {
        setRoles([res.data.data, ...roles])
        enqueueSnackbar('New Role has been successfully created', {
          variant: 'success'
        })
        navigate('/roles')
      })
      .catch(err =>
        enqueueSnackbar('Failed to create a new role', { variant: 'error' })
      )
      .finally(() => setIsLoading(false))
  }

  return (
    <Grid
      container
      spacing={3}
      onSubmit={handleSubmit(onSubmit)}
      component={'form'}
    >
      {loading ? (
        <Grid
          container
          component={Box}
          justifyContent={'center'}
          alignItems={'center'}
          py={20}
          width={'100%'}
        >
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Grid size={12}>
            <StyledPaper>
              <Grid container spacing={4} alignItems={'center'}>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                  <TextInput
                    label='Name*'
                    fullWidth
                    {...register('name', {
                      required: 'Name is a required field'
                    })}
                    error={!!errors?.name}
                    variant='outlined'
                    helperText={errors?.name?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                  <TextInput
                    label='Guard Name*'
                    fullWidth
                    {...register('guard_name', {
                      required: 'Guard Name is a required field'
                    })}
                    defaultValue={'api'}
                    disabled
                    error={!!errors?.guard_name}
                    variant='outlined'
                    helperText={errors?.guard_name?.message}
                    select
                  >
                    <MenuItem value='api'>Api</MenuItem>
                    <MenuItem value='web'>Web</MenuItem>
                  </TextInput>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                  <FormControl>
                    <CustomFormControlLabel
                      control={
                        <Controller
                          name='select_all'
                          control={control}
                          render={({ field }) => {
                            return (
                              <Switch
                                {...field}
                                checked={field.value || false}
                                onChange={e => {
                                  const checked = e.target.checked
                                  field.onChange(checked)
                                  handleChange(checked)
                                }}
                              />
                            )
                          }}
                        />
                      }
                      label='Select All'
                    />
                    <FormHelperText>
                      Enables/Disables all Permissions for this role
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>
          <Grid size={12}>
            <StyledTabs
              labels={[
                <Title title='Resources' numbers={72} />,
                <Title title='Widgets' numbers={widgets.length ?? 0} />
              ]}
              contents={[
                <PermissionsForm
                  setValue={setValue}
                  permissions={permissions}
                  resources={resources}
                  control={control}
                />,
                <WidgetsForm
                  setValue={setValue}
                  widgets={widgets}
                  control={control}
                />
              ]}
            />
          </Grid>
          <Grid size={12}>
            <Grid container spacing={2} justifyContent={'flex-start'}>
              <Grid size='auto'>
                <SubmitButton
                  type='submit'
                  variant='contained'
                  color='primary'
                  size='small'
                  textTransform='capitalize'
                  isLoading={isLoading}
                >
                  Create Role
                </SubmitButton>
              </Grid>
              <Grid size='auto'>
                <StyledButton
                  variant='outlined'
                  color='secondary'
                  disabled={isLoading}
                  size='small'
                  textTransform='capitalize'
                >
                  Save & Create Another
                </StyledButton>
              </Grid>
              <Grid size='auto'>
                <StyledButton
                  variant='outlined'
                  color='error'
                  size='small'
                  disabled={isLoading}
                  textTransform='capitalize'
                >
                  Cancel
                </StyledButton>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  )
}
