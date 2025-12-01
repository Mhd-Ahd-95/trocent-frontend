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
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { unstable_batchedUpdates } from 'react-dom'

const transformLoadedData = (data) => {
  if (!data) return {}

  return {
    ...data,
    create_date: data.create_date ? new Date(data.create_date) : new Date(),
    pickup_date: data.pickup_date ? new Date(data.pickup_date) : new Date(),
    delivery_date: data.delivery_date ? new Date(data.delivery_date) : new Date(),
    pickup_at: data.pickup_at ? new Date(data.pickup_at) : null,
    delivery_at: data.delivery_at ? new Date(data.delivery_at) : null,
    billing_invoice_date: data.billing_invoice_date ? new Date(data.billing_invoice_date) : new Date(),

    pickup_in: data.pickup_in ? data.pickup_in : null,
    pickup_out: data.pickup_out ? (data.pickup_out.includes('T') ? moment(data.pickup_out).format('HH:mm') : data.pickup_out) : null,
    delivery_in: data.delivery_in ? (data.delivery_in.includes('T') ? moment(data.delivery_in).format('HH:mm') : data.delivery_in) : null,
    delivery_out: data.delivery_out ? (data.delivery_out.includes('T') ? moment(data.delivery_out).format('HH:mm') : data.delivery_out) : null,

    reference_numbers: data.reference_numbers || [],
    pickup_appointment_numbers: data.pickup_appointment_numbers || [],
    delivery_appointment_numbers: data.delivery_appointment_numbers || [],
    freights: data.freights && data.freights.length > 0 ? data.freights : defaultOrderValue.freights,
    accessorials_customer: data.accessorials_customer || [],
    vehicle_types_customer: data.customer_vehicle_types || [],
    additional_service_charges: data.additional_service_charges || [],

    quote: Boolean(data.quote),
    is_crossdock: Boolean(data.is_crossdock),
    is_extra_stop: Boolean(data.is_extra_stop),
    pickup_appointment: Boolean(data.pickup_appointment),
    delivery_appointment: Boolean(data.delivery_appointment),
    is_pickup: Boolean(data.is_pickup),
    is_delivery: Boolean(data.is_delivery),
    is_same_carrier: Boolean(data.is_same_carrier),
    is_manual_skid: Boolean(data.is_manual_skid),
    no_charges: Boolean(data.no_charges),
    manual_charges: Boolean(data.manual_charges),
    manual_fuel_surcharges: Boolean(data.manual_fuel_surcharges),
    billing_invoiced: Boolean(data.billing_invoiced)
  }
}

