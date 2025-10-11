import React from 'react'
import { Grid, MenuItem } from '@mui/material'
import { StyledButton, SubmitButton, TextInput } from '../../components'
import { useForm, Controller } from 'react-hook-form'
import { RoleContext } from '../../contexts'

export default function UserForm(props) {
  const { initialValues, submit, editMode, setOpen } = props
  const { roles } = React.useContext(RoleContext)
  const [loading, setLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      type: '',
      role: '',
      password: '',
      ...initialValues
    }
  })

  const onSubmit = async (data, e) => {
    setLoading(true)
    const action = e?.nativeEvent?.submitter?.id
    if (editMode && data['password'].length === 0) {
      delete data['password']
    }
    try {
      await submit(data);
      if (action === 'apply-user-action') {
        setOpen(false)
      }
      else {
        reset()
      }
    } catch (error) {
      // console.log(error);
      //
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextInput
              label='Name*'
              fullWidth
              type='text'
              variant='outlined'
              {...register('name', { required: 'Name is a required field' })}
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />
          </Grid>

          <Grid size={12}>
            <TextInput
              label='Username*'
              fullWidth
              type='text'
              variant='outlined'
              {...register('username', {
                required: 'Username is a required field'
              })}
              error={!!errors?.username}
              helperText={errors?.username?.message}
            />
          </Grid>

          <Grid size={12}>
            <TextInput
              label='Email*'
              fullWidth
              variant='outlined'
              type='email'
              {...register('email', {
                required: 'Email is a required field',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
          </Grid>
          {watch('type') !== 'driver' &&
            <Grid size={12}>
              <Controller
                name='type'
                control={control}
                rules={{ required: 'Type is a required field' }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label='Type*'
                    select
                    fullWidth
                    variant='outlined'
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                    <MenuItem value='customer'>Customer</MenuItem>
                    <MenuItem value='staff'>Staff</MenuItem>
                  </TextInput>
                )}
              />
            </Grid>
          }
          {watch('type') !== 'driver' &&
            <Grid size={12}>
              <Controller
                name='role'
                control={control}
                rules={{ required: 'Role is a required field' }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label='Role*'
                    select
                    fullWidth
                    variant='outlined'
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    {roles?.map((role, index) => (
                      <MenuItem key={index} value={role.name}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </TextInput>
                )}
              />
            </Grid>
          }

          <Grid size={12}>
            <TextInput
              label='Password*'
              fullWidth
              variant='outlined'
              type='password'
              {...register('password', {
                required: !editMode ? 'Password is required' : false,
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                },
                validate: value =>
                  editMode && value !== '' && value.length < 6
                    ? 'Password must be at least 6 characters'
                    : true
              })}
              error={!!errors?.password}
              helperText={errors?.password?.message}
            />
          </Grid>
        </Grid>
      </div>

      <div
        style={{
          flexShrink: 0,
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          padding: '16px 24px',
          zIndex: 1
        }}
      >
        <Grid container spacing={2} justifyContent={'flex-start'}>
          <Grid size='auto'>
            <SubmitButton
              id='apply-user-action'
              type='submit'
              variant='contained'
              color='primary'
              size='small'
              textTransform='capitalize'
              isLoading={loading}
            >
              {!editMode ? 'Create User' : 'Save Changes'}
            </SubmitButton>
          </Grid>

          {!editMode && (
            <Grid size='auto'>
              <SubmitButton
                id='save-user-action'
                type='submit'
                variant='outlined'
                color='secondary'
                size='small'
                textTransform='capitalize'
                isLoading={loading}
              >
                Save & Create Another
              </SubmitButton>
            </Grid>
          )}

          <Grid size='auto'>
            <StyledButton
              variant='outlined'
              color='error'
              size='small'
              disabled={loading}
              textTransform='capitalize'
              onClick={() => reset()}
            >
              Reset
            </StyledButton>
          </Grid>
        </Grid>
      </div>
    </form>
  )
}
