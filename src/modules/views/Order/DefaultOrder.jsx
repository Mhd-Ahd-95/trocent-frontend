import { styled } from '@mui/material/styles'
import { TextField, FormControlLabel } from '@mui/material'

export const defaultOrderValue = {
  basic_info: {
    username: '',
    order_number: '',
    create_date: null,
    terminal: '',
    quote: false,
    is_crossdock: false,
    order_entity: '',
    order_status: '',
    internal_note: ''
  },
  client_info: {
    customer: '',
    name: '',
    email: '',
    address: '',
    suite: '',
    city: '',
    province: '',
    postal_code: ''
  },
  references: {
    reference_number: '',
    caller: ''
  },
  shipper_details: {
    shipper: '',
    email: '',
    contact_name: '',
    phone_number: '',
    address: '',
    suite: '',
    city: '',
    province: '',
    postal_code: '',
    special_instructions: ''
  },
  extra_shop: {
    extra_shop: false,
    crossdock: '',
    email: '',
    contact_name: '',
    phone_number: '',
    address: '',
    suite: '',
    city: '',
    province: '',
    postal_code: ''
  },
  receiver_details: {
    receiver: '',
    email: '',
    contact_name: '',
    phone_number: '',
    address: '',
    suite: '',
    city: '',
    province: '',
    postal_code: '',
    special_instructions: ''
  },
  pickup_details: {
    pickup_date: null,
    time_from: null,
    time_to: null,
    driver_assigned: '',
    pickup_terminal: '',
    appointment: false
  },
  interline_carrier: {
    pickup: false,
    delivery: false
  },
  freight_details: {
    service_type: '',
    freights: [
      {
        type: 'Skid',
        description: 'FAK',
        pieces: 1,
        weight: '',
        unit: 'lbs',
        length: '',
        width: '',
        height: '',
        dim_unit: 'IN',
        not_stack: false
      }
    ]
  },
  freight_charges: {
    no_charges: false,
    manual_charges: false,
    manual_fuel_surcharges: false,
    freight_rate: '',
    freight_fuel_surcharge: '',
    additional_service_charges: []
  }
}

export const TextInput = styled(TextField)(({ theme, size }) => ({
  '& .MuiInputBase-root': {
    height: size === 'small' ? 40 : 45
  },
  '& .MuiOutlinedInput-input': {
    fontSize: size === 'small' ? '13px' : '14px'
  },
  '& .MuiInputLabel-root': {
    fontSize: size === 'small' ? '12px' : '13px',
    marginTop: size === 'small' ? 5 : 0
  },
  '& .MuiInputLabel-shrink': {
    fontSize: size === 'small' ? '13px' : '14px',
    marginTop: size === 'small' ? 2 : 0
  }
}))

export const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '13px',
    fontWeight: 500
  }
}))

export const customerData = [
  {
    id: 1,
    account_number: '0000',
    name: 'IAM INC',
    address: '1250 RENE-LEVESQUE O.',
    suite: '2200',
    city: 'MONTREAL',
    province: 'QC',
    postal_code: 'H3B 4W8',
    account_contact: 'IAM',
    phone_number: '(514) 447-5114',
    email: 'mhd@gmail.com',
    accessorials: [
      {
        accessorial_name: 'Crossdock',
        amount: 10,
        is_included: false
      },
      {
        accessorial_name: 'Extra Shop',
        amount: 60,
        is_included: false
      },
      {
        accessorial_name: 'Failed Delivery',
        amount: 100,
        is_included: false
      },
      {
        accessorial_name: 'Inside Delivery',
        amount: 35,
        is_included: false
      },
      {
        accessorial_name: 'Rush Charge (less than 4 hours to p/u or delivery)',
        amount: 10,
        is_included: false
      },
      {
        accessorial_name: 'Rush Service',
        amount: 30,
        is_included: false
      },
      {
        accessorial_name: 'Tailgate',
        amount: 35,
        is_included: false
      },
      {
        accessorial_name: 'Waiting Time (1-12 skids)',
        amount: 1.5,
        is_included: false
      }
    ]
  }
]
