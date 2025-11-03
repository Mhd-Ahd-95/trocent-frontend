
const check_keys = (stprop, item, error) => {
    const rateSheet = Object.keys(item)
    const staticProps = stprop.map((st) => st.name)
    const updatedProps = [...stprop];
    staticProps.forEach(sp => {
        if (!rateSheet.includes(sp)) {
            error[sp] = { 'Prop': `${sp} must be include in the excel` }
        }
    })
    const brackets = rateSheet.filter(rs => !staticProps.includes(rs))
    const bracketsProps = []
    brackets.forEach(bk => {
        bracketsProps.push({ name: bk, field: 'rate_bracket', type: 'string', required: true })
    })
    return [updatedProps, bracketsProps]
}

export default function dataProcessing(stprop, items) {
    const processedItems = []
    let processedItemsError = {}
    if (items.length > 0) {
        const ckeys = check_keys(stprop, items[0], processedItemsError)
        const updatedProps = ckeys[0]
        const brackets = ckeys[1]
        items.forEach((item, index) => {
            const processedItem = {}
            updatedProps.forEach(prop => {
                let value = item[prop.name]
                if (!value && prop.required) {
                    processedItemsError[prop.name] = { ...processedItemsError[prop.name], 'Required': `${prop.name} (${index + 2}) is a required field` }
                }
                if (prop.constrained && prop.constrained.length > 0 && value) {
                    if (!prop.constrained.includes(value.toLowerCase())) {
                        processedItemsError[prop.name] = { ...processedItemsError[prop.name], 'Constrained': `${prop.name} must be ${prop.constrained.join(', ')}` }
                    }
                    else {
                        value = value.toLowerCase()
                    }
                }
                processedItem[prop.field] = value
            })
            processedItem['brackets'] = []
            brackets.forEach((bracket) => {
                const value = item[bracket.name] || ''
                processedItem['brackets'].push({ [bracket.field]: bracket.name, 'rate': String(value) })
            })
            processedItems.push(processedItem)
        })
    }
    else {
        processedItemsError['No Data'] = { 'Excel': 'The excel sheet must be contains Rate Sheets data' }
    }
    return [processedItems, processedItemsError]
}