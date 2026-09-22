import React, { useState, useCallback } from 'react';
import { Box, Typography, IconButton, CircularProgress, Collapse } from '@mui/material';
import { ExpandMoreRounded, DownloadRounded } from '@mui/icons-material';
import moment from 'moment';
import useStyles from './Driver.styles';
import { useBillingMutation } from '../../../hooks/useBillings';

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const DriverCommissionRegisterRow = React.memo(({ register }) => {

    console.log(register);
    const { classes, cx } = useStyles();
    const [expanded, setExpanded] = useState(false);
    const { downloadDriverCommissionPDF } = useBillingMutation()

    const handleToggle = useCallback(() => setExpanded((prev) => !prev), []);

    const handleDownload = async (e) => {
        e.preventDefault()
        e.stopPropagation();
        await downloadDriverCommissionPDF.mutateAsync(register.id)
    }

    return (
        <Box className={classes.dateCard}>
            <Box
                onClick={handleToggle}
                className={cx(classes.dateHeader, expanded && classes.commissionRegisterHeaderExpanded, classes.commissionRegisterHeader)}
                sx={{ flexDirection: { xs: 'column', lg: 'row' }, alignItems: { xs: 'stretch', lg: 'center' } }}
            >
                <Box className={classes.dateBlock} sx={{ order: { xs: 1, lg: 0 }, width: { xs: '100%', lg: 'auto' } }}>
                    <Box className={classes.dateIconWrap}>
                        {register.invoice_number}
                    </Box>
                    <Box>
                        <Typography className={classes.dateTitle}>
                            {register.driver_name}
                        </Typography>
                        <Box className={classes.registeredRowMetaLine}>
                            <span style={{ fontWeight: 600, opacity: 0.6, fontSize: 14 }}># {register.driver_number}</span>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', lg: 'flex-start' }, gap: { xs: 2, lg: 8 }, order: { xs: 2, lg: 0 }, width: { xs: '100%', lg: 'auto' } }}>
                    <Box>
                        <Typography className={classes.commissionMetaLabel}>Batch #</Typography>
                        <Typography className={classes.commissionMetaValue}>{register.batch_number || '-'}</Typography>
                    </Box>
                    <Box>
                        <Typography className={classes.commissionMetaLabel}>Pay Date</Typography>
                        <Typography className={classes.commissionMetaValue}>{moment(register.pay_date).format('MMM D, YYYY')}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', lg: 'flex-start' }, gap: { xs: 2, lg: 8 }, order: { xs: 3, lg: 0 }, width: { xs: '100%', lg: 'auto' } }}>
                    <Box>
                        <Typography className={classes.commissionMetaLabel}>Issued</Typography>
                        <Typography className={classes.commissionMetaValue}>{moment(register.issued_at).format('MMM D, YYYY')}</Typography>
                    </Box>
                    <Box>
                        <Typography className={classes.commissionMetaLabel}>Due</Typography>
                        <Typography className={classes.commissionMetaValue}>{moment(register.due_at).format('MMM D, YYYY')}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'space-between', lg: 'flex-start' }, alignItems: 'center', gap: { xs: 2, lg: 3 }, order: { xs: 4, lg: 0 }, width: { xs: '100%', lg: 'auto' } }}>
                    <Box className={classes.totalPayBlock}>
                        <Typography className={classes.totalPayLabel}>Total Pay</Typography>
                        <Typography className={classes.totalPayValue}>{money(register.total_pay)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={handleDownload} disabled={downloadDriverCommissionPDF.isPending} title="Re-download PDF">
                            {downloadDriverCommissionPDF.isPending ? <CircularProgress size={18} /> : <DownloadRounded sx={{ fontSize: 25 }} />}
                        </IconButton>
                        <Box className={cx(classes.commissionToggleIcon, expanded && classes.commissionToggleIconOpen)}>
                            <ExpandMoreRounded sx={{ fontSize: 20 }} />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box className={classes.commissionBody}>
                    {register.driver_pay_commission_totals.map((total) => (
                        <Box key={total.id} className={classes.commissionDateBlock}>
                            <Box className={classes.commissionDateBlockHeader}>
                                <Typography className={classes.commissionDateLabel}>
                                    {moment(total.date).format('dddd, MMM D YYYY')}
                                </Typography>
                                <Typography className={classes.commissionDateTotal}>
                                    {money(total.total_pay)}
                                </Typography>
                            </Box>
                            <Box className={classes.tableScroll}>
                                <Box className={classes.tableInner}>
                                    <Box className={classes.tableHead} sx={{ display: 'flex' }}>
                                        <Box sx={{ flex: '0 0 110px' }}>Order #</Box>
                                        <Box sx={{ flex: 1 }}>Shipper</Box>
                                        <Box sx={{ flex: 1 }}>Receiver</Box>
                                        <Box sx={{ flex: '0 0 90px' }}>Dispatch Type</Box>
                                    </Box>
                                    {total.driver_pays.map((dp, idx) => (
                                        <Box
                                            key={`${dp.order_number}-${idx}`}
                                            className={cx(classes.tableRow, idx % 2 === 0 ? classes.rowEven : classes.rowOdd)}
                                            sx={{ display: 'flex' }}
                                        >
                                            <Box sx={{ flex: '0 0 110px' }}>
                                                <Typography className={classes.orderNumber}>#{dp.order_number}</Typography>
                                            </Box>
                                            <Box className={classes.partyCell} sx={{ flex: 1 }}>
                                                <Typography className={classes.routeName}>{dp.shipper_name}</Typography>
                                                <Typography className={classes.routeAddress}>{dp.shipper_address}</Typography>
                                            </Box>
                                            <Box className={classes.partyCell} sx={{ flex: 1 }}>
                                                <Typography className={classes.routeName}>{dp.receiver_name}</Typography>
                                                <Typography className={classes.routeAddress}>{dp.receiver_address}</Typography>
                                            </Box>
                                            <Box className={classes.cellCenter} sx={{ flex: '0 0 90px' }}>
                                                <Typography className={classes.numCell} sx={{ textTransform: 'capitalize' }}>{dp.leg_type}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
});

DriverCommissionRegisterRow.displayName = 'DriverCommissionRegisterRow';
export default DriverCommissionRegisterRow;