export default function OrderForm(props) {
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

  const transformedInitialValues = React.useMemo(() => {
    return editMode ? { ...defaultOrderValue, ...transformLoadedData(initialValues) } : { ...defaultOrderValue, ...initialValues }
  }, [initialValues, editMode])

  const methods = useForm({
    defaultValues: transformedInitialValues,
    mode: 'onBlur',
  })

  const { data: addressBooks, isLoading: addressBooksLoading, isError, error } = useAddressBooks()

  React.useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.message
      const status = error.response?.status
      const errorMessage = message ? `${message} - ${status}` : error.message
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }, [isError, error, enqueueSnackbar])







  React.useEffect(() => {
    if (!editMode || !initialValues || !addressBooks || isInitialized.current) {
      return
    }

    const setupEditMode = async () => {
      isInitialized.current = true

      if (engine.fuelSurchargePromise) {
        await engine.fuelSurchargePromise
      }

      if (initialValues.freights) {
        engine.freights = initialValues.freights
      }

      if (initialValues.is_manual_skid) {
        engine.isManualSkid = initialValues.is_manual_skid
        engine.overrideTotalPiecesSkid = initialValues.total_pieces_skid || 0
      }

      if (initialValues.manual_charges) {
        engine.isManualFreightRate = initialValues.manual_charges
        engine.override_freight_rate = initialValues.freight_rate || 0
      }

      if (initialValues.manual_fuel_surcharges) {
        engine.isManualFuelSurcharge = initialValues.manual_fuel_surcharges
        engine.override_fuel_surcharge = initialValues.freight_fuel_surcharge || 0
      }

      if (initialValues.no_charges) {
        engine.isNoCharge = initialValues.no_charges
      }

      if (initialValues.service_type) {
        engine.service_type = initialValues.service_type
      }

      if (initialValues.direct_km) {
        engine.directKM = initialValues.direct_km
      }

      if (initialValues.additional_service_charges) {
        engine.otherAccessorialsCharges = initialValues.additional_service_charges
      }

      if (initialValues.shipper_id) {
        const shipper = addressBooks.find(ab => ab.id === Number(initialValues.shipper_id))
        if (shipper) {
          shipperSelectValue.current = shipper
          engine.shipper_city = initialValues.shipper_city
          unstable_batchedUpdates(() => {
            methods.setValue('shipper_address', shipper.address)
            methods.setValue('shipper_province', shipper.province)
            methods.setValue('shipper_postal_code', shipper.postal_code)
            methods.setValue('shipper_no_waiting_time', shipper.no_waiting_time)
          })
        }
      }

      if (initialValues.receiver_id) {
        const receiver = addressBooks.find(ab => ab.id === Number(initialValues.receiver_id))
        if (receiver) {
          receiverSelectValue.current = receiver
          engine.receiver_city = receiver.city
          engine.receiverProvince = receiver.province
          unstable_batchedUpdates(() => {
            methods.setValue('receiver_address', receiver.address)
            methods.setValue('receiver_province', receiver.province)
            methods.setValue('receiver_postal_code', receiver.postal_code)
            methods.setValue('receiver_no_waiting_time', receiver.no_waiting_time)
          })
        }
      }

      requestAnimationFrame(() => {
        if (calculationRef.current) {
          calculationRef.current.recalculate()
        }
      })
    }

    setupEditMode()
  }, [editMode, initialValues, addressBooks, engine, methods])

  const onSubmit = async (data, e) => {
    e.preventDefault()
    const payload = OrderEngine.format_request(data)
    console.log(payload);
    try {
      await submit(payload)
      navigate('/orders')
    } catch (err) {
      console.error('Submit error:', err)
      enqueueSnackbar(err.message || 'Failed to submit order', { variant: 'error' })
    }
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
        enqueueSnackbar={enqueueSnackbar}
        engine={engine}
        accessorialRef={accessorialRef}
        data={addressBooks}
        isLoading={addressBooksLoading}
        calculationRef={calculationRef}
        shipperSelectValue={shipperSelectValue}
        receiverSelectValue={receiverSelectValue}
      />
    ),
    [enqueueSnackbar, engine, addressBooks, addressBooksLoading]
  )

  const memoizedClientInfo = React.useMemo(
    () => (
      <ClientInfo
        engine={engine}
        editMode={editMode}
        accessorialRef={accessorialRef}
        enqueueSnackbar={enqueueSnackbar}
      />
    ),
    [engine, editMode, enqueueSnackbar]
  )

  const memoizedReferences = React.useMemo(
    () => <References />,
    []
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
              data={addressBooks}
              isLoading={addressBooksLoading}
              selectedValue={shipperSelectValue}
              receiverSelectedValue={receiverSelectValue}
              accessorialRef={accessorialRef}
            />
          </WizardCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='Extra Stop' minHeight={500}>
            <ExtraStop accessorialRef={accessorialRef} />
          </WizardCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='Receiver Details' minHeight={500}>
            <ReceiverDetails
              engine={engine}
              calculationRef={calculationRef}
              data={addressBooks}
              isLoading={addressBooksLoading}
              selectedValue={receiverSelectValue}
              shipperSelectedValue={shipperSelectValue}
              accessorialRef={accessorialRef}
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
                  editMode={editMode}
                />
              </WizardCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <WizardCard minHeight={500} title='Waiting Time & Billing'>
                <TimeAndBilling
                  editMode={editMode}
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
                isLoading={methods.formState?.isSubmitting}
                disabled={methods.formState?.isSubmitting}
                textTransform='capitalize'
              >
                {editMode ? 'Update Order' : 'Create Order'}
              </SubmitButton>
            </Grid>
            <Grid size='auto'>
              <StyledButton
                variant='outlined'
                color='error'
                size='small'
                disabled={methods.formState?.isSubmitting}
                textTransform='capitalize'
                onClick={() => methods.reset()}
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