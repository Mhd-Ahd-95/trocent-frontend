import React from 'react'
import { Grid } from '@mui/material'
import {
  StyledButton,
  SubmitButton,
  BasicInfo,
  ClientInfo,
  References,
  ShipperDetails,
  WizardCard,
  ExtraStop,
  ReceiverDetails,
  PickupDetails,
  InterlineCarrier,
  DeliveryDetails,
  FreightDetails,
  FreightCharges,
  TimeAndBilling,
  OrderEngine
} from '../../components'
import { useForm } from 'react-hook-form'
import { defaultOrderValue } from './DefaultOrder'
import { useSnackbar } from 'notistack'

export default function OrderForm(props) {
  const { initialValues, submit, editMode } = props
  const [showAll, setShowAll] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const engine = React.useRef(new OrderEngine(enqueueSnackbar)).current
  const calculationRef = React.useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    getValues
  } = useForm({
    defaultValues: {
      ...defaultOrderValue,
      ...initialValues
    },
    mode: 'onBlur',
  })

  const customerId = watch('customer_id')
  const shipperCity = watch('shipper_city')
  const receiverCity = watch('receiver_city')

  React.useEffect(() => {
    if (calculationRef.current && engine.customer) {
      calculationRef.current.recalculate()
    }
  }, [customerId, shipperCity, receiverCity, engine])

  const onSubmit = data => {
    console.log('Form Data:', data)
  }

  const onError = errors => {
    const firstErrorField = Object.keys(errors)[0]
    if (firstErrorField) {
      const field = document.querySelector(`[name="${firstErrorField}"]`)
      if (field) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' })
        field.focus({ preventScroll: true })
      }
    }
  }

  React.useEffect(() => {
    const timer = setTimeout(() => setShowAll(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const memoizedBasicInfo = React.useMemo(
    () => (
      <BasicInfo
        register={register}
        control={control}
        enqueueSnackbar={enqueueSnackbar}
        engine={engine}
        setValue={setValue}
      />
    ),
    [register, control, enqueueSnackbar]
  )

  const memoizedClientInfo = React.useMemo(
    () => (
      <ClientInfo
        control={control}
        setValue={setValue}
        engine={engine}
        editMode={editMode}
        enqueueSnackbar={enqueueSnackbar}
      />
    ),
    [control, setValue, engine]
  )

  const memoizedReferences = React.useMemo(
    () => (
      <References
        register={register}
        setValue={setValue}
        watch={watch}
      />
    ),
    [register, setValue, watch]
  )

  return (
    <Grid
      container
      component={'form'}
      spacing={3}
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Basic Information'>
          {memoizedBasicInfo}
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Client Information'>
          {memoizedClientInfo}
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='References'>
          {memoizedReferences}
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Shipper Details' minHeight={500}>
          <ShipperDetails
            control={control}
            setValue={setValue}
            engine={engine}
            calculationRef={calculationRef}
            enqueueSnackbar={enqueueSnackbar}
          />
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Extra Stop' minHeight={500}>
          <ExtraStop
            control={control}
            setValue={setValue}
          />
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Receiver Details' minHeight={500}>
          <ReceiverDetails
            control={control}
            setValue={setValue}
            engine={engine}
            calculationRef={calculationRef}
            enqueueSnackbar={enqueueSnackbar}
          />
        </WizardCard>
      </Grid>

      {showAll && (
        <>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <WizardCard title='Pickup Details' minHeight={500}>
              <PickupDetails
                register={register}
                control={control}
                setValue={setValue}
              />
            </WizardCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <WizardCard title='Interline Carrier' minHeight={500}>
              <InterlineCarrier
                control={control}
                setValue={setValue}
              />
            </WizardCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <WizardCard title='Delivery Details' minHeight={500}>
              <DeliveryDetails
                register={register}
                control={control}
                setValue={setValue}
              />
            </WizardCard>
          </Grid>

          <Grid size={12}>
            <WizardCard minHeight={500} title='Freight Details'>
              <FreightDetails
                register={register}
                control={control}
                setValue={setValue}
                getValues={getValues}
                engine={engine}
                calculationRef={calculationRef}
              />
            </WizardCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <WizardCard minHeight={500} title='Freight Charges'>
              <FreightCharges
                control={control}
                getValues={getValues}
                register={register}
                setValue={setValue}
                engine={engine}
                errors={errors}
                calculationRef={calculationRef}
              />
            </WizardCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <WizardCard minHeight={500} title='Waiting Time & Billing'>
              <TimeAndBilling
                control={control}
                register={register}
                watch={watch}
                errors={errors}
              />
            </WizardCard>
          </Grid>
        </>
      )}

      <Grid size={12}>
        <Grid container spacing={2} justifyContent={'flex-start'}>
          <Grid size='auto'>
            <SubmitButton
              type='submit'
              variant='contained'
              color='primary'
              size='small'
              textTransform='capitalize'
            >
              Create Order
            </SubmitButton>
          </Grid>
          <Grid size='auto'>
            <StyledButton
              variant='outlined'
              color='secondary'
              size='small'
              textTransform='capitalize'
            >
              Save As Quote
            </StyledButton>
          </Grid>
          <Grid size='auto'>
            <StyledButton
              variant='outlined'
              color='error'
              size='small'
              textTransform='capitalize'
            >
              Cancel
            </StyledButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}