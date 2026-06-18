import React, { useState } from "react";
import { Box, Grid, Typography, Button, IconButton, Chip, Tooltip } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Mail as MailIcon, AttachFile as AttachIcon, Email } from "@mui/icons-material";
import { useStyles } from "./Email.styles";
import { ConfirmModal, CustomTitle, DrawerForm, Modal } from "../../components";
import EmailTemplateForm from "./EmailTemplateForm";


const ORDER_STATUSES = [
    { value: "arrived_shipper", label: "Arrived at Shipper" },
    { value: "picked_up", label: "Picked Up" },
    { value: "arrived_receiver", label: "Arrived at Receiver" },
    { value: "delivered", label: "Delivered" },
    { value: "pod", label: "POD (Proof of Delivery)" },
];

const DUMMY_TEMPLATES = [
    {
        id: 1,
        trigger_key: "arrived_shipper",
        recipient_type: "shipper",
        subject_template: "Driver Arrived at Pickup Location",
        body_template:
            "Hello,\n\nThe driver has arrived at {{shipper_address}} to pick up Order {{order_number}} at {{arrived_at}}.\n\nReference Number: {{reference_number}}\n\nThank you,\nMessagers Team",
        is_active: true,
        has_attachment: false,
    },
    {
        id: 2,
        trigger_key: "picked_up",
        recipient_type: "shipper",
        subject_template: "Driver Picked Up Your Order",
        body_template:
            "Hello,\n\nYour order has been picked up from {{shipper_address}}.\n\nOrder Number: {{order_number}}\nReference: {{reference_number}}\nPickup Time: {{arrived_at}}\n\nThank you,\nMessagers Team",
        is_active: true,
        has_attachment: false,
    },
    {
        id: 4,
        trigger_key: "arrived_receiver",
        recipient_type: "receiver",
        subject_template: "Driver Arrived at Delivery Location",
        body_template:
            "Hello,\n\nThe driver has arrived at {{receiver_address}} for delivery at {{delivery_in}}.\n\nOrder Number: {{order_number}}\nReference: {{reference_number}}\n\nThank you,\nMessagers Team",
        is_active: true,
        has_attachment: false,
    },
    {
        id: 5,
        trigger_key: "delivered",
        recipient_type: "receiver",
        subject_template: "Your Order Has Been Delivered",
        body_template:
            "Hello,\n\nYour order has been successfully delivered to {{receiver_address}} at {{delivery_in}}.\n\nOrder Number: {{order_number}}\nReference: {{reference_number}}\n\nThank you,\nMessagers Team",
        is_active: true,
        has_attachment: false,
    },
    {
        id: 7,
        trigger_key: "pod",
        recipient_type: "shipper",
        subject_template: "Messagers POD for {{reference_number}}",
        body_template:
            "Hello,\n\nPlease find attached the Proof of Delivery for your order.\n\nOrder Number: {{order_number}}\nReference Number: {{reference_number}}\nDelivered At: {{delivery_in}}\nDelivery Address: {{receiver_address}}\n\nThank you,\nMessagers Team",
        is_active: true,
        has_attachment: true,
    },
];

const STATUS_COLORS = {
    arrived_shipper: { bg: "#E6F1FB", color: "#185FA5", label: "Arrived Shipper" },
    picked_up: { bg: "#EAF3DE", color: "#3B6D11", label: "Picked Up" },
    arrived_receiver: { bg: "#EEEDFE", color: "#534AB7", label: "Arrived Receiver" },
    delivered: { bg: "#E1F5EE", color: "#0F6E56", label: "Delivered" },
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

function RecipientBadge({ type }) {
    const map = { shipper: "Shipper", receiver: "Receiver", both: "Both" };
    return (
        <Typography variant="caption" sx={{ color: "text.primary", fontSize: "13px" }}>
            → {map[type] || type}
        </Typography>
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
                <RecipientBadge type={template.recipient_type} />
            </Box>
            <Box className={classes.bodyPreview}>
                <Typography variant="caption" sx={{ whiteSpace: "pre-wrap", color: "text.secondary", fontSize: "13px" }}>
                    {template.body_template}
                </Typography>
            </Box>
        </Box>
    );
}

function EmailTab() {

    const { classes } = useStyles();
    const [templates, setTemplates] = useState(DUMMY_TEMPLATES);
    const emailRef = React.useRef(null)
    const [openDrawer, setOpenDrawer] = useState(false);
    const [activeStatus, setActiveStatus] = useState("all");

    const filtered = activeStatus === "all" ? templates : templates.filter((t) => t.trigger_key === activeStatus);
    const countFor = (status) => status === "all" ? templates.length : templates.filter((t) => t.trigger_key === status).length;

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
            <DrawerForm customTitle={<CustomTitle title='New Email Template' Icon={Email} />} setOpen={setOpenDrawer} open={openDrawer === 1}>
                {openDrawer === 1 &&
                    <EmailTemplateForm
                        initialValues={{}}
                        onClose={() => setOpenDrawer(false)}
                        onSave={() => true}
                    />
                }
            </DrawerForm>
            <DrawerForm customTitle={<CustomTitle title='Edit Email Template' Icon={Email} />} setOpen={setOpenDrawer} open={openDrawer === 2}>
                {openDrawer === 2 &&
                    <EmailTemplateForm
                        initialValues={{ ...emailRef.current }}
                        editMode
                        onClose={() => setOpenDrawer(false)}
                        onSave={() => true}
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
                        handleSubmit={() => true}
                    />
                }
            </Modal>
        </Box>
    );
}

export default React.memo(EmailTab);