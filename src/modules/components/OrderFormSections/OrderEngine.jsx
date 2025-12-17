import FuelSurchargeAPI from '../../apis/FuelSurcharges.api'
import moment from "moment"
import { orderFields } from './OrderFields'

export default class OrderEngine {

    static INCH_TO_CM = 2.54
    static CM_TO_INCH = 0.393701
    static LBS_TO_KG = 0.45359237
    static KG_TO_LBS = 2.20462

    constructor(enqueueSnackbar, orderDate = new Date()) {
        this.enqueueSnackbar = enqueueSnackbar
        this.request = {}
        this.context = {}
        this.custRateSheet = []
        this.fuelSurchargeByDate = null
        this.fuelSurchargePromise = null
        this.fuelSurchargePromise = this.get_fuel_surcharge_by_date(moment(orderDate).toISOString())
    }

    set customerRateSheets(cr) { this.custRateSheet = cr }
    get customerRateSheets() { return this.custRateSheet }

    get customer() { return this.request['customer'] }
    set customer(cust) { this.request['customer'] = cust }

    set shipper_city(sc) { this.request['shipper_city'] = sc }
    get shipper_city() { return this.request['shipper_city'] }
    set receiver_city(rc) { this.request['receiver_city'] = rc }
    get receiver_city() { return this.request['receiver_city'] }

    set freights(fs) { this.request['freights'] = fs }

    set isManualSkid(ims) { this.request['is_manual_skid'] = ims }

    set overrideTotalPiecesSkid(ps) { this.request['override_total_skid_pieces'] = ps }
    get overrideTotalPiecesSkid() { return this.request['override_total_skid_pieces'] }

    set override_fuel_surcharge(fs) { this.request['override_fuel_surcharge'] = fs }
    set override_freight_rate(ofr) { this.request['override_freight_rate'] = ofr }
    set isManualFreightRate(fr) { this.request['manual_freight_rate'] = fr }
    set isManualFuelSurcharge(fr) { this.request['manual_fuel_surcharge'] = fr }
    set isNoCharge(nc) { this.request['no_charge'] = nc }

    set directKM(km) { this.request['direct_km'] = km }

    set service_type(st) { this.request['service_type'] = st }

    set customer_vehicle_types(cvt) { this.request['customer_vehicle_types'] = cvt }

    set accessorialsCharge(ac) { this.request['customer_accessorials_charges'] = ac }

    set otherAccessorialsCharges(oac) { this.request['other_accessorials_charges'] = oac }

    set receiverProvince(rp) { this.request['receiver_province'] = rp }

    calculateOrder = () => {
        this.context = this.initializeContext()
        this.calculateTotalFreights()
        this.calculateFreightRate()
        this.applyServiceCharge()
        this.applyAccessorialsCharge()
        this.calculateFuelSurcharge()
        this.applyOtherCharges()
        this.applyProvincialTaxes()
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
            manual_freight_rate: this.request['manual_freight_rate'] || 0,
            override_freight_rate: this.request['override_freight_rate'] || 0,
            manual_fuel_surcharge: this.request['manual_fuel_surcharge'] || false,
            override_fuel_surcharge: this.request['override_fuel_surcharge'] || 0,
            no_charge: this.request['no_charge'] || false,
            direct_km: this.request['direct_km'] || 0,
            service_type: this.request['service_type'] || 'Regular',
            customer_vehicle_types: this.request['customer_vehicle_types'] || [],
            customer_accessorials_charges: this.request['customer_accessorials_charges'] || [],
            other_accessorials_charges: this.request['other_accessorials_charges'] || [],
            receiver_province: this.request['receiver_province'] || '',

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
            total_actual_weight_skid: 0,
            total_chargeable_weight_weight: 0,
            total_actual_weight_weight: 0,
            freight_rate: 0,
            freight_rate_skid: 0,
            freight_rate_weight: 0,
            freight_fuel_surcharge: 0,
            fuel_based_accessorial_charges: 0,
            direct_service_charge_amount: 0,
            charges_total: 0,
            provincial_tax: 0,
            federal_tax: 0,
            sub_totals: 0,
            grand_totals: 0
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
                this.context['total_actual_weight_skid'] += weight
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
        this.context['total_chargeable_weight_skid'] = Math.max(this.context['total_chargeable_weight_skid'], this.context['total_actual_weight_skid'])
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

        if (this.context['no_charge']) return

        if (this.context['manual_freight_rate']) {
            this.context['freight_rate'] = this.context['override_freight_rate']
            return
        }
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

    }


