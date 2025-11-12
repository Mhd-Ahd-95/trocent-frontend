import RateSheetsApi from "../../apis/RateSheets.api"
import FuelSurchargeAPI from '../../apis/FuelSurcharges.api'
import moment from "moment"

export default class OrderEngine {

    static INCH_TO_CM = 2.54
    static CM_TO_INCH = 0.393701
    static LBS_TO_KG = 0.45359237
    static KG_TO_LBS = 2.20462

    constructor(enqueueSnackbar) {
        this.enqueueSnackbar = enqueueSnackbar
        this.request = {}
        this.context = {}
        this.customerRateSheets = []
        this.fuelSurchargeByDate = null
        let currentDate = moment(new Date())
        if (!this.fuelSurchargeByDate) {
            this.get_fuel_surcharge_by_date(currentDate.toISOString())
        }
    }

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
    set freight_rate(fr) { this.request['freight_rate'] = fr }
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

        return this.context['freight_rate']
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

        // if (rate === 0) rate = this.fetchRateFromSheets(type, value, destination_city, source_city)

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

        if (!secondSheet) return firstRate

        const secondRate = this.getRateFromSheet(secondSheet, value, type, isSkidByWeight)

        return Math.max(firstRate, secondRate)
    }


    getRateFromSheet = (sheet, value, type, isSkidByWeight) => {
        if (type === 'skid' && !isSkidByWeight) {
            const bracket = sheet.brackets.find(b => String(b.rate_bracket) === String(Math.round(value)))
            return bracket ? Number(bracket.rate) : 0
        } else {
            const bracketName = this.getWeightBracket(value, isSkidByWeight)
            let bracket
            if (bracketName === 'ltl_rate') {
                bracket = { rate: sheet[bracketName] }
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

        if (allBrackets.length === 0) return 'ltl_rate'

        if (weight < allBrackets[0]) return 'ltl_rate'

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

    calculateFuelSurcharge = () => {

        if (this.context['no_charge']) return

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

    get_customer_rate_sheet = async (cid) => {
        try {
            const res = await RateSheetsApi.loadRateSheetsByCustomerAndType(Number(cid))
            this.customerRateSheets = res.data
        } catch (error) {
            console.error('Failed to load rate sheets:', error)
            this.enqueueSnackbar('Failed to load rate sheets', { variant: 'error' })
            this.customerRateSheets = []
        }
    }

    get_fuel_surcharge_by_date = async (odate) => {
        try {
            const res = await FuelSurchargeAPI.getFuelSurchargeByDate(odate)
            this.fuelSurchargeByDate = res.data.data
        }
        catch {
            console.error('Failed to load fuel surcharge:', error)
            this.enqueueSnackbar('Failed to load fuel surcharge', { variant: 'error' })
            this.fuelSurchargeByDate = null
        }
    }

    static accessorials_types = (type, access, frate, qty) => {

        // if (type === 'unknown'){
        //     return Number(access['charge_amount'])
        // }

        let calculated_amount = 0
        const amount = Number(access['amount']) || 0
        const amountType = access['amount_type'] || ''
        const timeUnit = access['time_unit']
        let freeTime = access['free_time'] ? Number(access['free_time']) : 0
        frate = Number(frate)
        const min = access['min'] ? Number(access['min']) : 0
        const max = access['max'] ? Number(access['max']) : 0

        switch (type) {
            case 'fixed_price':
                calculated_amount = amount
                break
            case 'fuel_based':
                if (amountType === 'percentage') calculated_amount = (amount / 100) * frate
                else calculated_amount = amount * frate
                break
            case 'time_based':
                if (timeUnit !== 'minute') freeTime = freeTime * 60
                calculated_amount = amount
                break
            case 'transport_based':
                if (amountType === 'percentage') calculated_amount = (amount / 100) * frate
                else calculated_amount = amount * frate
                break
            case 'product_base':
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
}