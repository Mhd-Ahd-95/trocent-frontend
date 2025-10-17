
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
        if (isNaN(bk)) {
            error[bk] = {
                'Prop': `Bracket Rate (${bk}) must be a number`
            }
        }
        bracketsProps.push({ name: bk, field: 'bracket_rate', type: 'int', required: true })
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
                const value = item[prop.name]
                if (!value && prop.required) {
                    processedItemsError[prop.name] = { ...processedItemsError[prop.name], 'Required': `${prop.name} (${index + 2}) is a required field` }
                }
                processedItem[prop.field] = item[prop.name]
            })
            processedItem['brackets'] = []
            brackets.forEach((bracket) => {
                const value = item[bracket.name]
                if (isNaN(value)) processedItemsError[bracket.name] = { ...processedItemsError[bracket.name], 'Type': `Type of (${bracket.name}) (${index}) must be a number` }
                processedItem['brackets'].push({ [bracket.field]: Number(bracket.name), 'rate': value })
            })
            processedItems.push(processedItem)
        })
    }
    else {
        processedItemsError['No Data'] = { 'Excel': 'The excel sheet must be contains Rate Sheets data' }
    }
    return [processedItems, processedItemsError]
}