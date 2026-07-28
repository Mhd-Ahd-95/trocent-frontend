import React, { useState, useMemo, useCallback } from "react";
import { Box, Checkbox, Button, Table, TableHead, TableBody, TableRow, TableCell, Chip, Tooltip, } from "@mui/material";
import useStyles from './Invoicing.styles';
import moment from 'moment';

const STATUS_BADGE_CLASS_MAP = { green: 'statusBadgeGreen', orange: 'statusBadgeOrange', red: 'statusBadgeRed' };
const DOT_CLASS_MAP = { green: 'statusDotGreen', orange: 'statusDotOrange', red: 'statusDotRed' };


const getBillingStatus = (order, invoicingFrequency) => {

    if (!order.approved_date || !invoicingFrequency) return null;
    const approved = new Date(`${order.approved_date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    approved.setHours(0, 0, 0, 0);
    const daysSince = Math.floor((today - approved) / 86400000);

    if (invoicingFrequency === 'daily') {
        return daysSince >= 0 ? { color: 'green', label: 'Approved — ready to bill (daily)' } : null;
    }
    if (invoicingFrequency === 'weekly') {
        return daysSince >= 7 ? { color: 'green', label: 'Weekly cycle complete — ready to bill' } : { color: 'orange', label: `Bills in ${7 - daysSince} day${7 - daysSince === 1 ? '' : 's'} (weekly)` };
    }
    if (invoicingFrequency === 'monthly') {
        return daysSince >= 30 ? { color: 'green', label: 'Monthly cycle complete — ready to bill' } : { color: 'red', label: `Bills in ${30 - daysSince} day${30 - daysSince === 1 ? '' : 's'} (monthly)` };
    }
    return null;
};

const BillingStatusBadge = React.memo(({ status, classes, cx }) => {
    if (!status) return null;
    return (
        <Tooltip title={status.label} arrow placement="top">
            <span className={cx(classes.statusBadge, classes[STATUS_BADGE_CLASS_MAP[status.color]])}>
                <span
                    className={cx(
                        classes.statusDot,
                        classes[DOT_CLASS_MAP[status.color]],
                        status.color === 'green' && classes.statusDotPulsing
                    )}
                />
                {status.shortLabel}
            </span>
        </Tooltip>
    );
});
BillingStatusBadge.displayName = 'BillingStatusBadge';

const formatMoney = (value) => `$${Number(value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return moment.utc(dateStr).format('ddd, DD/MM/YYYY')
};

const TotalRow = React.memo(({ orders, classes, cx }) => {
    
    const totals = useMemo(() => orders.reduce((acc, o) => {
        acc.freight += Number(o.freight_rate ?? 0);
        acc.fuel += Number(o.freight_fuel_surcharge ?? 0);
        acc.accessorial += Number(o.accessorials ?? 0);
        acc.subTotal += Number(o.sub_total ?? 0);
        acc.grandTotal += Number(o.grand_total ?? 0);
        return acc;
    }, { freight: 0, fuel: 0, accessorial: 0, subTotal: 0, grandTotal: 0 }), [orders]);

    return (
        <TableRow className={cx(classes.bodyTotalRow)}>
            <TableCell className={cx(classes.bodyCell, classes.colCheckbox)}></TableCell>
            <TableCell className={cx(classes.bodyCell, classes.total)}>Totals:</TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colReferences)}></TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colDeliveryDate)}></TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colFromCity)}></TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colToCity)}></TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colFreightCharge, classes.cellMoney)}>
                <span className={classes.cellTotalValue}>{formatMoney(totals.freight)}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colFuelSurcharge, classes.cellMoney)}>
                <span className={classes.cellTotalValue}>{formatMoney(totals.fuel)}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colAccessorial, classes.cellMoney)}>
                <span className={classes.cellTotalValue}>{formatMoney(totals.accessorial)}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colSubTotal, classes.cellMoney)}>
                <span className={classes.cellTotalValue}>{formatMoney(totals.subTotal)}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colTotal, classes.cellMoney)} color="primary">
                <span className={classes.celltotalValue}>{formatMoney(totals.grandTotal)}</span>
            </TableCell>
        </TableRow>
    );
});

