export const defaultOrderValue = {
  basic_info: {
    username: '',
    order_number: '',
    create_date: null,
    terminal: '',
    quote: false,
    is_crossdock: false,
    order_entity: 'Order Entry',
    order_status: 'Entered',
    internal_note: ''
  },
  client_info: {
    customer_id: '',
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
    reference_numbers: [],
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
    delivery: false,
    same_carrier_for_both: false
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
        not_stack: false,
        is_converted: false,
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
