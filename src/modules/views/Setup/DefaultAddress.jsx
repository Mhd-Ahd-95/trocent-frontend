import React from "react";
import { Box, Typography, Button, TextField, Grid, CircularProgress, Divider, alpha } from "@mui/material";
import { EditOutlined, DeleteOutlined, AddOutlined, PlaceOutlined, CheckOutlined } from "@mui/icons-material";
import { useDefaultAddress, useLogoAddressMutation } from "../../hooks/useDefaultLogoAndAddress";
import { ConfirmModal, Modal } from "../../components";

function DefaultAddress({ enabled }) {

    const { data, isLoading } = useDefaultAddress({ enabled });
    const { createDefaultAddress, updateDefaultAddress, deleteDefaultAddress } = useLogoAddressMutation();
    const [openModal, setOpenModal] = React.useState(false)
    const [mode, setMode] = React.useState("view");
    const [form, setForm] = React.useState({ address: "", suite: "", city: "", province: "", postal_code: "", phone_number: "" });

    const address = data ?? null;
    const isMutating = createDefaultAddress.isPending || updateDefaultAddress.isPending || deleteDefaultAddress.isPending;

    const openEdit = () => {
        setForm({ address: address?.address || "", suite: address?.suite || "", city: address?.city || "", province: address?.province || "", postal_code: address?.postal_code || "", phone_number: address?.phone_number || "", });
        setMode("edit");
    };

    const openCreate = () => {
        setForm({ address: "", suite: "", city: "", province: "", postal_code: "", phone_number: "" });
        setMode("create");
    };

    const handleSave = async () => {
        if (mode === "create") {
            await createDefaultAddress.mutateAsync(form);
        } else {
            await updateDefaultAddress.mutateAsync({ id: address.id, data: form });
        }
        setMode("view")
    };

    const handleDelete = async () => {
        await deleteDefaultAddress.mutateAsync(address.id);
        setMode("view")
    };

    if (isLoading) return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <>
            <Box sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: "12px", overflow: "hidden", background: "background.paper" }}>
                <Box sx={{ px: 2.5, py: 1.75, borderBottom: "0.5px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <PlaceOutlined sx={{ fontSize: 20, color: "#DD9100" }} />
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Default address</Typography>
                    </Box>
                </Box>
                <Box sx={{ p: 2.5 }}>
                    {mode === "view" && !address && (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 1.5 }}>
                            <Box sx={{
                                width: 48, height: 48, borderRadius: "50%", background: alpha("#DD9100", 0.07), border: `0.5px solid ${alpha("#DD9100", 0.2)}`, display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <PlaceOutlined sx={{ fontSize: 22, color: "#DD9100" }} />
                            </Box>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>No default address set</Typography>
                                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                    Add your company address to use on BOL documents.
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<AddOutlined />}
                                onClick={openCreate}
                                sx={{ background: "#DD9100", color: "#fff", textTransform: "none", fontWeight: 500, fontSize: 13, borderRadius: 1.5, height: 34, boxShadow: "none", "&:hover": { background: "#C47F00", boxShadow: "none" } }}
                            >
                                Add address
                            </Button>
                        </Box>
                    )}
                    {mode === "view" && address && (
                        <>
                            <Grid container spacing={1.5}>
                                {[
                                    { label: "Address", value: address.address, full: true },
                                    { label: "Suite", value: address.suite },
                                    { label: "City", value: address.city },
                                    { label: "Province", value: address.province },
                                    { label: "Postal code", value: address.postal_code },
                                    { label: "Phone", value: address.phone_number, full: true },
                                ].map(({ label, value, full }) => (
                                    <Grid key={label} size={full ? 12 : 6}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.4 }}>
                                            {label}
                                        </Typography>
                                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: value ? "text.primary" : "text.disabled", fontStyle: value ? "normal" : "italic" }}>
                                            {value || "—"}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", gap: 3, alignItems: 'center' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<EditOutlined sx={{ fontSize: 16 }} />}
                                    onClick={openEdit}
                                    color="primary"
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={deleteDefaultAddress.isPending ? <CircularProgress size={14} color="inherit" /> : <DeleteOutlined sx={{ fontSize: 16 }} />}
                                    disabled={isMutating}
                                    onClick={() => setOpenModal(true)}
                                    sx={{ textTransform: "capitalize" }}
                                >
                                    {deleteDefaultAddress.isPending ? "Deleting..." : "Delete"}
                                </Button>
                            </Box>
                        </>
                    )}
                    {(mode === "create" || mode === "edit") && (
                        <>
                            <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 2 }}>
                                {mode === "create" ? "Add address" : "Edit address"}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField fullWidth label="Address" placeholder="123 Main St"
                                        value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                                </Grid>
                                <Grid size={6}>
                                    <TextField fullWidth label="Suite" placeholder="Suite 100"
                                        value={form.suite} onChange={e => setForm(p => ({ ...p, suite: e.target.value }))} />
                                </Grid>
                                <Grid size={6}>
                                    <TextField fullWidth label="City" placeholder="Montreal"
                                        value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                                </Grid>
                                <Grid size={6}>
                                    <TextField fullWidth label="Province" placeholder="QC"
                                        value={form.province} onChange={e => setForm(p => ({ ...p, province: e.target.value }))} />
                                </Grid>
                                <Grid size={6}>
                                    <TextField fullWidth label="Postal code" placeholder="H1A 1A1"
                                        value={form.postal_code} onChange={e => setForm(p => ({ ...p, postal_code: e.target.value }))} />
                                </Grid>
                                <Grid size={12}>
                                    <TextField fullWidth label="Phone number" placeholder="(514) 000-0000"
                                        value={form.phone_number} onChange={e => setForm(p => ({ ...p, phone_number: e.target.value }))} />
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", gap: 3, alignItems: 'center' }}>
                                <Button
                                    variant="contained"
                                    startIcon={isMutating ? <CircularProgress size={14} color="inherit" /> : <CheckOutlined sx={{ fontSize: 16 }} />}
                                    disabled={isMutating}
                                    onClick={handleSave}
                                    sx={{ textTransform: "none" }}
                                >
                                    {isMutating ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    disabled={isMutating}
                                    onClick={() => setMode("view")}
                                    sx={{ textTransform: "none" }}
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
                            <strong style={{ fontSize: 15, paddingInline: 5 }}>Default Address</strong>
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

export default React.memo(DefaultAddress);