import React from 'react'
import { Grid } from '@mui/material'
import { StyledButton, SubmitButton, TextInput } from '../../components'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'

export default function VehicleTypeForm(props) {
  const { initialValues, submit, editMode, setOpen, setData, data } = props
  const [loading, setLoading] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      rate: '',
      ...initialValues
    }
  })

  const onSubmit = (vtype, e) => {
    setLoading(true)
    const action = e?.nativeEvent?.submitter?.id
    vtype['rate'] = Number(vtype['rate'])
    submit(vtype)
      .then(res => {
        const result = res.data.data
        if (!editMode) {
          setData([result, ...data])
          enqueueSnackbar('New vehicle type has been created successfully', {
            variant: 'success'
          })
          action === 'save-type-action' ? reset() : setOpen(false)
        } else {
          const updateData = [...data]
          const index = updateData.findIndex(vt => vt.id === result.id)
          updateData[index] = result
          setData([...updateData])
          enqueueSnackbar('Vehicle Type has been updated successfully', {
            variant: 'success'
          })
          setOpen(false)
        }
      })
      .catch(error => {
        const message = error.response?.data.message
        const status = error.response?.status
        const errorMessage = message ? message + ' - ' + status : error.message
        enqueueSnackbar(errorMessage, { variant: 'error' })
      })
      .finally(() => setLoading(false))
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
              label='Rate*'
              fullWidth
              type='number'
              variant='outlined'
              inputProps={{ step: "any" }}
              {...register('rate', {
                required: 'Rate is a required field'
              })}
              error={!!errors?.rate}
              helperText={errors?.rate?.message}
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
              id='apply-type-action'
              type='submit'
              variant='contained'
              color='primary'
              size='small'
              textTransform='capitalize'
              isLoading={loading}
            >
              {!editMode ? 'Create Vehicle Type' : 'Save Changes'}
            </SubmitButton>
          </Grid>

          {!editMode && (
            <Grid size='auto'>
              <SubmitButton
                id='save-type-action'
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
