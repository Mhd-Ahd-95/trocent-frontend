import React from 'react';
import { Box, Checkbox, Typography } from '@mui/material';
import { CheckCircleRounded, ErrorRounded } from '@mui/icons-material';
import moment from 'moment';
import useStyles from './Driver.styles';

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const RegisteredPaymentRow = React.memo(({ row, selected, onToggleSelect }) => {

    const { classes, cx } = useStyles();
    const isUnregistered = row.email_status === 'unregistered';

    const handleToggle = () => onToggleSelect(row.id);

    return (
        <Box className={classes.registeredRowScroll}>
            <Box className={cx(classes.registeredRow, isUnregistered ? classes.registeredRowUnregistered : classes.registeredRowRegistered, selected && classes.registeredRowSelected)}>
                <Box className={classes.registeredRowLeft}>
                    <Box onClick={(e) => e.stopPropagation()} className={classes.registeredRowCheckbox}>
                        <Checkbox checked={selected} onChange={handleToggle} size="small" />
                    </Box>

                    <Box className={classes.registeredRowIdentity}>
                        <Typography className={classes.registeredRowCompany}>{row.company_name}</Typography>
                        <Box className={classes.registeredRowMetaLine}>
                            <span># INVOICE: {row.invoice_number}</span>
                            {row.batch_number != null && <span>· # BATCH: {row.batch_number}</span>}
                        </Box>
                    </Box>
                </Box>

                <Box className={classes.registeredRowGroups}>
                    <Box className={classes.registeredRowDates}>
                        <Box className={classes.registeredRowDateBlock}>
                            <Typography className={classes.registeredRowDateLabel}>Issued</Typography>
                            <Typography className={classes.registeredRowDateValue}>{moment(row.issued_at).format('MMM D, YYYY')}</Typography>
                        </Box>
                        <Box className={classes.registeredRowDateBlock}>
                            <Typography className={classes.registeredRowDateLabel}>Due</Typography>
                            <Typography className={classes.registeredRowDateValue}>{moment(row.due_at).format('MMM D, YYYY')}</Typography>
                        </Box>
                    </Box>

                    <Box className={classes.registeredRowFinancials}>
                        <Box className={classes.registeredRowDateBlock}>
                            <Typography className={classes.registeredRowDateLabel}>Driver Pay</Typography>
                            <Typography className={classes.registeredRowDateValue}>{money(row.total_driver_amount)}</Typography>
                        </Box>
                        <Box className={classes.registeredRowDateBlock}>
                            <Typography className={classes.registeredRowDateLabel}>Extra Charges</Typography>
                            <Typography className={classes.registeredRowDateValue}>{money(row.extra_charge)}</Typography>
                        </Box>
                        <Box className={classes.registeredRowDateBlock}>
                            <Typography className={classes.registeredRowDateLabel} sx={{ fontWeight: 'bold', fontSize: 26 }}>Total</Typography>
                            <Typography className={classes.registeredRowTotalValue}>{money(row.total_pay)}</Typography>
                        </Box>
                    </Box>

                    <Box className={classes.registeredRowStatus}>
                        {isUnregistered ? (
                            <Box className={classes.statusBadgeUnregistered}>
                                <Box className={classes.pulseDotWrap}>
                                    <Box className={classes.pulseDotCore} />
                                    <Box className={classes.pulseDotRing} />
                                </Box>
                                Failed to Send
                            </Box>
                        ) : (
                            <Box className={classes.statusBadgeRegistered}>
                                <CheckCircleRounded sx={{ fontSize: 15 }} />
                                Sent
                            </Box>
                        )}
                        {row.email_error && (
                            <Box className={classes.registeredRowErrorNote} title={row.email_error}>
                                <ErrorRounded sx={{ fontSize: 12 }} />
                                {row.email_error}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});

RegisteredPaymentRow.displayName = 'RegisteredPaymentRow';
export default RegisteredPaymentRow;