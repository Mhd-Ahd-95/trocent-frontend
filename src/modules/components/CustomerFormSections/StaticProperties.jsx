

const staticProperties = [
    {
        name: 'Destination City',
        field: 'destination',
        required: true,
        type: 'int'
    },
    {
        name: 'Province',
        field: 'province',
        required: false,
        type: 'str'
    },
    {
        name: 'Postal Code',
        field: 'postal_code',
        required: false,
        type: 'str'
    },
    {
        name: 'Priority Sequence',
        field: 'priority_sequence',
        required: false,
        type: 'int'
    },
    {
        name: 'Rate Code',
        field: 'rate_code',
        required: false,
        type: 'str'
    },
    {
        name: 'External',
        field: 'external',
        required: false,
        type: 'str'
    },
    {
        name: 'Min',
        field: 'min_rate',
        required: false,
        type: 'int'
    },
    {
        name: 'LTL',
        field: 'ltl_rate',
        required: false,
        type: 'int'
    }
]

export default staticProperties