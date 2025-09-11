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
  ExtraShop,
  ReceiverDetails,
  PickupDetails,
  InterlineCarrier,
  DeliveryDetails,
  FreightDetails,
  FreightCharges,
  TimeAndBilling
} from '../../components'
import { useForm } from 'react-hook-form'
import { defaultOrderValue } from './DefaultOrder'

export default function OrderForm (props) {
  const { initialValues } = props

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      ...defaultOrderValue,
      ...initialValues
    }
  })

  const onSubmit = data => {
    console.log('Form Data:', data)
  }

  return (
    <Grid
      container
      component={'form'}
      spacing={3}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Basic Information' minHeight={500}>
          <BasicInfo
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
            watch={watch}
          />
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Client Information' minHeight={500}>
          <ClientInfo control={control} setValue={setValue} />
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='References' minHeight={500}>
          <References register={register} setValue={setValue} watch={watch} />
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Shipper Details' minHeight={500}>
          <ShipperDetails register={register} errors={errors} />
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Extra Shop' minHeight={500}>
          <ExtraShop
            watch={watch}
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
          />
        </WizardCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Receiver Details' minHeight={500}>
          <ReceiverDetails register={register} errors={errors} />
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Pickup Details' minHeight={500}>
          <PickupDetails
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Interline Carrier' minHeight={500}>
          <InterlineCarrier
            watch={watch}
            register={register}
            errors={errors}
            control={control}
          />
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <WizardCard title='Delivery Details' minHeight={500}>
          <DeliveryDetails
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        </WizardCard>
      </Grid>

      <Grid size={12}>
        <WizardCard minHeight={500} title='Freight Details'>
          <FreightDetails register={register} control={control} watch={watch} />
        </WizardCard>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <WizardCard minHeight={500} title='Freight & Charges'>
          <FreightCharges
            control={control}
            register={register}
            watch={watch}
            errors={errors}
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
