

export default class OrderEngine {

    static INCH_TO_CM = 2.54
    static CM_TO_INCH = 0.393701
    static LBS_TO_KG = 0.453592
    static KG_TO_LBS = 2.20462

    constructor() {
        this.request = {}
        this.context = {}
    }

    get customer() { return this.request['customer'] }
    set customer(cust) { this.request['customer'] = cust }

    set shipper_city(sc) { this.request['shipper_city'] = sc }
    set receiver_city(sc) { this.request['receiver_city'] = sc }

    set freights(fs) { this.request['freights'] = fs }

    initializeContext = () => {
        return ({
            freights: this.request['freights'],
            customer_id: this.request['customer']['id'] || '',
            shipper_city: this.request['shipper_city'],
            receiver_city: this.request['receiver_city'],
            customer_weight_rules: Number(this.request['customer']['weight_pieces_rule']) || 0,
            customer_fuel_rules: Number(this.request['customer']['fuel_surcharge_rule']) || 0,
            total_pieces: 0,
            total_actual_weight: 0,
            total_volume_weight: 0,
            total_pieces_skid: 0,
            total_chargeable_weight: 0,
            total_weight_in_kg: 0
        })
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
            height = 102
        }

        if (dimUnit === 'in') volumeWeight = Number(pieces) * ((Number(length) * Number(width) * Number(height)) / 172)
        else volumeWeight = Number(pieces) * ((Number(length) * Number(width) * Number(height)) / 6000)

        return volumeWeight
    }

    calculateTotalFreights = () => {

        this.context = this.initializeContext()

        if (!this.context['customer_id']) return

        for (let freight of this.context['freights']) {

            const normalpzedFreight = OrderEngine.normalizeToElectronStandard(freight)
            const {
                type,
                pieces,
                weight,
                unit,
                volumeWeight } = normalpzedFreight

            this.context['total_pieces'] += pieces
            if (type === 'Skid') {
                this.context['total_pieces_skid'] += this.calculateTotalPieces(normalpzedFreight)
            }

            this.context['total_actual_weight'] += weight

            this.context['total_chargeable_weight'] += volumeWeight
            this.context['total_volume_weight'] = this.context['total_chargeable_weight']

            if (this.context['total_chargeable_weight'] < this.context['total_actual_weight']) {
                this.context['total_chargeable_weight'] = this.context['total_actual_weight']
            }

            if (unit === 'kg') this.context['total_weight_in_kg'] += volumeWeight
            else this.context['total_weight_in_kg'] += volumeWeight * OrderEngine.LBS_TO_KG

        }
        return this.format_value()
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
        if (l > 48 || w > 48 || h > 82) {
            nfn = Math.ceil(l / 48) * f.pieces
            if (w > 48 || h > 82) nfn = nfn * 2
        }
        if (f.not_stack) nfn = nfn * 2
        return Math.max(pieces, nfn)
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
        let volumeWeight = OrderEngine.calculateVolumeWeight(freight)


        if (is_converted) {
            if (unit === 'kg' && dim_unit === 'cm') {
                length = length * OrderEngine.CM_TO_INCH
                width = width * OrderEngine.CM_TO_INCH
                height = height * OrderEngine.CM_TO_INCH
                unit = 'lbs'
            }
            else if (unit === 'lbs' && dim_unit === 'in') {
                length = length * OrderEngine.INCH_TO_CM
                width = width * OrderEngine.INCH_TO_CM
                height = height * OrderEngine.INCH_TO_CM
                unit = 'kg'
            }
        }

        if (is_converted) {
            if (unit === 'kg') {
                volumeWeight = volumeWeight * OrderEngine.LBS_TO_KG
                weight = weight * OrderEngine.LBS_TO_KG
            }
            else if (unit === 'lbs') {
                volumeWeight = volumeWeight * OrderEngine.KG_TO_LBS
                weight = weight * OrderEngine.KG_TO_LBS
            }
        }

        return {
            type,
            pieces,
            length,
            weight,
            width,
            height,
            dim_unit,
            unit,
            is_converted,
            not_stack,
            volumeWeight
        }

    }

    format_value = () => {

        return ({
            total_pieces: (Math.round(this.context['total_pieces'] * 100) / 100) || 0,
            total_actual_weight: (Math.round(this.context['total_actual_weight'] * 100) / 100) || 0,
            total_pieces_skid: (Math.round(this.context['total_pieces_skid'] * 100) / 100) || 0,
            total_volume_weight: (Math.round(this.context['total_volume_weight'] * 100) / 100) || 0,
            total_weight_in_kg: (Math.round(this.context['total_weight_in_kg'] * 100) / 100) || 0,
            total_chargeable_weight: (Math.round(this.context['total_chargeable_weight'] * 100) / 100) || 0
        })
    }

}