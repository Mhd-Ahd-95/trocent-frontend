import React, { memo } from "react";
import { Box, Checkbox, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { ReceiptLongRounded, Inventory2Rounded, SendRounded } from "@mui/icons-material";
import useStyles from "./Billing.styles";
import moment from "moment";

const money = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

const Amount = ({ label, value, classes, date }) => (
    <Box>
        <Typography className={classes.amountLabel}>{label}</Typography>
        <Typography className={classes.amountValue}>{date ? value : money.format(value ?? 0)}</Typography>
    </Box>
);

function BillingRowCard({ row, selected, onToggle, onResend, audit, disabled }) {

    const { classes, cx } = useStyles();
    const isSummary = row.type === "summary";
    const ordersCount = row.order_ids?.length ?? 0;

    return (
        <Box className={cx(classes.card, selected && classes.cardSelected)} onClick={() => onToggle?.(row)}>
            <Checkbox
                checked={selected}
                size="small"
                onClick={(e) => e.stopPropagation()}
                onChange={() => onToggle?.(row)}
            />
            <Box className={cx(classes.cardIcon, isSummary && classes.cardIconSummary)}>
                {isSummary ? <Inventory2Rounded /> : <ReceiptLongRounded />}
            </Box>
            <Box className={classes.cardMain}>
                <Typography className={classes.cardTitle}>{row.customer_name}</Typography>
                <Box className={classes.cardTitleRow}>
                    <Typography className={classes.cardSub}>
                        #{row.customer_number}
                    </Typography>
                    {isSummary && (
                        <Chip
                            size="small"
                            color="secondary"
                            variant="outlined"
                            label={`SM · ${ordersCount} order${ordersCount === 1 ? "" : "s"}`}
                        />
                    )}
                </Box>
            </Box>
            <Box className={cx(classes.cardAmounts, audit && classes.cardAmountsAudit)}>
                <Amount classes={classes} label="#Order" date value={row.order_number} />
                {audit && <Amount classes={classes} label="#Audit" date value={row.audit_number ?? "—"} />}
                <Amount classes={classes} label="Invoice Date" date value={row.billing_invoice_date ? moment(row.billing_invoice_date).format('YYYY-MM-DD') : "—"} />
                <Amount classes={classes} label="Subtotal" value={row.sub_total} />
                <Amount classes={classes} label="Federal tax" value={row.federal_tax} />
                <Amount classes={classes} label="Provincial tax" value={row.provincial_tax} />
            </Box>
            <Box className={classes.cardTotal}>
                <Typography className={classes.amountLabel}>Grand total</Typography>
                <Typography className={classes.cardTotalValue}>{money.format(row.grand_total ?? 0)}</Typography>
            </Box>
            {onResend && (
                <Tooltip title="Re-send invoice">
                    <IconButton
                        size="small"
                        color="primary"
                        disabled={disabled}
                        className={classes.cardAction}
                        onClick={(e) => {
                            e.stopPropagation();
                            onResend(e, row);
                        }}
                    >
                        <SendRounded fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
}

export default memo(BillingRowCard);