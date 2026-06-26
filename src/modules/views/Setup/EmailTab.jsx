import React, { useState } from "react";
import { Box, Grid, Typography, Button, IconButton, Chip, Tooltip, CircularProgress } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Mail as MailIcon, AttachFile as AttachIcon, Email } from "@mui/icons-material";
import { useStyles } from "./Email.styles";
import { ConfirmModal, CustomTitle, DrawerForm, Modal } from "../../components";
import EmailTemplateForm from "./EmailTemplateForm";
import { useEmailTemplateMutation, useEmailTemplates } from "../../hooks/useEmailTemplate";
import { useSnackbar } from "notistack";


const ORDER_STATUSES = [
    { value: "arrived shipper", label: "Arrived at Shipper" },
    { value: "picked up", label: "Picked Up" },
    { value: "departure_from_shipper", label: "Departure From Shipper" },
    { value: "arrived receiver", label: "Arrived at Receiver" },
    { value: "delivered", label: "Delivered" },
    { value: "departure_from_receiver", label: "Departure From Receiver" },
    { value: "pod", label: "POD (Proof of Delivery)" },
];

const STATUS_COLORS = {
    'arrived shipper': { bg: "#E6F1FB", color: "#185FA5", label: "Arrived Shipper" },
    'picked up': { bg: "#EAF3DE", color: "#3B6D11", label: "Picked Up" },
    departure_from_shipper: { bg: "#EAF3DE", color: "#08a045", label: "Departure From Shipper" },
    'arrived receiver': { bg: "#EEEDFE", color: "#534AB7", label: "Arrived Receiver" },
    delivered: { bg: "#E1F5EE", color: "#0F6E56", label: "Delivered" },
    departure_from_receiver: { bg: "#E1F5EE", color: "#2aa914", label: "Departure From Receiver" },
    pod: { bg: "#FAEEDA", color: "#854F0B", label: "POD" },
};

function StatusChip({ status }) {
    const cfg = STATUS_COLORS[status] || { bg: "#F1EFE8", color: "#5F5E5A", label: status };
    return (
        <Chip
            label={cfg.label}
            size="small"
            sx={{ backgroundColor: cfg.bg, color: cfg.color, fontWeight: 600, fontSize: "14px", height: 24, borderRadius: "6px", }}
        />
    );
}

function TemplateCard({ template, onEdit, onDelete }) {

    const { classes } = useStyles();

    return (
        <Box className={classes.templateSubCard}>
            <Box className={classes.cardHeader}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <MailIcon sx={{ fontSize: 20 }} color="primary" />
                    <Typography className={classes.cardTitle}>{template.subject_template}</Typography>
                    {template.has_attachment && (
                        <Tooltip title="Includes PDF attachment">
                            <AttachIcon sx={{ fontSize: 20 }} color="info" />
                        </Tooltip>
                    )}
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onEdit(template)} className={classes.iconBtn}>
                            <EditIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => onDelete(template)} className={classes.iconBtnDanger}>
                            <DeleteIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, mb: 1.5 }}>
                <StatusChip status={template.trigger_key} />
            </Box>
            <Box className={classes.bodyPreview}>
                <Typography variant="caption" sx={{ whiteSpace: "pre-wrap", color: "text.secondary", fontSize: "13px" }}>
                    {template.body_template}
                </Typography>
            </Box>
        </Box>
    );
}

function EmailTab({ enabled }) {

    const { classes } = useStyles();
    const { enqueueSnackbar } = useSnackbar()
    const { data: templates = [], isLoading, error, isError } = useEmailTemplates({ enabled })
    const emailRef = React.useRef(null)
    const [openDrawer, setOpenDrawer] = useState(false);
    const [activeStatus, setActiveStatus] = useState("all");
    const { create, update, destroy } = useEmailTemplateMutation()

    const filtered = React.useMemo(() => activeStatus === "all" ? templates : templates.filter((t) => t.trigger_key === activeStatus), [templates])
    const countFor = (status) => status === "all" ? templates.length : templates.filter((t) => t.trigger_key === status).length;

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            const errorMessage = message ? `${message} - ${status}` : error.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [isError, error])

    return (
        <Box className={classes.root}>
            <Box className={classes.pageHeader}>
                <Box>
                    <Typography className={classes.pageTitle}>Email Templates</Typography>
                    <Typography className={classes.pageSubtitle}>
                        Manage automated emails sent at each stage of the order lifecycle.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon fontSize="large" />}
                    onClick={() => setOpenDrawer(1)}
                    disableElevation
                    size="small"
                    className={classes.createBtn}
                >
                    New Template
                </Button>
            </Box>
            <Box className={classes.filterRow}>
                {[{ value: "all", label: "All" }, ...ORDER_STATUSES].map((s) => (
                    <Button
                        key={s.value}
                        variant={activeStatus === s.value ? "contained" : "text"}
                        onClick={() => setActiveStatus(s.value)}
                        disableElevation
                        className={activeStatus === s.value ? classes.filterBtnActive : classes.filterBtn}
                    >
                        {s.label}
                        <Box component="span" className={classes.filterCount}>
                            {countFor(s.value)}
                        </Box>
                    </Button>
                ))}
            </Box>
            {isLoading ? <Grid container component={Box} justifyContent={'center'} py={15}>
                <CircularProgress />
            </Grid>
                :
                <>
                    {filtered.length === 0 ? (
                        <Box className={classes.emptyState}>
                            <MailIcon sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                No templates for this status.
                            </Typography>
                            <Button size="small" onClick={() => setOpenDrawer(1)} sx={{ mt: 1 }}>
                                Create one →
                            </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {filtered.map((t) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t.id} className={classes.templateCard}>
                                    <TemplateCard
                                        template={t}
                                        onEdit={(row) => { emailRef.current = row; setOpenDrawer(2) }}
                                        onDelete={(row) => { emailRef.current = row; setOpenDrawer(3) }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            }
            <DrawerForm customTitle={<CustomTitle title='New Email Template' Icon={Email} />} setOpen={setOpenDrawer} open={openDrawer === 1}>
                {openDrawer === 1 &&
                    <EmailTemplateForm
                        initialValues={{}}
                        onClose={() => setOpenDrawer(false)}
                        onSave={async (payload) => await create.mutateAsync(payload)}
                    />
                }
            </DrawerForm>
            <DrawerForm customTitle={<CustomTitle title='Edit Email Template' Icon={Email} />} setOpen={setOpenDrawer} open={openDrawer === 2}>
                {openDrawer === 2 &&
                    <EmailTemplateForm
                        initialValues={{ ...emailRef.current }}
                        editMode
                        onClose={() => setOpenDrawer(false)}
                        onSave={async (payload) => {
                            await update.mutateAsync({id: emailRef.current.id, payload})
                            emailRef.current = null
                        }}
                    />
                }
            </DrawerForm>
            <Modal open={openDrawer === 3} handleClose={() => setOpenDrawer(false)}>
                {openDrawer === 3 &&
                    <ConfirmModal
                        title={
                            <>
                                Delete Email {' '}
                                <strong style={{ fontSize: 15, paddingInline: 5 }}>"{emailRef.current.subject_template}"</strong>
                            </>
                        }
                        subtitle='Are you sure you want to continue?'
                        handleClose={() => setOpenDrawer(false)}
                        handleSubmit={async () => {
                            await destroy.mutateAsync(emailRef.current.id)
                            emailRef.current = null
                        }}
                    />
                }
            </Modal>
        </Box>
    );
}

export default React.memo(EmailTab);