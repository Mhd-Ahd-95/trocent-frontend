import RateSheetsApi from "../../apis/RateSheets.api"


export default class OrderEngine {

    static INCH_TO_CM = 2.54
    static CM_TO_INCH = 0.393701
    static LBS_TO_KG = 0.45359237
    static KG_TO_LBS = 2.20462

    constructor() {
        this.request = {}
        this.context = {}
        this.customerRateSheets = []
    }

    get customer() { return this.request['customer'] }
    set customer(cust) { this.request['customer'] = cust }

    set shipper_city(sc) { this.request['shipper_city'] = sc }
    set receiver_city(rc) { this.request['receiver_city'] = rc }

    set freights(fs) { this.request['freights'] = fs }

    set isManualSkid(ims) { this.request['is_manual_skid'] = ims }

    set overrideTotalPiecesSkid(ps) { this.request['override_total_skid_pieces'] = ps }
    get overrideTotalPiecesSkid() { return this.request['override_total_skid_pieces'] }

    calculateOrder = () => {
        this.context = this.initializeContext()
        this.calculateTotalFreights()
        this.calculateFreightRate()
        return this.format_value()
    }

    initializeContext = () => {
        return ({
            freights: this.request['freights'],
            customer_id: this.request['customer']['id'] || '',
            shipper_city: this.request['shipper_city'],
            receiver_city: this.request['receiver_city'],
            customer_weight_rules: Number(this.request['customer']['weight_pieces_rule']) || 0,
            customer_fuel_rules: Number(this.request['customer']['fuel_surcharge_rule']) || 0,
            is_manual_skid: this.request['is_manual_skid'] || false,

            total_pieces: 0,
            total_actual_weight: 0,
            total_volume_weight: 0,
            total_pieces_skid: 0,
            total_chargeable_weight: 0,
            total_weight_in_kg: 0,
            override_total_skid_pieces: this.request['override_total_skid_pieces'] || 0,

            is_skid_rate_exists: false,
            is_weight_rate_exists: false,
            total_chargeable_weight_skid: 0,
            total_chargeable_weight_weight: 0,
            total_actual_weight_weight: 0,
            freight_rate: 0,
            freight_rate_skid: 0,
            freight_rate_weight: 0,
            freight_fuel_surcharge: 0
        })
    }

    calculateTotalFreights = () => {

        if (!this.context['customer_id']) return

        for (let freight of this.context['freights']) {

            const normalizedFreight = OrderEngine.normalizeToElectronStandard(freight)
            const { type, pieces, weight, unit, volumeWeight } = normalizedFreight

            this.context['total_pieces'] += pieces
            if (type === 'Skid') {
                this.context['is_skid_rate_exists'] = true
                if (!this.context['is_manual_skid']) this.context['total_pieces_skid'] += this.calculateTotalPieces(normalizedFreight)
                this.context['total_chargeable_weight_skid'] += volumeWeight
            }
            else {
                this.context['is_weight_rate_exists'] = true
                this.context['total_chargeable_weight_weight'] += volumeWeight
                this.context['total_actual_weight_weight'] += weight
            }

            this.context['total_actual_weight'] += weight
            this.context['total_chargeable_weight'] += volumeWeight

            if (unit === 'lbs') this.context['total_weight_in_kg'] += volumeWeight * OrderEngine.LBS_TO_KG
            else this.context['total_weight_in_kg'] += volumeWeight
        }

        this.context['total_volume_weight'] = this.context['total_chargeable_weight']
        this.context['total_chargeable_weight_weight'] = Math.max(this.context['total_chargeable_weight_weight'], this.context['total_actual_weight_weight'])
        this.context['total_chargeable_weight'] = Math.max(this.context['total_chargeable_weight'], this.context['total_actual_weight'])

        if (this.context['is_manual_skid']) this.context['total_pieces_skid'] = this.context['override_total_skid_pieces']

    }

    static normalizeToElectronStandard = (freight) => {
        let type = freight.type
        let pieces = Number(freight.pieces) ?? 1
        let length = Number(freight.length) ?? 0
        let width = Number(freight.width) ?? 0
        let height = Number(freight.height) ?? 0
        let dim_unit = freight.dim_unit ?? 'in'
        let unit = freight.unit ?? 'lbs'
        let is_converted = freight.is_converted ?? false
        let not_stack = freight.not_stack ?? false
        let weight = Number(freight.weight) ?? 0

        if (is_converted) {
            if (unit === 'kg' && dim_unit === 'cm') {
                length = length * OrderEngine.CM_TO_INCH
                width = width * OrderEngine.CM_TO_INCH
                height = height * OrderEngine.CM_TO_INCH
                unit = 'lbs'
                dim_unit = 'in'
            }
            else if (unit === 'lbs' && dim_unit === 'in') {
                length = length * OrderEngine.INCH_TO_CM
                width = width * OrderEngine.INCH_TO_CM
                height = height * OrderEngine.INCH_TO_CM
                unit = 'kg'
                dim_unit = 'cm'
            }
        }

        let volumeWeight = OrderEngine.calculateVolumeWeight({ ...freight, length, width, height, dim_unit, unit })

        if (is_converted) {
            if (unit === 'kg') weight = weight * OrderEngine.LBS_TO_KG
            else if (unit === 'lbs') weight = weight * OrderEngine.KG_TO_LBS
        }

        return { type, pieces, length, weight, width, height, dim_unit, unit, is_converted, not_stack, volumeWeight }
    }

