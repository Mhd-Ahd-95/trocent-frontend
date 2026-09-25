import React, { useMemo } from 'react';
import { Box, Button, Chip, CircularProgress, Grid, Tooltip, Typography } from '@mui/material';
import { PictureAsPdfRounded, ArrowForwardRounded, CalendarMonthRounded, } from '@mui/icons-material';
import moment from 'moment';
import useStyles from './Driver.styles';
import { useBillingMutation } from '../../../hooks/useBillings';

const LEG_TYPE_CONFIG = {
    pickup: { label: 'Pickup', short: 'P', color: 'info' },
    delivery: { label: 'Delivery', short: 'D', color: 'warning' },
    both: { label: 'Pickup & Delivery', short: 'P / D', color: 'success' },
};

const formatMoney = (value) => Number(value ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function DriverTotals({ totals = [], driver_id }) {

    const { classes, cx } = useStyles();
    const driverCommissionIds = useMemo(() => totals.map((t) => t.commission_total_id), [totals]);
    const { driverPayCommissionRegisterAndDownloadPDF } = useBillingMutation()

    const handleGeneratePDF = async () => {
        const payload = {
            driver_id,
            driver_commission_ids: driverCommissionIds
        }
        await driverPayCommissionRegisterAndDownloadPDF.mutateAsync(payload)
    };

    const total = useMemo(() => totals.reduce((acc, curr) => acc = acc + curr.total_pay, 0)) ?? 0

    return (
        <Box className={classes.totalsRoot}>
            <Box className={classes.totalsToolbar}>
                <Box className={classes.totalsBox}>
                    <Typography className={classes.totals}>Totals: </Typography>
                    <Typography className={classes.totalsValue}>{formatMoney(total)}</Typography>
                </Box>
                <Button
                    variant="contained"
                    size='large'
                    startIcon={driverPayCommissionRegisterAndDownloadPDF.isPending ? <CircularProgress size={'18px'} /> : <PictureAsPdfRounded />}
                    onClick={handleGeneratePDF}
                    disabled={driverPayCommissionRegisterAndDownloadPDF.isPending}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                >
                    {driverPayCommissionRegisterAndDownloadPDF.isPending ? 'Generating...' : 'Generate PDF'}
                </Button>
            </Box>
            {totals.map((total) => (
                <Box key={total.commission_total_id} className={classes.dateCard}>
                    <Box className={classes.dateHeader}>
                        <Box className={classes.dateBlock}>
                            <Box className={classes.dateIconWrap}>
                                <CalendarMonthRounded fontSize="small" />
                            </Box>
                            <Box>
                                <Typography className={classes.dateTitle}>
                                    {moment(total.date).format('dddd, MMM D, YYYY')}
                                </Typography>
                                <Typography className={classes.dateSub}>
                                    {total.driver_pays.length} {total.driver_pays.length === 1 ? 'order' : 'orders'}
                                </Typography>
                            </Box>
                        </Box>
                        <Box className={classes.totalPayBlock}>
                            <Typography className={classes.totalPayLabel}>Total Pay</Typography>
                            <Typography className={classes.totalPayValue}>
                                {formatMoney(total.total_pay)}
                            </Typography>
                        </Box>
                    </Box>
                    <Box className={classes.tableScroll}>
                        <Box className={classes.tableInner}>
                            <Grid container columns={24} columnSpacing={1.5} alignItems="center" className={classes.tableHead}>
                                <Grid size={2.5}>Order #</Grid>
                                <Grid size={14}>
                                    <Grid container spacing={2}>
                                        <Grid size={5}>
                                            Shipper
                                        </Grid>
                                        <Grid size={2}></Grid>
                                        <Grid size={5}>Receiver</Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={2.5} className={classes.cellCenter}>Pieces</Grid>
                                <Grid size={2.5} className={classes.cellCenter}>Weight</Grid>
                                <Grid size={2.5} className={classes.cellCenter}>Dispatch Type</Grid>
                            </Grid>
                            {total.driver_pays.map((pay, index) => {
                                const leg = LEG_TYPE_CONFIG[pay.leg_type] ?? {
                                    label: pay.leg_type,
                                    short: pay.leg_type,
                                    color: 'default',
                                };
                                return (
                                    <Grid key={pay.driver_pay_id} container columns={24} columnSpacing={1.5} alignItems="center" className={cx(classes.tableRow, index % 2 === 0 ? classes.rowEven : classes.rowOdd)}>
                                        <Grid size={2.5} className={classes.orderNumber}>
                                            # {pay.order_number}
                                        </Grid>
                                        <Grid size={14}>
                                            <Grid container>
                                                <Grid size={5}>
                                                    <Typography className={classes.routeName}>{pay.shipper_name}</Typography>
                                                    <Typography className={classes.routeAddress}>{pay.shipper_address}</Typography>
                                                </Grid>
                                                <Grid size={2}>
                                                    <Box className={classes.routeArrow}>
                                                        <ArrowForwardRounded fontSize="small" />
                                                    </Box>
                                                </Grid>
                                                <Grid size={5}>
                                                    <Typography className={classes.routeName}>{pay.receiver_name}</Typography>
                                                    <Typography className={classes.routeAddress}>{pay.receiver_address}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid size={2.5} className={cx(classes.cellCenter, classes.numCell)}>
                                            {pay.total_pieces}
                                        </Grid>
                                        <Grid size={2.5} className={cx(classes.cellCenter, classes.numCell)}>
                                            {pay.total_actual_weight} {pay.unit}
                                        </Grid>
                                        <Grid size={2.5} className={classes.cellCenter}>
                                            <Tooltip title={leg.label} arrow>
                                                <Chip
                                                    size="small"
                                                    color={leg.color}
                                                    variant="outlined"
                                                    label={leg.short}
                                                    sx={{ fontWeight: 800, fontSize: 12, minWidth: 40 }}
                                                />
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default React.memo(DriverTotals);