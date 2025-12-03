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
import { unstable_batchedUpdates } from 'react-dom'

const setEngineProps = (engine, initialValues) => {
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
}

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
  const customerRef = React.useRef(null)

  const transformedInitialValues = React.useMemo(() => {
    return editMode ? { ...defaultOrderValue, ...OrderEngine.transformLoadedData(initialValues) } : { ...defaultOrderValue, ...initialValues }
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

  React.useEffect(() => {
    if (!editMode || !initialValues || !addressBooks || isInitialized.current) {
      return
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

  const handleReset = React.useCallback(() => {

    if (editMode) {
      const resetValues = OrderEngine.transformLoadedData(initialValues)
      methods.reset({ ...defaultOrderValue, ...resetValues })
      setTimeout(async () => {
        await setupEditMode()
        requestAnimationFrame(() => {
          if (customerRef.current) customerRef.current.resetCustomer()
          if (accessorialRef.current) accessorialRef.current.loadRateSheet(); accessorialRef.current.resetFreightCharges()
          if (calculationRef.current) calculationRef.current.recalculate()
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
  }, [editMode, initialValues, methods, engine, addressBooks, calculationRef, accessorialRef])

  console.log(engine.customer);


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
            />
          </Grid>
        }
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <WizardCard title='Basic Information'>
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
                <PickupDetails
                  editMode={editMode}
                />
              </WizardCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <WizardCard title='Interline Carrier' minHeight={500}>
                <InterlineCarrier />
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
                id='submit-order-action'
                size='small'
                isLoading={methods.formState?.isSubmitting}
                disabled={methods.formState?.isSubmitting}
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
                  id='save-order-action'
                  isLoading={methods.formState?.isSubmitting}
                >
                  Save & Exist
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