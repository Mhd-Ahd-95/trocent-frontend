import React from "react";
import { Grid, Box, Paper, Typography, TextField, InputAdornment, Chip } from "@mui/material";
import { LocalShippingRounded, ArrowUpwardRounded, ArrowDownwardRounded, SwapVertRounded } from "@mui/icons-material";
import { SubmitButton } from "../../components";
import { useBillingMutation } from "../../hooks/useBillings";

const TYPE_META = {
    both: { label: "Pickup & Delivery", icon: <SwapVertRounded sx={{ fontSize: 14 }} />, color: "#6366F1" },
    pickup: { label: "Pickup", icon: <ArrowUpwardRounded sx={{ fontSize: 14 }} />, color: "#0EA5E9" },
    delivery: { label: "Delivery", icon: <ArrowDownwardRounded sx={{ fontSize: 14 }} />, color: "#F97316" },
};

function InterlinerCharge(props) {

    const { order, onClose } = props
    const interliners = order?.interliners || []

    const bothInterliner = interliners.find((i) => i.type === 'both')
    const displayInterliners = bothInterliner ? [bothInterliner] : interliners
    const { updateInterlinerAmounts } = useBillingMutation()

    const [amounts, setAmounts] = React.useState(() => Object.fromEntries(displayInterliners.map((i) => [i.id, i.charge_amount ?? ''])))

    const handleAmountChange = React.useCallback((id, value) => {
        if (value < 0) return
        setAmounts((prev) => ({ ...prev, [id]: value }))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = Object.entries(amounts).map(([k, v]) => ({ id: k, amount: Number(v) }))
        console.log(payload);
        await updateInterlinerAmounts.mutateAsync({ payload, oid: order.order_id, cid: order.customer_id })
        onClose()
    }

    return (
        <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Grid container spacing={2}>
                    {displayInterliners.map((i) => {
                        const meta = TYPE_META[i.type] || TYPE_META.pickup;
                        return (
                            <Grid size={{ xs: 12, sm: displayInterliners?.length === 1 ? 12 : 6 }} key={i.id}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: 'divider' }}                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                                            <Box sx={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${meta.color}18`, color: meta.color, flexShrink: 0 }}                                            >
                                                <LocalShippingRounded sx={{ fontSize: 17 }} />
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography noWrap sx={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>
                                                    {i.name}
                                                </Typography>
                                                <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>
                                                    Ref: {i.invoice || '—'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            size="small"
                                            icon={meta.icon}
                                            label={meta.label}
                                            sx={{ bgcolor: `${meta.color}18`, color: meta.color, fontWeight: 600, fontSize: 11, height: 24, '& .MuiChip-icon': { color: meta.color } }}
                                        />
                                    </Box>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={amounts[i.id] ?? ''}
                                        onChange={(e) => handleAmountChange(i.id, e.target.value)}
                                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                        placeholder="0.00"
                                    />
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
            <div style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '16px 24px', zIndex: 1 }}>
                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid size="auto">
                        <SubmitButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={updateInterlinerAmounts.isPending}
                            isLoading={updateInterlinerAmounts.isPending}
                            textTransform="capitalize"
                        >
                            Save Changes
                        </SubmitButton>
                    </Grid>
                </Grid>
            </div>
        </form>
    )

}

export default React.memo(InterlinerCharge)