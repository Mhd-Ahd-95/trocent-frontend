const globalVariables = {
  auth: {},
  apis: {},
  methods: {
    formatNumber: nb => (isNaN(nb) ? Number(0).toFixed : Number(nb).toFixed(2)),
    formatAccessorial: (n, a) =>
      `${n} @ $${globalVariables.methods.formatNumber(a)}`,
    capitalize: s => (s && s[0].toUpperCase() + s.slice(1).toLowerCase()) || '',
    capitalizeMany: s =>
      s && s.split(' ').length > 1
        ? s
            .split(' ')
            .map(ss => globalVariables.methods.capitalize(ss))
            .join(' ')
        : globalVariables.methods.capitalize(s),
    capSpacing: s => s.replace(/([A-Z])/g, ' $1').trim(),
    _spacing: s =>
      s
        ? s
            .split('_')
            .map(ss => ss[0].toUpperCase() + ss.slice(1).toLowerCase())
            .join(' ')
        : '',
    formatDate: d => (d && d.toISOString ? d.toISOString().split('T')[0] : ''),
    avatar: org => {
      const lst = org.split(' ')
      if (lst.length === 1) {
        return lst[0].length === 2
          ? lst[0][0] + lst[0][1]
          : lst[0][0] + lst[0][1] + lst[0][2]
      } else if (lst.length === 2) {
        return lst[0][0] + lst[1][0]
      } else {
        return lst[0][0] + lst[1][0] + lst[2][0]
      }
    }
  },
  static: {
    customers: [
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
            accessorial_name:
              'Rush Charge (less than 4 hours to p/u or delivery)',
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
    ],
    address_book: [
      {
        company_location: 'MESSAGERS',
        contact_name: 'ROSS',
        phone_number: '(514) 937-0505',
        email_address: 'OPERATIONS@MESSAGERS.CA',
        street_address: '2985 DOUGLAS B. FLOREANI',
        suite: '',
        city: 'ST LAURENT',
        province: 'Quebec',
        postal_code: 'H4S 1Y7',
        special_instructions: 'THIS IS TEST',
        hour_from: '07:00 PM',
        hour_to: '07:00 PM',
        require_appointment: true,
        no_waiting_charge_time: true
      },
      {
        company_location: 'MESSAGERS 2',
        contact_name: 'MHD',
        phone_number: '(514) 937-0505',
        email_address: 'OPERATIONS@MESSAGERS.CA',
        street_address: '2985 DOUGLAS B. FLOREANI',
        suite: 'suite',
        city: 'ST LAURENT',
        province: 'Quebec',
        postal_code: 'H4S 1Y7',
        special_instructions: 'THIS IS TEST',
        hour_from: '07:00 PM',
        hour_to: '07:00 PM',
        require_appointment: true,
        no_waiting_charge_time: true
      }
    ],
    interliners: [
      {
        company_name: 'ROGUE',
        contact_person: '',
        email: '',
        phone_number: '905-362-9401',
        address: '255 COURTNEY PARK WEST',
        suite: '',
        city: 'MISSISSAUGA',
        province: 'ON',
        postal_code: 'L5W 0A5'
      },
      {
        company_name: 'ALM CROWN MOVING AND DELIVERY LIMITED',
        contact_person: 'JASON CROWN',
        email: 'jcrown@almcrown.ca',  
        phone_number: '866-825-0927',
        address: '6355 DANVILLE ROAD',
        city: 'MISSISSAUGA',
        suite: '',
        province: 'ON',
        postal_code: 'L5T 2L4'
      }
    ]
  }
}

export default globalVariables