    static calculateVolumeWeight = (freight) => {
        let volumeWeight = 0
        let pieces = freight.pieces ?? 1
        let length = freight.length ?? 0
        let width = freight.width ?? 0
        let height = freight.height ?? 0
        let dimUnit = freight.dim_unit ?? 'in'
        let notStacked = freight.not_stack ?? false

        if (notStacked) {
            if (dimUnit === 'cm') height = 259.08
            else height = 102
        }

        if (dimUnit === 'in') volumeWeight = Number(pieces) * ((Number(length) * Number(width) * Number(height)) / 172)
        else volumeWeight = Number(pieces) * ((Number(length) * Number(width) * Number(height)) / 6000)

        return volumeWeight
    }

    calculateTotalPieces = (f) => {
        const r = this.context['customer_weight_rules']
        if (r <= 0) return f.pieces || 1

        let pieces = f.weight / r
        if (pieces % 1 > 0) pieces = Math.floor(pieces) + 1
        else pieces = Math.floor(pieces)

        let nfn = f.pieces
        let l = Math.ceil(f.length)
        let w = Math.ceil(f.width)
        let h = Math.ceil(f.height)

        if (f.dim_unit === 'cm' && f.unit === 'kg') {
            if (l > 121.92 || w > 121.92 || h > 208.28) {
                nfn = Math.ceil(l / 121.92) * f.pieces
                if (w > 121.92 || h > 208.28) nfn = nfn * 2
            }
        }
        else if (f.dim_unit === 'in' && f.unit === 'lbs') {
            if (l > 48 || w > 48 || h > 82) {
                nfn = Math.ceil(l / 48) * f.pieces
                if (w > 48 || h > 82) nfn = nfn * 2
            }
        }

        if (f.not_stack) nfn = nfn * 2

        return Math.max(pieces, nfn)
    }

    calculateFreightRate = () => {

        if (!this.customer) return

        let hasSkidRateSheet = this.customerRateSheets.some(rs => rs.type === 'skid')

        this.context['freight_rate_skid'] = 0
        this.context['freight_rate_weight'] = 0

        if (hasSkidRateSheet) {
            if (this.context['is_skid_rate_exists']) this.context['freight_rate_skid'] = this.calculateSkidRate()
            if (this.context['is_weight_rate_exists']) this.context['freight_rate_weight'] = this.calculateWeightRate()

        } else {
            if (this.context['is_skid_rate_exists'] || this.context['is_weight_rate_exists']) {
                this.context['freight_rate_weight'] = this.findRate('weight', this.context['total_chargeable_weight'], this.context['shipper_city'], this.context['receiver_city'])
            }
            this.context['is_skid_rate_exists'] = false
        }

        this.context['freight_rate'] = this.context['freight_rate_skid'] + this.context['freight_rate_weight']

        return this.context['freight_rate']
    }


    calculateSkidRate = () => {

        const total_chargeable_weight_skid = this.context['total_chargeable_weight_skid']
        const total_chargeable_weight_weight = this.context['total_chargeable_weight_weight']
        const total_pieces = this.context['total_pieces_skid']
        const shipper_city = this.context['shipper_city']
        const receiver_city = this.context['receiver_city']

        // Check if customer uses skid by weight
        const skidByWeight = this.customerRateSheets.some(rs => rs.type === 'skid' && rs.skid_by_weight === 1)
        let sheet_rate = 0

        if (skidByWeight) sheet_rate = this.findRate('weight', total_chargeable_weight_skid, shipper_city, receiver_city)
        else {
            sheet_rate = this.findRate('skid', total_pieces, shipper_city, receiver_city)
            if (sheet_rate === 0) sheet_rate = this.findRate('weight', total_chargeable_weight_weight, shipper_city, receiver_city)
        }

        let freight_rate_skid = skidByWeight ? sheet_rate : (total_pieces * sheet_rate)

        return freight_rate_skid
    }

    calculateWeightRate = () => {
        const total_chargeable_weight_weight = this.context['total_chargeable_weight_weight']
        const total_chargeable_weight_skid = this.context['total_chargeable_weight_skid']
        const total_pieces = this.context['total_pieces_skid']
        const shipper_city = this.context['shipper_city']
        const receiver_city = this.context['receiver_city']

        let sheet_rate = this.findRate('weight', total_chargeable_weight_weight, shipper_city, receiver_city)

        if (sheet_rate === 0) {
            sheet_rate = this.findRate('skid', total_pieces, shipper_city, receiver_city)
            if (sheet_rate === 0) {
                sheet_rate = this.findRate('weight', total_chargeable_weight_skid, shipper_city, receiver_city)
            }
        }

        return sheet_rate
    }