    calculateSkidRate = () => {
        const total_chargeable_weight_skid = this.context['total_chargeable_weight_skid']
        const total_chargeable_weight_weight = this.context['total_chargeable_weight_weight']
        const total_pieces = this.context['total_pieces_skid']
        const shipper_city = this.context['shipper_city']
        const receiver_city = this.context['receiver_city']

        const skidByWeight = this.customerRateSheets.some(rs => rs.type === 'skid' && rs.skid_by_weight === 1)
        let sheet_rate = 0

        if (skidByWeight) sheet_rate = this.findRate('skid', total_chargeable_weight_skid, shipper_city, receiver_city, skidByWeight)
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

    findRate = (type, value, source_city, destination_city, isSkidByWeight = false) => {

        if (!source_city || !destination_city) return 0
        source_city = source_city.toLowerCase().trim()
        destination_city = destination_city.toLowerCase().trim()

        let rate = this.fetchRateFromSheets(type, value, source_city, destination_city, isSkidByWeight)

        if (rate === 0) rate = this.fetchRateFromSheets(type, value, destination_city, source_city, isSkidByWeight)

        return rate
    }


    fetchRateFromSheets = (type, value, source_city, destination_city, isSkidByWeight) => {
        let sourceSheets = this.customerRateSheets.filter(rs => rs.type === type && rs.skid_by_weight === Number(isSkidByWeight) && rs.destination.toLowerCase().trim() === source_city)

        if (sourceSheets.length === 0) return 0

        const firstSheet = sourceSheets.sort((a, b) => Number(b.priority_sequence) - Number(a.priority_sequence))[0]

        if (!firstSheet) return 0

        const firstRate = this.getRateFromSheet(firstSheet, value, type, isSkidByWeight)
        if (firstRate === 0) return 0

        let destSheets = this.customerRateSheets.filter(rs => rs.type === type && rs.skid_by_weight === Number(isSkidByWeight) && rs.destination.toLowerCase().trim() === destination_city && rs.rate_code === firstSheet.rate_code)

        if (destSheets.length === 0) return 0

        let secondSheet
        if (firstSheet.external === 'E') {
            secondSheet = destSheets.find(rs => rs.external === 'E')
            if (!secondSheet) {
                secondSheet = destSheets.sort((a, b) => (b.external === 'E' ? 1 : 0) - (a.external === 'E' ? 1 : 0))[0]
            }
        } else {
            secondSheet = destSheets.sort((a, b) => (b.external === 'E' ? 1 : 0) - (a.external === 'E' ? 1 : 0))[0]
        }

        if (!secondSheet) return 0

        const secondRate = this.getRateFromSheet(secondSheet, value, type, isSkidByWeight)

        return Math.max(firstRate, secondRate)
    }


    getRateFromSheet = (sheet, value, type, isSkidByWeight) => {
        if (type === 'skid' && !isSkidByWeight) {
            const bracket = sheet.brackets.find(b => String(b.rate_bracket) === String(Math.round(value)))
            if (!bracket) {
                const rates = sheet.brackets.map(b => Number(b.rate_bracket))
                const max = Math.max(...rates)
                // const min = Math.min(rates)
                return value > max ? (Number(sheet.ftl) / value) || 0 : 0
            }
            else {
                return Number(bracket.rate)
            }
        } else {
            const bracketName = this.getWeightBracket(value, isSkidByWeight)
            let bracket
            if (bracketName === 'ltl') {
                bracket = { rate: sheet[bracketName] }
            }
            else if (bracketName === 'ftl') {
                return Number(sheet[bracketName])
            }
            else {
                bracket = sheet.brackets.find(b => b.rate_bracket === bracketName)
            }

            if (!bracket) return 0

            const calculatedRate = (Number(bracket.rate) * value) / 100
            const minRate = Number(sheet.min_rate) || 0

            return Math.max(calculatedRate, minRate)
        }
    }


    getWeightBracket = (weight, isSkidByWeight) => {
        let allBrackets
        if (isSkidByWeight) {
            allBrackets = this.customerRateSheets
                .filter(rs => rs.type === 'skid' && rs.skid_by_weight === 1)
                .flatMap(rs => rs.brackets.map(b => b.rate_bracket))
                .filter(b => !isNaN(Number(b)))
                .map(b => Number(b))
                .filter((v, i, a) => a.indexOf(v) === i)
                .sort((a, b) => a - b)
        }
        else {
            allBrackets = this.customerRateSheets
                .filter(rs => rs.type === 'weight')
                .flatMap(rs => rs.brackets.map(b => b.rate_bracket))
                .filter(b => !isNaN(Number(b)))
                .map(b => Number(b))
                .filter((v, i, a) => a.indexOf(v) === i)
                .sort((a, b) => a - b)
        }

        if (allBrackets.length === 0) return 'ltl'

        if (weight < allBrackets[0]) return 'ltl'

        if (weight > Math.max(...allBrackets)) return 'ftl'

        let selectedBracket = 'ltl'
        for (const bracket of allBrackets) {
            if (weight >= bracket) {
                selectedBracket = String(bracket)
            } else {
                break
            }
        }

        return selectedBracket
    }

    calculateFuelSurcharge = () => {

        const checkFuelBased = this.context['customer_accessorials_charges'].find(ca => ca.is_included && ca.type === 'fuel_based')

        if (this.context['no_charge'] && !checkFuelBased) return

        let fuel_rules = this.context['customer_fuel_rules']
        let weight = this.context['total_chargeable_weight']
        let fuelSurcharge = this.fuelSurchargeByDate

        let fuel_value = 0
        let amount = this.context['freight_rate'] + this.context['fuel_based_accessorial_charges']

        if (!this.customer || !this.shipper_city || !this.receiver_city || !fuelSurcharge) {
            return
        }

        if (this.context['manual_fuel_surcharge']) {
            fuel_value = this.context['override_fuel_surcharge']
        }
        else {
            fuel_value = this.calcFuel(fuel_rules, weight, fuelSurcharge, amount)
        }

        this.context['freight_fuel_surcharge'] = fuel_value

    }

    calcFuel = (rules, weight, data, amount) => {

        let fuel_ltl = Number(this.customer['fuel_ltl']) || 0
        let fuel_ltl_other = this.customer['fuel_ltl_other'] || false
        let fuel_ltl_other_value = Number(this.customer['fuel_ltl_other_value']) || 0

        let fuel_ftl = Number(this.customer['fuel_ftl']) || 0
        let fuel_ftl_other = this.customer['fuel_ftl_other'] || false
        let fuel_ftl_other_value = Number(this.customer['fuel_ltl_other_value']) || 0

        let fuel_charge = 0

        if (weight < rules) {
            if (fuel_ltl_other) fuel_charge = (fuel_ltl / 100) * fuel_ltl_other_value
            else {
                fuel_charge = (fuel_ltl / 100) * Number(data.ltl_surcharge)
            }
        }
        else {
            if (fuel_ftl_other) fuel_charge = (fuel_ftl / 100) * fuel_ftl_other_value
            else fuel_charge = (fuel_ftl / 100) * Number(data.ftl_surcharge)
        }

        return (fuel_charge / 100) * amount
    }

    applyServiceCharge = () => {
        let serviceType = this.context['service_type']
        let directKM = this.context['direct_km']
        const vehicleTypes = this.context['customer_vehicle_types'] || []

        if (this.context['manual_freight_rate']) {
            this.context['freight_rate'] = this.context['override_freight_rate']
            return
        }

        if (serviceType === 'Direct') {
            const vehicleIncluded = vehicleTypes.filter(vt => vt.is_included)
            if (vehicleIncluded.length > 0) {
                for (let vtype of vehicleIncluded) {
                    this.context['direct_service_charge_amount'] += Number(vtype.amount) * Number(directKM)
                }
            }
            this.context['freight_rate'] = this.context['direct_service_charge_amount']
        }

    }

    applyAccessorialsCharge = () => {
        const accessorials = this.context['customer_accessorials_charges']
        const accessorialsIncluded = accessorials.filter(acc => acc.is_included)

        if (accessorialsIncluded.length === 0) return

        for (let access of accessorialsIncluded) {
            const amount = Number(access['charge_amount'])
            const type = access['type']
            if (type === 'fuel_based') {
                this.context['fuel_based_accessorial_charges'] += amount
                this.context['charges_total'] += amount
            }
            else this.context['charges_total'] += amount
        }
    }

    applyOtherCharges = () => {
        const otherAccessorials = this.context['other_accessorials_charges']
        if (otherAccessorials.length === 0) return
        for (let oaccess of otherAccessorials) {
            const name = oaccess['charge_name']
            const amount = Number(oaccess['charge_amount'])
            if (name && amount > 0) {
                this.context['charges_total'] += amount
            }
        }
    }

    applyProvincialTaxes = () => {
        let customer = this.customer
        let sub_total = this.context['freight_rate'] + this.context['freight_fuel_surcharge'] + this.context['charges_total']
        let taxes = this.provincialTaxes(this.context['receiver_province'], sub_total, customer)

        this.context['sub_totals'] = sub_total
        this.context['provincial_tax'] = taxes['pst']
        this.context['federal_tax'] = taxes['gst']
        this.context['grand_totals'] = sub_total + taxes['pst'] + taxes['gst']
    }

    provincialTaxes = (rprovince, frate, customer) => {
        let pst = 0, gst = 0

        if (customer['tax_options'] === 'no_tax') {
            return { pst, gst }
        }

        rprovince = rprovince ? rprovince.toUpperCase() : rprovince

        let rates = {
            'ON': { 'pst': 8, 'gst': 5 },
            'BC': { 'pst': 7, 'gst': 5 },
            'AB': { 'pst': 0, 'gst': 5 },
            'SK': { 'pst': 6, 'gst': 5 },
            'MB': { 'pst': 7, 'gst': 5 },
            'QC': { 'pst': 9.975, 'gst': 5 },
            'NB': { 'pst': 10, 'gst': 5 },
            'NS': { 'pst': 10, 'gst': 5 },
            'PE': { 'pst': 10, 'gst': 5 },
            'NL': { 'pst': 10, 'gst': 5 },
            'YT': { 'pst': 0, 'gst': 5 },
            'NT': { 'pst': 0, 'gst': 5 },
            'NU': { 'pst': 0, 'gst': 5 }
        }

        if (rprovince in rates) {
            pst = (rates[rprovince].pst / 100) * frate
            gst = (rates[rprovince].gst / 100) * frate
        }
        return { pst, gst }
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
            freight_rate_weight: Math.round(this.context['freight_rate_weight'] * 100) / 100 || 0,
            freight_fuel_surcharge: Math.round(this.context['freight_fuel_surcharge'] * 100) / 100 || 0,
            sub_totals: Math.round(this.context['sub_totals'] * 100) / 100 || 0,
            provincial_tax: Math.round(this.context['provincial_tax'] * 100) / 100 || 0,
            federal_tax: Math.round(this.context['federal_tax'] * 100) / 100 || 0,
            grand_totals: Math.round(this.context['grand_totals'] * 100) / 100 || 0,
        })
    }

    // get_customer_rate_sheet = async (cid) => {
    //     try {
    //         const res = await RateSheetsApi.loadRateSheetsByCustomerAndType(Number(cid))
    //         this.customerRateSheets = res.data
    //     } catch (error) {
    //         console.error('Failed to load rate sheets:', error)
    //         this.enqueueSnackbar('Failed to load rate sheets', { variant: 'error' })
    //         this.customerRateSheets = []
    //     }
    // }

    get_fuel_surcharge_by_date = async (odate) => {
        try {
            const res = await FuelSurchargeAPI.getFuelSurchargeByDate(odate)

            if (res.data.data) {
                this.fuelSurchargeByDate = res.data.data
            }
            return this.fuelSurchargeByDate
        } catch (error) {
            console.error('Failed to load fuel surcharge:', error)
            this.enqueueSnackbar('Failed to load fuel surcharge', { variant: 'error' })
            this.fuelSurchargeByDate = null
            return null
        }
    }

    static accessorials_types = (type, access, frate, qty, pdtimes, waiting_time) => {

        const pickup_delivery_time = {
            pickup_in: pdtimes[0],
            pickup_out: pdtimes[1],
            delivery_in: pdtimes[2],
            delivery_out: pdtimes[3]
        }

        const amount = Number(access['amount']) || 0
        const amountType = access['amount_type'] || ''
        const timeUnit = access['time_unit']
        const baseAmount = access['base_amount'] || 0
        let freeTime = access['free_time'] ? Number(access['free_time']) : 0
        frate = Number(frate)
        const min = access['min'] ? Number(access['min']) : 0
        const max = access['max'] ? Number(access['max']) : 0

        let { totalDelivery, totalPickup } = OrderEngine.calculateTotalWaitingTime(pickup_delivery_time, waiting_time);
        let calculated_amount = 0

        switch (type) {
            case 'fixed_price':
                calculated_amount = amount
                break
            case 'fuel_based':
                if (amountType === 'percentage') calculated_amount = (amount / 100) * frate
                else calculated_amount = amount
                break
            case 'time_based':
                let free_time_minute = timeUnit === 'minute' ? freeTime : freeTime * 60
                let totalPickupWaitingTime = Math.max(0, (totalPickup - free_time_minute))
                let totalDeliveryWaitingTime = Math.max(0, (totalDelivery - free_time_minute))
                calculated_amount += baseAmount
                if (totalPickupWaitingTime > 0) calculated_amount += totalPickupWaitingTime * amount
                if (totalDeliveryWaitingTime > 0) calculated_amount += totalDeliveryWaitingTime * amount
                break
            case 'transport_based':
                if (amountType === 'percentage') calculated_amount = (amount / 100) * frate
                else calculated_amount = amount * frate
                break
            case 'product_based':
                calculated_amount = amount
                break
            case 'package_based':
                calculated_amount = amount
                break
        }

        calculated_amount *= qty

        if (access['min']) calculated_amount = Math.max(calculated_amount, min)

        if (access['max']) calculated_amount = Math.min(calculated_amount, max)

        return calculated_amount

    }

    static calculateTotalWaitingTime = (time, wtime) => {
        let pnwt = wtime[0]
        let dnwt = wtime[1]
        let pickup_in = time['pickup_in'] ?? null
        let pickup_out = time['pickup_out'] ?? null
        let delivery_in = time['delivery_in'] ?? null;
        let delivery_out = time['delivery_out'] ?? null;

        let totalPickup = 0
        let totalDelivery = 0

        if (pickup_in && pickup_out && !Boolean(pnwt)) {
            totalPickup = OrderEngine.calculateTimeDifferenceInMinutes(pickup_in, pickup_out)
        }
        if (delivery_in && delivery_out && !dnwt) {
            totalDelivery = OrderEngine.calculateTimeDifferenceInMinutes(delivery_in, delivery_out)
        }
        return { totalPickup, totalDelivery }
    }

    static calculateTimeDifferenceInMinutes = (timeIn, timeOut) => {
        try {
            const [inHours, inMinutes] = timeIn.split(':').map(t => Number(t));
            const [outHours, outMinutes] = timeOut.split(':').map(t => Number(t));

            const start = new Date();
            start.setHours(inHours, inMinutes, 0, 0);

            const end = new Date();
            end.setHours(outHours, outMinutes, 0, 0);

            if (end < start) {
                end.setDate(end.getDate() + 1);
            }

            const diffMs = end - start;
            const diffMinutes = diffMs / (1000 * 60);

            return diffMinutes;
        } catch (error) {
            return 0;
        }
    }

    static calculatePDTotalTimes = (pin, pout, din, dout) => {

        let total_pickup = 0
        let total_delivery = 0
        let total_time = 0

        if (pin && pout) {
            total_pickup = OrderEngine.calculateTimeDifferenceInMinutes(pin, pout)
        }
        if (din && dout) {
            total_delivery = OrderEngine.calculateTimeDifferenceInMinutes(din, dout)
        }
        total_time = total_pickup + total_delivery

        return { total_delivery, total_pickup, total_time }
    }


    static format_request = (data) => {
        let request =
        {
            user_id: data.user_id,
            order_number: data.order_number,
            create_date: data.create_date,
            terminal: data.terminal,
            quote: data.quote,
            is_crossdock: data.is_crossdock,
            order_entity: data.order_entity,
            order_status: data.order_status,
            internal_note: data.internal_note,

            customer_id: data.customer_id,

            reference_numbers: data.reference_numbers,
            caller: data.caller,

            shipper_id: data.shipper_id,
            shipper_email: data.shipper_email,
            shipper_suite: data.shipper_suite,
            shipper_contact_name: data.shipper_contact_name,
            shipper_phone_number: data.shipper_phone_number,
            shipper_special_instructions: data.shipper_special_instructions,

            extra_stop_name: data.extra_stop_name,
            extra_stop_email: data.extra_stop_email,
            extra_stop_contact_name: data.extra_stop_contact_name,
            extra_stop_phone_number: data.extra_stop_phone_number,
            extra_stop_address: data.extra_stop_address,
            extra_stop_suite: data.extra_stop_suite,
            extra_stop_city: data.extra_stop_city,
            extra_stop_province: data.extra_stop_province,
            extra_stop_postal_code: data.extra_stop_postal_code,
            extra_stop_special_instructions: data.extra_stop_special_instructions,

            receiver_id: data.receiver_id,
            receiver_email: data.receiver_email,
            receiver_contact_name: data.receiver_contact_name,
            receiver_phone_number: data.receiver_phone_number,
            receiver_suite: data.receiver_suite,
            receiver_special_instructions: data.receiver_special_instructions,

            pickup_date: data.pickup_date,
            pickup_time_from: data.pickup_time_from,
            pickup_time_to: data.pickup_time_to,
            pickup_driver_assigned: data.pickup_driver_assigned,
            pickup_terminal: data.pickup_terminal,
            pickup_appointment: data.pickup_appointment,
            pickup_appointment_numbers: data.pickup_appointment_numbers,

            interliner_id: data.interliner_id,
            interliner_special_instructions: data.interliner_special_instructions,
            interliner_charge_amount: data.interliner_charge_amount,
            interliner_invoice: data.interliner_invoice,

            interliner_pickup_id: data.interliner_pickup_id,
            interliner_pickup_special_instructions: data.interliner_pickup_special_instructions,
            interliner_pickup_charge_amount: data.interliner_pickup_charge_amount,
            interliner_pickup_invoice: data.interliner_pickup_invoice,

            interliner_delivery_id: data.interliner_delivery_id,
            interliner_delivery_special_instructions: data.interliner_delivery_special_instructions,
            interliner_delivery_charge_amount: data.interliner_delivery_charge_amount,
            interliner_delivery_invoice: data.interliner_delivery_invoice,

            delivery_date: data.delivery_date,
            delivery_time_from: data.delivery_time_from,
            delivery_time_to: data.delivery_time_to,
            delivery_driver_assigned: data.delivery_driver_assigned,
            delivery_terminal: data.delivery_terminal,
            delivery_appointment: data.delivery_appointment,
            delivery_appointment_numbers: data.delivery_appointment_numbers,

            service_type: data.service_type,
            freights: data.freights,

            is_manual_skid: data.is_manual_skid,
            total_pieces: data.total_pieces,
            total_pieces_skid: data.total_pieces_skid,
            total_actual_weight: data.total_actual_weight,
            total_volume_weight: data.total_volume_weight,
            total_chargeable_weight: data.total_chargeable_weight,
            total_weight_in_kg: data.total_weight_in_kg,

            no_charges: data.no_charges,
            manual_charges: data.manual_charges,
            manual_fuel_surcharges: data.manual_fuel_surcharges,
            freight_rate: data.freight_rate,
            freight_fuel_surcharge: data.freight_fuel_surcharge,

            direct_km: data.direct_km,
            customer_vehicle_types: OrderEngine.format_vehicle_types(data),
            customer_accessorials: OrderEngine.format_accessorials(data),
            additional_service_charges: data.additional_service_charges || [],
            sub_total: data.sub_total,
            provincial_tax: data.provincial_tax,
            federal_tax: data.federal_tax,
            grand_total: data.grand_total,

            pickup_in: data.pickup_in,
            pickup_out: data.pickup_out,
            pickup_at: data.pickup_at,
            delivery_in: data.delivery_in,
            delivery_out: data.delivery_out,
            delivery_at: data.delivery_at,
            pickup_signee: data.pickup_signee,
            delivery_signee: data.delivery_signee,
            billing_invoice_date: data.billing_invoice_date,
            billing_invoice: data.billing_invoice,
            billing_invoiced: data.billing_invoiced,
            total_pickup: data.total_pickup,
            total_delivery: data.total_delivery,
            total_time: data.total_time
        }
        Object.entries(request).forEach(([key, val]) => {
            if (val === '') request[key] = null
        })
        return request
    }

    static format_accessorials = (data) => {
        if (!data['customer_accessorials'] || data['customer_accessorials'].length === 0) return []
        const access = data.customer_accessorials.filter((a) => a.is_included).map((acc) => {
            return ({
                accessorial_id: acc.access_id,
                charge_amount: acc.charge_amount,
                charge_quantity: acc.charge_quantity
            })
        })
        return access
    }

    static format_vehicle_types = (data) => {
        if (!data['customer_vehicle_types'] || data['customer_vehicle_types'].length === 0) return []
        const vtypes = data.customer_vehicle_types.filter((v) => v.is_included).map((vt) => {
            return ({
                vehicle_type_id: vt.vehicle_id,
                amount: vt.amount
            })
        })
        return vtypes
    }

    static transformLoadedData = (data, defaultOrderValue) => {
        if (!data) return {}

        return {
            ...data,
            create_date: data.create_date ? moment(data.create_date).toISOString() : moment(new Date()).toISOString(),
            pickup_date: data.pickup_date ? moment(data.pickup_date).toISOString() : moment(new Date()).toISOString(),
            delivery_date: data.delivery_date ? moment(data.delivery_date).toISOString() : moment(new Date()).toISOString(),
            pickup_at: data.pickup_at ? moment(data.pickup_at).toISOString() : null,
            delivery_at: data.delivery_at ? moment(data.delivery_at).toISOString() : null,
            billing_invoice_date: data.billing_invoice_date ? moment(data.billing_invoice_date).toISOString() : moment(new Date()).toISOString(),

            pickup_in: data.pickup_in ? data.pickup_in : null,
            pickup_out: data.pickup_out ? (data.pickup_out.includes('T') ? moment(data.pickup_out).format('HH:mm') : data.pickup_out) : null,
            delivery_in: data.delivery_in ? (data.delivery_in.includes('T') ? moment(data.delivery_in).format('HH:mm') : data.delivery_in) : null,
            delivery_out: data.delivery_out ? (data.delivery_out.includes('T') ? moment(data.delivery_out).format('HH:mm') : data.delivery_out) : null,

            reference_numbers: data.reference_numbers || [],
            pickup_appointment_numbers: data.pickup_appointment_numbers || [],
            delivery_appointment_numbers: data.delivery_appointment_numbers || [],
            freights: data.freights && data.freights.length > 0 ? data.freights : defaultOrderValue.freights,
            accessorials_customer: data.accessorials_customer || [],
            vehicle_types_customer: data.vehicle_types_customer || [],
            additional_service_charges: data.additional_service_charges || [],

            quote: Boolean(data.quote),
            is_crossdock: Boolean(data.is_crossdock),
            is_extra_stop: Boolean(data.is_extra_stop),
            pickup_appointment: Boolean(data.pickup_appointment),
            delivery_appointment: Boolean(data.delivery_appointment),
            is_pickup: Boolean(data.is_pickup),
            is_delivery: Boolean(data.is_delivery),
            is_same_carrier: Boolean(data.is_same_carrier),
            is_manual_skid: Boolean(data.is_manual_skid),
            no_charges: Boolean(data.no_charges),
            manual_charges: Boolean(data.manual_charges),
            manual_fuel_surcharges: Boolean(data.manual_fuel_surcharges),
            billing_invoiced: Boolean(data.billing_invoiced),
            files: data.files || []
        }
    }

    static getOrderUpdates = (touchedFields, oldData, newData) => {
        const section_fields = {
            freights: ['total_pieces', 'total_actual_weight', 'total_pieces_skid', 'total_chargeable_weight', 'total_weight_in_kg', 'service_type', 'is_manual_skid'],
            freight_charges: ['sub_total', 'provincial_tax', 'federal_tax', 'grand_total', 'no_charges', 'manual_charges', 'manual_fuel_surcharges'],
        }

        let sections_changed = new Set()
        const fieldsTouched = Object.keys(touchedFields).filter(tf => tf !== 'freights' || tf !== 'customer_accessorials' || tf !== 'customer_vehicle_types' || tf !== 'additional_service_charges' || tf !== 'freight_rate' || tf !== 'freight_fuel_surcharge')

        for (let field of fieldsTouched) {
            if (!sections_changed.has(orderFields[field])) {
                let oldValue = oldData[field]
                let newValue = newData[field]
                if (typeof oldValue === 'object' || typeof newValue === 'object') {
                    oldValue = JSON.stringify(oldValue)
                    newValue = JSON.stringify(newValue)
                }
                if (oldValue !== newValue) {
                    if (orderFields[field]) sections_changed.add(orderFields[field])
                }
            }
        }
        for (let [section, fields] of Object.entries(section_fields)) {
            if (!sections_changed.has(section)) {
                for (let sfield of fields) {
                    let oldValue = oldData[sfield]
                    let newValue = newData[sfield]
                    if (oldValue !== newValue) {
                        sections_changed.add(section)
                        break
                    }
                }
            }
        }
        return Array.from(sections_changed)
    }
}

