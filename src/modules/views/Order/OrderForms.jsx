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
import { useForm, FormProvider } from 'react-hook-form'
import { defaultOrderValue } from './DefaultOrder'
import { useSnackbar } from 'notistack'
import { useAddressBooks } from '../../hooks/useAddressBooks'

export default function OrderForm(props) {
  const { initialValues, submit, editMode } = props
  const [showAll, setShowAll] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const engine = React.useRef(new OrderEngine(enqueueSnackbar)).current
  const calculationRef = React.useRef(null)
  const accessorialRef = React.useRef(null)
  const shipperSelectValue = React.useRef(null)
  const receiverSelectValue = React.useRef(null)
  const rateSheetRef = React.useRef(null)

  const methods = useForm({
    defaultValues: {
      ...defaultOrderValue,
      ...initialValues
    },
    mode: 'onBlur',
  })

  // const customerId = methods.watch('customer_id')
  // const shipperCity = methods.watch('shipper_city')
  // const receiverCity = methods.watch('receiver_city')

  // React.useEffect(() => {
  //   if (calculationRef.current && engine.customer) {
  //     calculationRef.current.recalculate()
  //   }
  // }, [customerId, shipperCity, receiverCity, engine])

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

  const { data, isLoading, isError, error } = useAddressBooks()

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      const errorMessage = message ? `${message} - ${status}` : error.message;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [isError, error])

  React.useEffect(() => {
    const timer = setTimeout(() => setShowAll(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const memoizedBasicInfo = React.useMemo(
    () => (
      <BasicInfo
        enqueueSnackbar={enqueueSnackbar}
        engine={engine}
        accessorialRef={accessorialRef}
        data={data}
        isLoading={isLoading}
        calculationRef={calculationRef}
        shipperSelectValue={shipperSelectValue}
        receiverSelectValue={receiverSelectValue}
      />
    ),
    [methods.register, methods.control, enqueueSnackbar, data]
  )

  const memoizedClientInfo = React.useMemo(
    () => (
      <ClientInfo
        engine={engine}
        editMode={editMode}
        rateSheetRef={rateSheetRef}
        enqueueSnackbar={enqueueSnackbar}
      />
    ),
    [methods.control, methods.setValue, engine]
  )

  const memoizedReferences = React.useMemo(
    () => (
      <References />
    ),
    [methods.register, methods.setValue, methods.watch]
  )

  return (
    <FormProvider {...methods}>
      <Grid
        container
        component={'form'}
        spacing={3}
        onSubmit={methods.handleSubmit(onSubmit, onError)}
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
              engine={engine}
              calculationRef={calculationRef}
              data={data}
              isLoading={isLoading}
              selectedValue={shipperSelectValue}
              receiverSelectedValue={receiverSelectValue}
              rateSheetRef={rateSheetRef}
            />
          </WizardCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='Extra Stop' minHeight={500}>
            <ExtraStop
              accessorialRef={accessorialRef}
            />
          </WizardCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='Receiver Details' minHeight={500}>
            <ReceiverDetails
              engine={engine}
              calculationRef={calculationRef}
              data={data}
              isLoading={isLoading}
              selectedValue={receiverSelectValue}
              shipperSelectedValue={shipperSelectValue}
              rateSheetRef={rateSheetRef}
            />
          </WizardCard>
        </Grid>

        {showAll && (
          <>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <WizardCard title='Pickup Details' minHeight={500}>
                <PickupDetails />
              </WizardCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <WizardCard title='Interline Carrier' minHeight={500}>
                <InterlineCarrier />
              </WizardCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <WizardCard title='Delivery Details' minHeight={500}>
                <DeliveryDetails />
              </WizardCard>
            </Grid>

            <Grid size={12}>
              <WizardCard minHeight={500} title='Freight Details'>
                <FreightDetails
                  engine={engine}
                  calculationRef={calculationRef}
                  accessorialRef={accessorialRef}
                />
              </WizardCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <WizardCard minHeight={500} title='Freight Charges'>
                <FreightCharges
                  engine={engine}
                  calculationRef={calculationRef}
                  accessorialRef={accessorialRef}
                  rateSheetRef={rateSheetRef}
                />
              </WizardCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <WizardCard minHeight={500} title='Waiting Time & Billing'>
                <TimeAndBilling />
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
    </FormProvider>
  )
}