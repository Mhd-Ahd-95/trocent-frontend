import React, { useState } from "react";
import { Box, Grid, Typography, IconButton, TextField, MenuItem, Select, FormControl, InputLabel, Tooltip, Divider, Alert, } from "@mui/material";
import { ContentCopy as CopyIcon, InfoOutlined as InfoIcon, } from "@mui/icons-material";
import { useStyles } from "./Email.styles";
import { StyledButton, SubmitButton } from "../../components";


const ORDER_STATUSES = [
    { value: "arrived shipper", label: "Arrived at Shipper" },
    { value: "picked up", label: "Picked Up" },
    { value: "departure_from_shipper", label: "Departure From Shipper" },
    { value: "arrived receiver", label: "Arrived at Receiver" },
    { value: "delivered", label: "Delivered" },
    { value: "departure_from_receiver", label: "Departure From Receiver" },
    { value: "pod", label: "POD (Proof of Delivery)" },
];

const PLACEHOLDERS = [
    { key: "order_number", description: "Order Number" },
    { key: "reference_numbers", description: "Reference Number of order" },
    { key: "shipper_address", description: "Pickup address" },
    { key: "receiver_address", description: "Delivery address" },
    { key: "arrived_time", description: "Arrival time at shipper or receiver" },
    { key: "pickup_at", description: "Pickup Date" },
    { key: "pickup_in", description: "Pickup Start Time" },
    { key: "pickup_out", description: "Pickup Departure Time" },
    { key: "delivery_at", description: "Delivery Date" },
    { key: "delivery_in", description: "Delivery Start Time" },
    { key: "delivery_out", description: "Delivery Departure Time" },
];

const EMPTY_FORM = {
    trigger_key: "",
    subject_template: "",
    body_template: "",
};

function EmailTemplateForm({ onClose, onSave, initialValues = {}, editMode }) {

    const { classes } = useStyles();
    const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
    const [activeField, setActiveField] = useState(null);
    const [copied, setCopied] = useState(null);
    const [submitting, setSubmitting] = React.useState(false)

    const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

    const insertPlaceholder = (token) => {
        navigator.clipboard?.writeText(token).catch(() => { });
        setCopied(token);
        setTimeout(() => setCopied(null), 1500);
        if (activeField === "subject") {
            setForm((p) => ({ ...p, subject_template: p.subject_template + token }));
        } else if (activeField === "body") {
            setForm((p) => ({ ...p, body_template: p.body_template + token }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const payload = { ...form }
            await onSave(payload)
            setSubmitting(false)
            onClose()
        }
        catch (err) {
            setSubmitting(false)
        }
    }

    const reset = () => {
        setForm({ ...EMPTY_FORM, ...initialValues })
        setCopied(null)
        setActiveField(null)
    }

    return (
        <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Grid container spacing={2.5}>
                    <Grid size={12}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Trigger Key</InputLabel>
                                    <Select
                                        value={form.trigger_key}
                                        onChange={set("trigger_key")}
                                        label="Trigger Key"
                                        required
                                    >
                                        {ORDER_STATUSES.map((s) => (
                                            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Subject"
                                    required
                                    value={form.subject_template}
                                    onChange={set("subject_template")}
                                    onFocus={() => setActiveField("subject")}
                                    fullWidth
                                    InputProps={{ sx: { fontFamily: "inherit" } }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Body"
                                    value={form.body_template}
                                    onChange={set("body_template")}
                                    onFocus={() => setActiveField("body")}
                                    fullWidth
                                    required
                                    multiline
                                    rows={8}
                                    InputProps={{ sx: { fontFamily: "inherit", fontSize: 13 } }}
                                    helperText={'Click a placeholder on the right to insert it into the focused field'}
                                />
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid size={12}>
                        <Box className={classes.placeholdersPanel}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                                <InfoIcon sx={{ fontSize: 20, color: "text.primary" }} />
                                <Typography variant="caption" fontWeight={600} sx={{ color: "text.primary", fontSize: 16 }}>
                                    Available Placeholders
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {PLACEHOLDERS.map((p) => (
                                    <Box key={p.key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, border: '1px solid #ccc', borderRadius: 2, padding: 1 }}>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography sx={{ fontFamily: "monospace", fontSize: 14, color: "#534AB7", fontWeight: 600 }}>
                                                {`{{${p.key}}}`}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 13 }}>
                                                {p.description}
                                            </Typography>
                                        </Box>
                                        <Tooltip title={copied === `{{${p.key}}}` ? "Inserted!" : "Click to insert"} placement="left">
                                            <IconButton
                                                size="small"
                                                onClick={() => insertPlaceholder(`{{${p.key}}}`)}
                                                sx={{ width: 26, height: 26, flexShrink: 0, color: copied === `{{${p.key}}}` ? "#3B6D11" : "text.secondary", }}
                                            >
                                                <CopyIcon sx={{ fontSize: 20 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                ))}
                            </Box>
                            <Divider sx={{ my: 1.5 }} />
                            <Alert severity="info" sx={{ fontSize: 11, py: 0.5, "& .MuiAlert-message": { fontSize: 14 } }}>
                                Click a placeholder to append it to the focused field (Subject or Body).
                            </Alert>
                        </Box>
                    </Grid>
                </Grid>
            </div>
            <div style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '16px 24px', zIndex: 1 }}>
                <Grid container spacing={2} justifyContent="flex-start">
                    <Grid size="auto">
                        <SubmitButton
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            size="small"
                            textTransform="capitalize"
                            isLoading={submitting}
                            disabled={!form.body_template || !form.subject_template || !form.trigger_key}
                        >
                            {editMode ? 'Edit Template' : "Create template"}
                        </SubmitButton>
                    </Grid>
                    <Grid size="auto">
                        <StyledButton
                            variant="outlined"
                            color="error"
                            size="small"
                            textTransform="capitalize"
                            onClick={reset}
                        >
                            Reset
                        </StyledButton>
                    </Grid>
                </Grid>
            </div>
        </form>
    );
}

export default React.memo(EmailTemplateForm)