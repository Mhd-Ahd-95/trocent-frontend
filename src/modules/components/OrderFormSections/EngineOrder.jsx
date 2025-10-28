

export default class EngineOrder {

    static INCH_TO_CM = 2.54
    static CM_TO_INCH = 0.393701

    static calculateVolumeWeight = (freight) => {

        let volumeWeight = 0
        let pieces = freight.pieces ?? 1
        let length = freight.length ?? 0
        let width = freight.width ?? 0
        let height = freight.height ?? 0
        let dimUnit = freight.dim_unit ?? 'in'
        let weightUnit = freight.unit ?? 'lbs'
        let hasConversation = freight.is_converted ?? false
        let notStacked = freight.not_stack ?? false
        let weight = freight.weight ?? 0

        if (hasConversation) {
            // convert from cm to inch
            if (weightUnit === 'kg' && dimUnit === 'cm') {
                length = Number(length) * EngineOrder.CM_TO_INCH
                width = Number(width) * EngineOrder.CM_TO_INCH
                height = Number(height) * EngineOrder.CM_TO_INCH
                dimUnit = 'in'
            }
            // convert from in to cm
            else if (weightUnit === 'lbs' && dimUnit === 'in') {
                length = Number(length) * EngineOrder.INCH_TO_CM
                width = Number(width) * EngineOrder.INCH_TO_CM
                height = Number(height) * EngineOrder.INCH_TO_CM
                dimUnit = 'cm'
            }
        }

        if (notStacked) {
            if (dimUnit === 'cm') height = 102 / 0.393701
            else height = 102
        }

        if (dimUnit === 'in') volumeWeight = Number(pieces) * ((Number(length) * Number(width) * Number(height)) / 172)
        else volumeWeight = Number(pieces) * ((Number(length) * Number(width) * Number(height)) / 6000)

        return volumeWeight
    }

}