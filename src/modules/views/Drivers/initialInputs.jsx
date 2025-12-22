

const inputs = {
    identity: [
        { label: 'Driver Number*', field: 'driver_number', required: true, md: 4 },
        { label: 'First Name*', field: 'fname', required: true, md: 4 },
        { label: 'Middle Name', field: 'mname', required: false, md: 4 },
        { label: 'Last Name*', field: 'lname', required: true, md: 4 },
        { label: 'Date of Birth', field: 'dob', required: false, type: 'date', md: 4 },
        { label: 'Gender', field: 'gender', required: false, selected: true, options: ['male', 'female'], md: 4 },
        { label: 'SIN', field: 'sin', required: false, md: 4 },
        { label: 'Company*', field: 'company_id', required: true, autoComplete: true, md: 4 }
    ],
    contact: [
        { label: 'Phone', field: 'phone', required: false, md: 6 },
        { label: 'Contact Email', field: 'email', required: false, md: 6 },
    ],
    address: [
        { label: 'Address', field: 'address', required: false, md: 4 },
        { label: 'Province', field: 'province', required: false, helperText: 'Enter 2-letter uppercase code', inputProps: { maxLength: 2 }, md: 4 },
        { label: 'City', field: 'city', required: false, md: 4 },
        { label: 'Postal Code', field: 'postal_code', required: false, md: 4 },
        { label: 'Suite', field: 'suite', required: false, md: 4 }
    ],
    'license & compliance': [
        { label: 'License Number', field: 'license_number', required: false, md: 4 },
        { label: 'License Classes', field: 'license_classes', required: false, md: 4 },
        { label: 'License Expiry', field: 'license_expiry', required: false, type: 'date', md: 4 },
        { label: 'TDG Certified', field: 'tdg', type: 'switch', md: 4 },
        { label: 'TDG Expiry', field: 'tdg_expiry', required: false, type: 'date', md: 4 },
        { label: 'Criminal check Expiry', field: 'criminal_expiry', required: false, type: 'date', md: 4 },
        { label: 'Criminal check Note', field: 'criminal_note', required: false, multiline: true, md: 4 },
    ],
    additional_info: [
        { label: 'Contract Type', field: 'contract_type', required: false, selected: true, options: ['full_time', 'part_time', 'contractor'], md: 6 },
        { label: 'Driver Description', field: 'driver_description', required: false, md: 6 }
    ]
}

export default inputs