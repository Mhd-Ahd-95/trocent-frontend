

const globalVariables = {
    auth: {},
    apis: {},
    methods: {
        formatNumber: nb => isNaN(nb) ? Number(0).toFixed : Number(nb).toFixed(2),
        formatAccessorial: (n, a) => `${n} @ $${globalVariables.methods.formatNumber(a)}`,
        capitalize: s => (s && s[0].toUpperCase() + s.slice(1).toLowerCase()) || '',
        capitalizeMany: s => (s && s.split(' ').length > 1 ? s.split(' ').map(ss => globalVariables.methods.capitalize(ss)).join(' ') : globalVariables.methods.capitalize(s)),
        capSpacing: s => s.replace(/([A-Z])/g, ' $1').trim(),
        _spacing: s => s ? s.split('_').map(ss => ss[0].toUpperCase() + ss.slice(1).toLowerCase()).join(' ') : '',
        formatDate: d => d && d.toISOString ? d.toISOString().split('T')[0] : '',
        avatar: org => {
            const lst = org.split(' ')
            if (lst.length === 1) {
                return lst[0].length === 2 ? lst[0][0] + lst[0][1] : lst[0][0] + lst[0][1] + lst[0][2]
            } else if (lst.length === 2) {
                return lst[0][0] + lst[1][0]
            } else {
                return lst[0][0] + lst[1][0] + lst[2][0]
            }
        },
    }
}

export default globalVariables