    findRate = (type, value, source_city, destination_city) => {

        if (!source_city || !destination_city) return 0
        source_city = source_city.toLowerCase().trim()
        destination_city = destination_city.toLowerCase().trim()

        let rate = this.fetchRateFromSheets(type, value, source_city, destination_city)

        if (rate === 0) rate = this.fetchRateFromSheets(type, value, destination_city, source_city)

        return rate
    }


    fetchRateFromSheets = (type, value, source_city, destination_city) => {

        const sourceSheets = this.customerRateSheets.filter(rs => rs.type === type && rs.destination.toLowerCase().trim() === source_city)
        console.log('this.customerRateSheets: ', this.customerRateSheets);
        console.log('sourceSheets: ', sourceSheets);

        if (sourceSheets.length === 0) return 0

        const firstSheet = sourceSheets.sort((a, b) => Number(b.priority_sequence) - Number(a.priority_sequence))[0]

        if (!firstSheet) return 0

        const firstRate = this.getRateFromSheet(firstSheet, value, type)
        if (firstRate === 0) return 0

        // Find matching destination sheet with same rate_code
        const destSheets = this.customerRateSheets.filter(rs => rs.type === type && rs.destination.toLowerCase().trim() === destination_city && rs.rate_code === firstSheet.rate_code)

        if (destSheets.length === 0) return firstRate

        // Prefer external if first sheet is external
        let secondSheet
        if (firstSheet.external === 'external') {
            secondSheet = destSheets.find(rs => rs.external === 'external')
            if (!secondSheet) {
                secondSheet = destSheets.sort((a, b) => (b.external === 'external' ? 1 : 0) - (a.external === 'external' ? 1 : 0))[0]
            }
        } else {
            secondSheet = destSheets.sort((a, b) => (b.external === 'external' ? 1 : 0) - (a.external === 'external' ? 1 : 0))[0]
        }

        if (!secondSheet) return firstRate

        const secondRate = this.getRateFromSheet(secondSheet, value, type)

        return Math.max(firstRate, secondRate)
    }


    getRateFromSheet = (sheet, value, type) => {
        if (type === 'skid') {
            const bracket = sheet.brackets.find(b => String(b.rate_bracket) === String(Math.round(value)))
            return bracket ? Number(bracket.rate) : 0
        } else {
            const bracketName = this.getWeightBracket(value)
            let bracket
            if (bracketName === 'ltl_rate') {
                bracket = { rate: sheet[bracketName] }
            }
            else {
                bracket = sheet.brackets.find(b => b.rate_bracket === bracketName)
            }

            if (!bracket) return 0

            // Calculate rate: (bracket_rate * weight / 100)
            const calculatedRate = (Number(bracket.rate) * value) / 100
            const minRate = Number(sheet.min_rate) || 0

            // Return max of calculated rate and min rate
            return Math.max(calculatedRate, minRate)
        }
    }


    getWeightBracket = (weight) => {
        // Get all unique brackets from all weight rate sheets
        const allBrackets = this.customerRateSheets
            .filter(rs => rs.type === 'weight')
            .flatMap(rs => rs.brackets.map(b => b.rate_bracket))
            .filter(b => !isNaN(Number(b)))
            .map(b => Number(b))
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort((a, b) => a - b)

        if (allBrackets.length === 0) return 'ltl_rate'

        // If weight is below smallest bracket, use ltl
        if (weight < allBrackets[0]) return 'ltl_rate'

        // Find highest bracket that doesn't exceed weight
        let selectedBracket = 'ltl_rate'
        for (const bracket of allBrackets) {
            if (weight >= bracket) {
                selectedBracket = String(bracket)
            } else {
                break
            }
        }

        return selectedBracket
    }

    format_value = () => {
        return ({
            total_pieces: Math.round(this.context['total_pieces'] * 100) / 100 || 0,
            total_actual_weight: Math.round(this.context['total_actual_weight'] * 100) / 100 || 0,
            total_pieces_skid: Math.round(this.context['total_pieces_skid'] * 100) / 100 || 0,
            total_volume_weight: Math.round(this.context['total_volume_weight'] * 100) / 100 || 0,
            total_weight_in_kg: Math.round(this.context['total_weight_in_kg'] * 100) / 100 || 0,
            total_chargeable_weight: Math.round(this.context['total_chargeable_weight'] * 100) / 100 || 0,
            freight_rate: Math.round(this.context['freight_rate'] * 100) / 100 || 0,
            freight_rate_skid: Math.round(this.context['freight_rate_skid'] * 100) / 100 || 0,
            freight_rate_weight: Math.round(this.context['freight_rate_weight'] * 100) / 100 || 0
        })
    }

    get_customer_rate_sheet = async (cid) => {
        try {
            const res = await RateSheetsApi.loadRateSheetsByCustomerAndType(Number(cid))
            this.customerRateSheets = res.data
        } catch (error) {
            console.error('Failed to load rate sheets:', error)
            this.customerRateSheets = []
        }
    }
}