const OrderRow = React.memo(({ order, selected, onToggleSelect, classes, cx, index, customerInvoicing }) => {

    const billingStatus = getBillingStatus(order, customerInvoicing);

    const handleOrderClick = (e) => {
        e.preventDefault();
        window.open(`/orders/edit/${order.id}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <TableRow className={cx(classes.bodyRow, selected && classes.bodyRowSelected, index % 2 === 0 && classes.rowColor)}>
            <TableCell className={cx(classes.bodyCell, classes.colCheckbox)}>
                <Checkbox
                    size="small"
                    checked={!!selected}
                    onChange={() => onToggleSelect(order.id)}
                    onClick={(e) => e.stopPropagation()}
                    className={classes.rowCheckbox}
                />
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colOrderNumber)}>
                <Box className={classes.orderNumberRow}>
                    <a href={`/orders/edit/${order.order_id}`} onClick={handleOrderClick} className={classes.orderNumberLink}>
                        # {order.order_number}
                    </a>
                    {billingStatus && (
                        <Tooltip title={billingStatus.label} arrow placement="top">
                            <span className={cx(classes.statusDot, classes[DOT_CLASS_MAP[billingStatus.color]], billingStatus.color === 'green' && classes.statusDotPulsing)} />
                        </Tooltip>
                    )}
                </Box>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colReferences)}>
                <span className={classes.cellValueWrap}>{order.references?.join(', ') || '—'}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colDeliveryDate)}>
                <span className={classes.cellValue}>{formatDate(order.delivery_date)}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colFromCity)}>
                <span className={classes.cityValue}>{order.shipper_city}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colToCity)}>
                <span className={classes.cityValue}>{order.receiver_city}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colFreightCharge, classes.cellMoney)}>
                <span className={classes.cellValue}>{formatMoney(order.freight_rate)}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colFuelSurcharge, classes.cellMoney)}>
                <span className={classes.cellValue}>{formatMoney(order.freight_fuel_surcharge)}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colAccessorial, classes.cellMoney)}>
                <span className={classes.cellValue}>{formatMoney(order.accessorials)}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colSubTotal, classes.cellMoney)}>
                <span className={classes.cellValueStrong}>{formatMoney(order.sub_total)}</span>
            </TableCell>
            <TableCell className={cx(classes.bodyCell, classes.colTotal, classes.cellMoney)}>
                <span className={classes.totalValue}>{formatMoney(order.grand_total)}</span>
            </TableCell>
        </TableRow>
    );
}, (prev, next) => prev.order === next.order && prev.selected === next.selected && prev.onToggleSelect === next.onToggleSelect);
OrderRow.displayName = 'OrderRow';


const OrderInvoicingCard = React.memo(({ orders, customerInvoicing }) => {

    const { classes, cx } = useStyles();
    const [selectedIds, setSelectedIds] = useState(() => new Set());

    const onToggleSelect = useCallback((id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const allSelected = orders.length > 0 && orders.every(o => selectedIds.has(o.id));
    const someSelected = orders.some(o => selectedIds.has(o.id));
    const selectedCount = useMemo(() => orders.filter(o => selectedIds.has(o.id)).length, [orders, selectedIds]);

    const onToggleSelectAll = useCallback(() => {
        setSelectedIds(prev => {
            const willSelectAll = !(orders.length > 0 && orders.every(o => prev.has(o.id)));
            return willSelectAll ? new Set(orders.map(o => o.id)) : new Set();
        });
    }, [orders]);

    const handleSubmitInvoice = () => {
        const selectedOrders = orders.filter(o => selectedIds.has(o.id));
        console.log('Submitting invoice for orders:', selectedOrders);
    };

    return (
        <Box className={classes.orderTableWrap}>
            <Box className={classes.tableScroll}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow className={classes.headerRow}>
                            <TableCell className={cx(classes.headerCell, classes.colCheckbox)}>
                                <Checkbox size="small" checked={allSelected} indeterminate={someSelected && !allSelected} onChange={onToggleSelectAll} className={classes.rowCheckbox} />
                            </TableCell>
                            <TableCell className={cx(classes.headerCell, classes.colOrderNumber)}>Order Number</TableCell>
                            <TableCell className={cx(classes.headerCell, classes.colReferences)}>References</TableCell>
                            <TableCell className={cx(classes.headerCell, classes.colDeliveryDate)}>Delivery Date</TableCell>
                            <TableCell className={cx(classes.headerCell, classes.colFromCity)}>From City</TableCell>
                            <TableCell className={cx(classes.headerCell, classes.colToCity)}>To City</TableCell>
                            <TableCell className={cx(classes.headerCell, classes.colFreightCharge, classes.headerMoney)}>Freight Charge</TableCell>
                            <TableCell className={cx(classes.headerCell, classes.colFuelSurcharge, classes.headerMoney)}>Fuel Surcharge</TableCell>
                            <TableCell className={cx(classes.headerCell, classes.colAccessorial, classes.headerMoney)}>Accessorial</TableCell>
                            <TableCell className={cx(classes.headerCell, classes.colSubTotal, classes.headerMoney)}>Sub Total</TableCell>
                            <TableCell className={cx(classes.headerCell, classes.colTotal, classes.headerMoney)}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order, index) => (
                            <OrderRow
                                index={index}
                                key={order.order_id}
                                order={order}
                                selected={selectedIds.has(order.id)}
                                onToggleSelect={onToggleSelect}
                                classes={classes}
                                cx={cx}
                                customerInvoicing={customerInvoicing}
                            />
                        ))}
                        <TotalRow orders={orders} classes={classes} cx={cx} />
                    </TableBody>
                </Table>
            </Box>
            <Box className={classes.submitBar}>
                <span className={classes.selectionHint}>
                    {selectedCount > 0 ? `${selectedCount} order${selectedCount > 1 ? 's' : ''} selected` : 'No orders selected'}
                </span>
                <Button variant="contained" color="primary" className={classes.submitButton} disabled={selectedCount === 0} onClick={handleSubmitInvoice}>
                    Submit Invoice
                </Button>
            </Box>
        </Box>
    );
});

OrderInvoicingCard.displayName = 'OrderInvoicingCard';
export default OrderInvoicingCard;