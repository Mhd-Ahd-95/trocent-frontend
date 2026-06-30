import React from "react";
import { Box, Typography, Button, TextField, Grid, MenuItem, CircularProgress, Chip, Divider, alpha, InputAdornment, IconButton } from "@mui/material";
import { EditOutlined, DeleteOutlined, AddOutlined, CheckCircle, ErrorOutline, DnsOutlined, CheckOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useLogoAddressMutation, useSmtpMail } from "../../hooks/useDefaultLogoAndAddress";
import { ConfirmModal, Modal } from "../../components";


const emptyForm = { host: "", port: "", username: "", password: "", encryption: "TLS", default: "smtp", from_address: "", from_name: "" };

function SmtpConfiguration({ enabled }) {

    const { data, isLoading } = useSmtpMail({ enabled });
    const { findOrCreateSmtp, deleteSmtp } = useLogoAddressMutation();

    const [mode, setMode] = React.useState("view");
    const [form, setForm] = React.useState(emptyForm);
    const [showPassword, setShowPassword] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false)

    const smtp = data ?? null;
    const isMutating = findOrCreateSmtp.isPending || deleteSmtp.isPending;

    const openForm = () => {
        setForm(smtp ? {
            host: smtp.host || "",
            port: smtp.port || "",
            username: smtp.username || "",
            password: smtp.password || "",
            encryption: smtp.encryption || "TLS",
            default: smtp.default || "smtp",
            from_address: smtp.from_address || "",
            from_name: smtp.from_name || "",
        } : emptyForm);
        setMode("form");
    };

    const handleSave = async () => {
        if (!form.host || !form.port || !form.username || !form.password || !form.from_address) {
            return;
        }
        await findOrCreateSmtp.mutateAsync(form);
        setMode('view')
    };

    const handleDelete = async () => {
        await deleteSmtp.mutateAsync();
        setMode("view")
    };

    if (isLoading) return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} sx={{ color: "#DD9100" }} />
        </Box>
    );

    return (
        <>
            <Box sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: "12px", overflow: "hidden", background: "background.paper" }}>
                <Box sx={{ px: 2.5, py: 1.75, borderBottom: "0.5px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <DnsOutlined sx={{ fontSize: 20, color: "#DD9100" }} />
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>SMTP configuration</Typography>
                    </Box>
                </Box>
                <Box sx={{ p: 2.5 }}>
                    {mode === "view" && !smtp && (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 1.5 }}>
                            <Box sx={{
                                width: 48, height: 48, borderRadius: "50%", background: alpha("#DD9100", 0.07), border: `0.5px solid ${alpha("#DD9100", 0.2)}`,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <DnsOutlined sx={{ fontSize: 22, color: "#DD9100" }} />
                            </Box>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 0.5 }}>No SMTP server configured</Typography>
                                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                    Connect an SMTP server to send status emails to customers.
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<AddOutlined />}
                                onClick={openForm}
                                sx={{textTransform: "none"}}
                                color='primary'
                            >
                                Add SMTP Server
                            </Button>
                        </Box>
                    )}
                    {mode === "view" && smtp && (
                        <>
                            <Grid container spacing={3}>
                                <Grid size={12}>
                                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.4 }}>
                                        From name / address
                                    </Typography>
                                    <Typography sx={{ fontSize: 15 }}>{smtp.from_name} &lt;{smtp.from_address}&gt;</Typography>
                                </Grid>
                                {[
                                    { label: "Host", value: smtp.host, mono: true },
                                    { label: "Port", value: smtp.port, mono: true },
                                    { label: "Username", value: smtp.username },
                                    { label: "Encryption", value: smtp.encryption?.toUpperCase() },
                                ].map(({ label, value, mono }) => (
                                    <Grid key={label} size={6}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.4 }}>
                                            {label}
                                        </Typography>
                                        <Typography sx={{ fontSize: 15, fontFamily: mono ? "monospace" : "inherit" }}>{value || "—"}</Typography>
                                    </Grid>
                                ))}
                                <Grid size={12}>
                                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.4 }}>
                                        Password
                                    </Typography>
                                    <Typography sx={{ fontSize: 15, fontFamily: "monospace" }}>••••••••••••</Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color='primary'
                                    startIcon={<EditOutlined sx={{ fontSize: 16 }} />}
                                    onClick={openForm}
                                    sx={{ textTransform: "none" }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={deleteSmtp.isPending ? <CircularProgress size={14} color="inherit" /> : <DeleteOutlined sx={{ fontSize: 16 }} />}
                                    disabled={isMutating}
                                    onClick={() => setOpenModal(true)}
                                    sx={{ textTransform: "none" }}
                                >
                                    {deleteSmtp.isPending ? "Deleting..." : "Delete"}
                                </Button>
                            </Box>
                        </>
                    )}
                    {mode === "form" && (
                        <>
                            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 3 }}>
                                {smtp ? "Edit SMTP server" : "Configure SMTP server"}
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid size={6}>
                                    <TextField fullWidth label="SMTP host" placeholder="smtp.office365.com"
                                        value={form.host} onChange={e => setForm(p => ({ ...p, host: e.target.value }))} />
                                </Grid>
                                <Grid size={6}>
                                    <TextField fullWidth label="Port" placeholder="587"
                                        value={form.port} onChange={e => setForm(p => ({ ...p, port: e.target.value }))} />
                                </Grid>
                                <Grid size={6}>
                                    <TextField fullWidth label="Username" placeholder="name@company.com"
                                        value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth label="Password" placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(s => !s)} edge="end">
                                                            {showPassword ? <VisibilityOff sx={{ fontSize: 25 }} /> : <Visibility sx={{ fontSize: 25 }} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField fullWidth label="Encryption"
                                        value={form.encryption} onChange={e => setForm(p => ({ ...p, encryption: e.target.value }))} />
                                </Grid>
                                <Grid size={6}>
                                    <TextField fullWidth label="Default Mailer" placeholder="smtp"
                                        value={form.default} onChange={e => setForm(p => ({ ...p, default: e.target.value }))} />
                                </Grid>
                                <Grid size={6}>
                                    <TextField fullWidth label="From address" placeholder="trocent@messagers.ca"
                                        value={form.from_address} onChange={e => setForm(p => ({ ...p, from_address: e.target.value }))} />
                                </Grid>
                                <Grid size={6}>
                                    <TextField fullWidth label="From name" placeholder="Messagers"
                                        value={form.from_name} onChange={e => setForm(p => ({ ...p, from_name: e.target.value }))} />
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="contained"
                                    startIcon={findOrCreateSmtp.isPending ? <CircularProgress size={14} color="inherit" /> : <CheckOutlined sx={{ fontSize: 16 }} />}
                                    disabled={isMutating}
                                    onClick={handleSave}
                                    color="primary"
                                    sx={{ textTransform: 'none' }}
                                >
                                    {findOrCreateSmtp.isPending ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    disabled={isMutating}
                                    onClick={() => setMode("view")}
                                    sx={{ textTransform: 'none' }}
                                    color='inherit'
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
            <Modal open={openModal} handleClose={() => setOpenModal(false)}>
                <ConfirmModal
                    title={
                        <>
                            Delete{' '}
                            <strong style={{ fontSize: 15, paddingInline: 5 }}>SMTP</strong>
                        </>
                    }
                    subtitle='Are you sure you want to continue?'
                    handleClose={() => setOpenModal(false)}
                    handleSubmit={handleDelete}
                />
            </Modal>
        </>
    );
}

export default React.memo(SmtpConfiguration);