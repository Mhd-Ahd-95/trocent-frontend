

export const money = (n) => `$${Number(n || 0).toFixed(2)}`;

export const computeDriverPay = (pickupDriver, deliveryDriver, subTotal, fuelSurcharge, interliners) => {
    const isPickupDriver = Boolean(pickupDriver);
    const isDeliveryDriver = Boolean(deliveryDriver);

    if (!isPickupDriver && !isDeliveryDriver) return { pickupAmount: null, deliveryAmount: null };
    if (pickupDriver?.driver_pay_type !== 'commission' && deliveryDriver?.driver_pay_type !== 'commission') {
        return { pickupAmount: null, deliveryAmount: null };
    }

    const base = (subTotal || 0) - (fuelSurcharge || 0);

    if (!isPickupDriver && isDeliveryDriver) {
        if (deliveryDriver.driver_pay_type === 'commission' && deliveryDriver.commission_percentage > 0) {
            const pickupInterlinerAmount = interliners?.find(i => i.type === 'pickup')?.charge_amount ?? 0;
            return { pickupAmount: null, deliveryAmount: (base - pickupInterlinerAmount) * (deliveryDriver.commission_percentage / 100) };
        }
        return { pickupAmount: null, deliveryAmount: 0 };
    }

    if (isPickupDriver && !isDeliveryDriver) {
        if (pickupDriver.driver_pay_type === 'commission' && pickupDriver.commission_percentage > 0) {
            const deliveryInterlinerAmount = interliners?.find(i => i.type === 'delivery')?.charge_amount ?? 0;
            return { pickupAmount: (base - deliveryInterlinerAmount) * (pickupDriver.commission_percentage / 100), deliveryAmount: null };
        }
        return { pickupAmount: 0, deliveryAmount: null };
    }

    if (pickupDriver.id === deliveryDriver.id) {
        if (pickupDriver.driver_pay_type === 'commission' && pickupDriver.commission_percentage > 0) {
            const amount = base * (pickupDriver.commission_percentage / 100);
            return { pickupAmount: amount, deliveryAmount: amount };
        }
        return { pickupAmount: 0, deliveryAmount: 0 };
    }

    let pickupAmount = 0, deliveryAmount = 0;
    if (pickupDriver.driver_pay_type === 'commission' && pickupDriver.commission_percentage > 0) {
        pickupAmount = base * (pickupDriver.commission_percentage / 100);
    }
    if (deliveryDriver.driver_pay_type === 'commission' && deliveryDriver.commission_percentage > 0) {
        deliveryAmount = base * (deliveryDriver.commission_percentage / 100);
    }
    return { pickupAmount, deliveryAmount };
};

export const accessorialsTotal = (accessorials = []) => accessorials.reduce((sum, a) => sum + Number(a.charge_quantity || 0) * Number(a.charge_amount || 0), 0);

export const interlinersTotal = (interliners = []) => interliners.reduce((sum, i) => sum + Number(i.charge_amount || 0), 0);