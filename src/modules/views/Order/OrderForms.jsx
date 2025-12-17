import React from 'react'
import { colors, Grid } from '@mui/material'
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
  OrderEngine,
  Consignment,
  HeaderForm,
} from '../../components'
import { useForm, FormProvider } from 'react-hook-form'
import { defaultOrderValue } from './DefaultOrder'
import { useSnackbar } from 'notistack'
import { useAddressBooks } from '../../hooks/useAddressBooks'
import { useNavigate } from 'react-router-dom'

function OrderForm(props) {

  const navigate = useNavigate()
  const { initialValues, submit, editMode } = props
  const [showAll, setShowAll] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const engine = React.useRef(new OrderEngine(enqueueSnackbar, initialValues.create_date)).current
  const calculationRef = React.useRef(null)
  const accessorialRef = React.useRef(null)
  const shipperSelectValue = React.useRef(null)
  const receiverSelectValue = React.useRef(null)
  const isInitialized = React.useRef(false)
  const crossdockReceiverRef = React.useRef()
  const crossdockShipperRef = React.useRef()
  const interlinerRef = React.useRef()
  const customerRef = React.useRef(null)
  const [orderStatus, setOrderStatus] = React.useState(initialValues?.order_status === 'Canceled' ? true : false)

  const transformedInitialValues = React.useMemo(() => {
    return editMode ? { ...defaultOrderValue, ...OrderEngine.transformLoadedData(initialValues, defaultOrderValue) } : { ...defaultOrderValue, ...initialValues }
  }, [initialValues, editMode])

  const methods = useForm({
    defaultValues: transformedInitialValues,
    mode: 'onBlur',
  })

  const setupEditMode = async () => {

    isInitialized.current = true

    if (engine.fuelSurchargePromise) {
      await engine.fuelSurchargePromise
    }
    engine.freights = initialValues.freights
    engine.isManualSkid = initialValues.is_manual_skid || false
    engine.overrideTotalPiecesSkid = initialValues.is_manual_skid ? initialValues.total_pieces_skid : 0
    engine.isManualFreightRate = initialValues.manual_charges
    engine.override_freight_rate = initialValues.manual_charges ? initialValues.freight_rate || 0 : 0
    engine.isManualFuelSurcharge = initialValues.manual_fuel_surcharges
    engine.override_fuel_surcharge = initialValues.manual_fuel_surcharges ? initialValues.freight_fuel_surcharge || 0 : 0
    engine.isNoCharge = initialValues.no_charges || false
    engine.service_type = initialValues.service_type
    engine.directKM = initialValues.direct_km
    engine.otherAccessorialsCharges = initialValues.additional_service_charges
    engine.shipper_city = initialValues.shipper_city
    engine.receiver_city = initialValues.receiver_city
    engine.receiverProvince = initialValues.receiver_province

    shipperSelectValue.current = {
      id: initialValues.shipper_id,
      city: initialValues.shipper_city,
      address: initialValues.shipper_address,
      province: initialValues.shipper_province,
      postal_code: initialValues.shipper_postal_code,
      no_waiting_time: initialValues.shipper_no_waiting_time,
      email: initialValues.shipper_email,
      contact_name: initialValues.shipper_contact_name,
      suite: initialValues.shipper_suite,
      phone_number: initialValues.shipper_phone_number,
      special_instructions: initialValues.shipper_special_instructions
    }

    receiverSelectValue.current = {
      id: initialValues.receiver_id,
      city: initialValues.receiver_city,
      address: initialValues.receiver_address,
      province: initialValues.receiver_province,
      postal_code: initialValues.receiver_postal_code,
      no_waiting_time: initialValues.receiver_no_waiting_time,
      email: initialValues.receiver_email,
      contact_name: initialValues.receiver_contact_name,
      suite: initialValues.receiver_suite,
      phone_number: initialValues.receiver_phone_number,
      special_instructions: initialValues.receiver_special_instructions
    }

    requestAnimationFrame(() => {
      if (calculationRef.current) {
        calculationRef.current.recalculate()
      }
    })
  }

  React.useEffect(() => {
    if (!editMode || !initialValues || isInitialized.current) {
      return
    }
    setupEditMode()
  }, [editMode, initialValues, engine, methods])

  React.useEffect(() => {
    const timer = setTimeout(() => setShowAll(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleReset = React.useCallback(() => {

    if (editMode) {
      const resetValues = OrderEngine.transformLoadedData(initialValues)
      methods.reset({ ...defaultOrderValue, ...resetValues })
      setTimeout(async () => {
        await setupEditMode()
        requestAnimationFrame(() => {
          if (customerRef.current) customerRef.current.resetCustomer()
          if (crossdockReceiverRef.current) crossdockReceiverRef.current.resetReceiver()
          if (crossdockShipperRef.current) crossdockShipperRef.current.resetShipper()
          if (interlinerRef.current) interlinerRef.current.resetInterliner()
          if (accessorialRef.current) accessorialRef.current.loadRateSheet(); accessorialRef.current.resetFreightCharges(); accessorialRef.current.resetStates()
          if (calculationRef.current) calculationRef.current.resetState(); calculationRef.current.recalculate()
        })
      }, 100)

    } else {
      methods.reset(defaultOrderValue)

      engine.freights = defaultOrderValue.freights
      engine.isManualSkid = false
      engine.overrideTotalPiecesSkid = 0
      engine.isManualFreightRate = false
      engine.override_freight_rate = 0
      engine.isManualFuelSurcharge = false
      engine.override_fuel_surcharge = 0
      engine.isNoCharge = false
      engine.service_type = 'Regular'
      engine.directKM = 0
      engine.otherAccessorialsCharges = []
      engine.shipper_city = ''
      engine.receiver_city = ''
      engine.receiverProvince = ''
      engine.customerRateSheets = []
      engine.accessorialsCharge = []
      engine.customer_vehicle_types = []
      engine.customer = null

      shipperSelectValue.current = null
      receiverSelectValue.current = null

      requestAnimationFrame(() => {
        if (calculationRef.current) {
          calculationRef.current.recalculate()
        }
      })
    }
  }, [editMode, initialValues, methods, engine, calculationRef, accessorialRef])

  const onSubmit = async (data, e) => {
    e.preventDefault()
    let payload = OrderEngine.format_request(data)
    const action = e?.nativeEvent?.submitter?.id;
    if (editMode) {
      const touched = methods.formState.touchedFields
      const orderUpdates = OrderEngine.getOrderUpdates(touched, initialValues, data)
      payload['order_updates'] = orderUpdates
    }
    if (payload['order_status'] === 'Billed') {
      enqueueSnackbar('Order is Billed unable to update', { variant: 'warning' })
      return
    }
    if (payload['order_status'] === 'Pending') {
      payload['order_status'] = 'Entered'
    }
    try {
      await submit(payload)
      if (action === 'save-order-action' && !editMode) {
        handleReset()
      }
      else {
        navigate('/orders')
      }
    } catch (err) {
      console.error('Submit error:', err)
      enqueueSnackbar(err.message || 'Failed to submit order', { variant: 'error' })
    }
  }

  const onError = errors => {
    let firstErrorField = Object.keys(errors)[0]
    if (firstErrorField) {
      if (firstErrorField === 'freights') {
        for (let f of errors['freights']) {
          if (f) {
            firstErrorField = f?.type?.ref?.name
            break
          }
        }
      }
      const field = document.querySelector(`[name="${firstErrorField}"]`)
      if (field) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' })
        field.focus({ preventScroll: true })
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <Grid
        container
        component={'form'}
        spacing={3}
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        position={'relative'}
      >
        {editMode &&
          <Grid size={12}>
            <HeaderForm
              order_id={props.order_id}
              orderStatus={orderStatus}
              setOrderStatus={setOrderStatus}
            />
          </Grid>
        }
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='Basic Information'>
            <BasicInfo
              enqueueSnackbar={enqueueSnackbar}
              engine={engine}
              accessorialRef={accessorialRef}
              editMode={editMode}
              calculationRef={calculationRef}
              shipperSelectValue={shipperSelectValue}
              receiverSelectValue={receiverSelectValue}
              crossdockReceiverRef={crossdockReceiverRef}
              crossdockShipperRef={crossdockShipperRef}
            />
          </WizardCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='Client Information'>
            <ClientInfo
              engine={engine}
              editMode={editMode}
              accessorialRef={accessorialRef}
              customerRef={customerRef}
              enqueueSnackbar={enqueueSnackbar}
            />
          </WizardCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='References'>
            <References />
          </WizardCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='Shipper Details' minHeight={500}>
            <ShipperDetails
              engine={engine}
              calculationRef={calculationRef}
              enqueueSnackbar={enqueueSnackbar}
              selectedValue={shipperSelectValue}
              receiverSelectedValue={receiverSelectValue}
              accessorialRef={accessorialRef}
              crossdockShipperRef={crossdockShipperRef}
            />
          </WizardCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='Extra Stop' minHeight={500}>
            <ExtraStop
              accessorialRef={accessorialRef}
              enqueueSnackbar={enqueueSnackbar}
            />
          </WizardCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='Receiver Details' minHeight={500}>
            <ReceiverDetails
              engine={engine}
              editMode={editMode}
              calculationRef={calculationRef}
              selectedValue={receiverSelectValue}
              shipperSelectedValue={shipperSelectValue}
              enqueueSnackbar={enqueueSnackbar}
              accessorialRef={accessorialRef}
              crossdockReceiverRef={crossdockReceiverRef}
            />
          </WizardCard>
        </Grid>

        {showAll && (
          <>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <WizardCard title='Pickup Details' minHeight={500}>
                <PickupDetails
                  editMode={editMode}
                />
              </WizardCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <WizardCard title='Interline Carrier' minHeight={500}>
                <InterlineCarrier
                  editMode={editMode}
                  interlinerRef={interlinerRef}
                />
              </WizardCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <WizardCard title='Delivery Details' minHeight={500}>
                <DeliveryDetails
                  editMode={editMode}
                />
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
                  editMode={editMode}
                />
              </WizardCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <WizardCard minHeight={500} title='Waiting Time & Billing'>
                <TimeAndBilling
                  editMode={editMode}
                  accessorialRef={accessorialRef}
                />
              </WizardCard>
            </Grid>
            {editMode &&
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <WizardCard minHeight={200} title='Straight Bill of Lading Consignment'>
                  <Consignment
                    order_id={props.order_id}
                  />
                </WizardCard>
              </Grid>
            }
          </>
        )}

        <Grid size={12}>
          <Grid container spacing={2} justifyContent={'flex-start'}>
            <Grid size='auto'>
              <SubmitButton
                type='submit'
                variant='contained'
                color='primary'
                id='save-order-action'
                size='small'
                isLoading={methods.formState?.isSubmitting}
                disabled={methods.formState?.isSubmitting || orderStatus}
                textTransform='capitalize'
              >
                {editMode ? 'Update Order' : 'Create Order'}
              </SubmitButton>
            </Grid>
            {!editMode && (
              <Grid size='auto'>
                <SubmitButton
                  type='submit'
                  variant='outlined'
                  color='secondary'
                  size='small'
                  textTransform='capitalize'
                  id='submit-order-action'
                  isLoading={methods.formState?.isSubmitting}
                >
                  Save & Exit
                </SubmitButton>
              </Grid>
            )}
            <Grid size='auto'>
              <StyledButton
                variant='outlined'
                color='error'
                size='small'
                disabled={methods.formState?.isSubmitting}
                textTransform='capitalize'
                onClick={handleReset}
              >
                Reset
              </StyledButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

export default OrderForm