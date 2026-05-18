import React, { useMemo } from "react";
import { Box, Typography, Chip, Avatar, Paper, Divider, Stack, CircularProgress, } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, } from "@mui/lab";
import { PlayCircle, StopCircle, Store, LocalShipping, CheckCircle, Warehouse, DirectionsCar, AssignmentTurnedIn, } from "@mui/icons-material";
import moment from "moment";
import { useTripActivities } from '../../hooks/useDispatchOrders'
import { useSnackbar } from "notistack";


const fmt = (dateStr) => {
    try {
        const m = moment(dateStr, "YYYY-MM-DD HH:mm:ss");
        return {
            date: m.format("MMM DD, YYYY"),
            time: m.format("hh:mm A"),
        };
    } catch {
        return { date: "", time: "" };
    }
};

const SignatureBlock = ({ signedBy, signatureImg, color = "rgba(221,145,0,0.06)", borderColor = "rgba(221,145,0,0.3)" }) => {
    if (!signedBy && !signatureImg) return null;
    return (
        <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, background: color, border: `1px dashed ${borderColor}`, display: "flex", alignItems: "center", gap: 2 }}>
            {signedBy && (
                <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", lineHeight: 1 }}>
                        Signed by
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main", mt: 0.25 }}>
                        {signedBy}
                    </Typography>
                </Box>
            )}
            {signatureImg && (
                <Box
                    component="img"
                    src={signatureImg}
                    alt="signature"
                    sx={{ height: 50, maxWidth: 120, borderRadius: 1, bgcolor: "#fff", border: "1px solid #e2e8f0", p: 0.5 }}
                />
            )}
        </Box>
    );
};

const FreightBadges = ({ freight }) => {
    if (!freight) return null;
    const items = [
        { label: "Pieces", value: freight.pieces },
        { label: "Pallets", value: freight.pallets, },
        { label: "Weight", value: `${freight.weight} ${freight.unit}` },
    ];
    return (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {items.map((item) => (
                <Chip
                    key={item.label}
                    label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <span style={{ fontWeight: 800 }}>{item.value}</span>
                            <span style={{ opacity: 0.85, fontSize: 13 }}>{item.label}</span>
                        </Box>
                    }
                    size="small"
                    sx={{ bgcolor: "rgba(44,62,80,0.07)", color: "secondary.dark", fontFamily: "inherit", height: 26, "& .MuiChip-label": { px: 1.25 }, }}
                />
            ))}
        </Stack>
    );
};

const OrderTag = ({ order, freight, signedBy, signatureImg, color }) => (
    <Box sx={{ mt: 1.25, p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip
                label={`Order # ${order.order_number}`}
                size="small"
                sx={{ fontWeight: 700, height: 22, fontSize: 13, backgroundColor: color, color: '#fff' }}
            />
            {order.customer_name && (
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Customer: <b>{order.customer_name}</b>
                </Typography>
            )}
        </Stack>
        {freight && <FreightBadges freight={freight} />}
        {(signedBy || signatureImg) && (<SignatureBlock signedBy={signedBy} signatureImg={signatureImg} />)}
    </Box>
);

const SectionLabel = ({ label, color = "primary.main" }) => (
    <Chip
        label={label}
        size="small"
        sx={{ mt: 1, mb: 0.5, bgcolor: "transparent", border: "1px solid", borderColor: color, color: color, fontSize: 11, fontWeight: 700, height: 22, letterSpacing: 0.3 }}
    />
);

const EventCard = ({ icon: Icon, iconColor, title, subtitle, children, accentLeft }) => (
    <Paper elevation={0}
        sx={{
            p: 2, mb: 0.5, borderRadius: 2.5, border: "1px solid", borderColor: "divider", borderLeft: accentLeft ? `3px solid ${accentLeft}` : "1px solid",
            bgcolor: "background.paper", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s", "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
        }}
    >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar sx={{ width: 36, height: 36, bgcolor: `${iconColor}18`, color: iconColor, flexShrink: 0, }}>
                <Icon sx={{ fontSize: 18 }} />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.4 }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.25 }}>
                        {subtitle}
                    </Typography>
                )}
                {children}
            </Box>
        </Stack>
    </Paper>
);

function buildTimelineEvents(activities) {
    if (!activities?.length) return [];
    const sorted = [...activities].sort((a, b) => new Date(b.occurred_at) - new Date(a.occurred_at));
    const events = [];
    const used = new Set();
    for (let i = 0; i < sorted.length; i++) {
        if (used.has(sorted[i].id)) continue;
        const act = sorted[i];
        const { trip_event, occurred_at, signed_by, signature_img } = act;
        if (trip_event === "started trip" || trip_event === "ended trip") {
            events.push({ type: trip_event, occurred_at, items: [act] });
            used.add(act.id);
            continue;
        }
        const shipper_name = act?.dispatch_order?.shipper_name ?? ''
        const receiver_name = act?.dispatch_order?.receiver_name ?? ''
        const siblings = sorted.filter((a) => !used.has(a.id) && a.trip_event === trip_event && moment(a.occurred_at).format('YYYY-MM-DD h:mm') === moment(occurred_at).format('YYYY-MM-DD h:mm'));
        siblings.forEach((s) => used.add(s.id));
        if (trip_event === "arrived shipper") {
            events.push({ type: "arrived_shipper", occurred_at, shipper_name, items: siblings });
            continue;
        }
        if (trip_event === "picked up") {
            events.push({ type: "picked_up", occurred_at, shipper_name, signed_by, signature_img, items: siblings });
            continue;
        }
        if (trip_event === "arrived receiver") {
            events.push({ type: "arrived_receiver", occurred_at, receiver_name, items: siblings });
            continue;
        }
        if (trip_event === "completed") {
            events.push({ type: "completed", occurred_at, receiver_name, signed_by, signature_img, items: siblings });
            continue;
        }
        events.push({ type: trip_event, occurred_at, items: siblings });
    }
    return events;
}

const DOT_CONFIG = {
    "started trip": { color: "#22c55e", icon: PlayCircle },
    "ended trip": { color: "#64748b", icon: StopCircle },
    arrived_shipper: { color: "#DD9100", icon: Store },
    picked_up: { color: "#DD9100", icon: LocalShipping },
    arrived_receiver: { color: "#DD9100", icon: Warehouse },
    completed: { color: "#DD9100", icon: CheckCircle },
};

export default function TripActivities({ trip }) {

    const { data = [], isLoading, isError, error, isFetching } = useTripActivities(trip.id)
    const timelineEvents = useMemo(() => buildTimelineEvents(data), [data]);
    const { enqueueSnackbar } = useSnackbar()

    React.useEffect(() => {
        if (isError && error) {
            const message = error.response?.data?.message;
            const status = error.response?.status;
            const errorMessage = message ? `${message} - ${status}` : error.message;
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [isError, error])

    if (isLoading || isFetching) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">{'Loading Activities...'}</Typography>
            </Box>
        );
    }

    if (!timelineEvents.length) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">No activity recorded for this trip.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ px: 3, py: 2, height: '100%', overflow: 'auto' }}>
            <Timeline sx={{ p: 0, m: 0, [`& .MuiTimelineItem-root`]: { minHeight: 0 }, [`& .MuiTimelineItem-root::before`]: { display: "none" } }}>
                {timelineEvents.map((event, idx) => {
                    const cfg = DOT_CONFIG[event.type] ?? { color: "#94a3b8", icon: DirectionsCar };
                    const DotIcon = cfg.icon;
                    const ts = fmt(event.occurred_at);
                    const isLast = idx === timelineEvents.length - 1;
                    const eventColor = cfg.color;
                    const signatureBg = `${eventColor}10`;
                    const signatureBorder = `${eventColor}50`;
                    return (
                        <TimelineItem key={idx}>
                            <TimelineSeparator>
                                <TimelineDot sx={{ bgcolor: cfg.color, boxShadow: `0 0 0 3px ${cfg.color}28`, p: 0.6, my: 0.5, }}>
                                    <DotIcon sx={{ fontSize: 16, color: "#fff" }} />
                                </TimelineDot>
                                {!isLast && (
                                    <TimelineConnector sx={{ bgcolor: "divider", width: 2 }} />
                                )}
                            </TimelineSeparator>
                            <TimelineContent sx={{ pt: 0.5, pb: 2, pr: 0 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                                    <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 600, fontSize: "0.7rem", letterSpacing: 0.3, }}>
                                        {ts.date}
                                    </Typography>
                                    <Chip label={ts.time} size="small" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700, bgcolor: `${cfg.color}15`, color: cfg.color, "& .MuiChip-label": { px: 1 } }} />
                                </Stack>
                                {event.type === "started trip" && (
                                    <EventCard
                                        icon={PlayCircle}
                                        iconColor="#22c55e"
                                        accentLeft="#22c55e"
                                        title="Driver Started the Trip"
                                        subtitle={`${event.items[0].driver_name} · ${event.items[0].driver_number}`}
                                    />
                                )}
                                {event.type === "ended trip" && (
                                    <EventCard
                                        icon={StopCircle}
                                        iconColor="#64748b"
                                        accentLeft="#64748b"
                                        title="Driver Ended the Trip"
                                        subtitle={`${event.items[0].driver_name} · ${event.items[0].driver_number}`}
                                    />
                                )}
                                {event.type === "arrived_shipper" && (
                                    <EventCard
                                        icon={Store}
                                        iconColor="#f59e0b"
                                        accentLeft="#f59e0b"
                                        title="Driver Arrived for Pickup at Shipper Address"
                                        subtitle={event.items.length > 1 ? `${event.items.length} orders involved` : `1 order involved`}
                                    >
                                        <Box sx={{ mt: 1 }}>
                                            <SectionLabel label="Orders Involved" color={eventColor} />
                                            <Typography variant="caption" display="block" sx={{ mt: 0.5, color: "text.secondary" }}>
                                                Shipper: {event.shipper_name ? <b>{event.shipper_name}</b> : '-'}
                                            </Typography>
                                            {event.items.map((item) => item.dispatch_order ? (<OrderTag color='#DD9100' key={item.id} order={item.dispatch_order} />) : null)}
                                        </Box>
                                    </EventCard>
                                )}
                                {event.type === "picked_up" && (
                                    <EventCard
                                        icon={LocalShipping}
                                        iconColor="#DD9100"
                                        accentLeft="#DD9100"
                                        title="Driver Departed from Shipper"
                                        subtitle="Pickup completed — shipment loaded"
                                    >
                                        <Box sx={{ mt: 1 }}>
                                            <SectionLabel label="Orders Picked Up" color={eventColor} />
                                            <Typography variant="caption" display="block" sx={{ mt: 0.5, color: "text.secondary" }}>
                                                Shipper: {event.shipper_name ? <b>{event.shipper_name}</b> : '-'}
                                            </Typography>
                                            {event.items.map((item) => item.dispatch_order ? (<OrderTag color='#DD9100' key={item.id} order={item.dispatch_order} freight={item.freight_details} />) : null)}
                                        </Box>
                                        {(event.signed_by || event.signature_img) && (
                                            <Box sx={{ mt: 2 }}>
                                                <Divider sx={{ mb: 1.5 }}>
                                                    <Chip
                                                        icon={<AssignmentTurnedIn sx={{ fontSize: "14px !important" }} />}
                                                        label="Completed Shipment from Shipper"
                                                        size="small"
                                                        sx={{ fontSize: 13, fontWeight: 700, bgcolor: signatureBg, color: eventColor, border: `1px solid ${signatureBorder}`, "& .MuiChip-icon": { color: eventColor } }}
                                                    />
                                                </Divider>
                                                {(event.signed_by || event.signature_img) ? (<Box sx={{ mb: 1.5 }}><SignatureBlock signedBy={event.signed_by} signatureImg={event.signature_img} color={signatureBg} borderColor={signatureBorder} /></Box>) : null}
                                            </Box>
                                        )}
                                    </EventCard>
                                )}
                                {event.type === "arrived_receiver" && (
                                    <EventCard
                                        icon={Warehouse}
                                        iconColor="#DD9100"
                                        accentLeft="#DD9100"
                                        title="Driver Arrived at Receiver Address"
                                        subtitle={event.items.length > 1 ? `${event.items.length} orders for delivery` : `1 order for delivery`}
                                    >
                                        <Box sx={{ mt: 1 }}>
                                            <SectionLabel label="Orders Involved" color={eventColor} />
                                            <Typography variant="caption" display="block" sx={{ mt: 0.5, color: "text.secondary" }}>
                                                Receiver: {event.receiver_name ? <b>{event.receiver_name}</b> : '-'}
                                            </Typography>
                                            {event.items.map((item) => item.dispatch_order ? (<OrderTag color='#DD9100' key={item.id} order={item.dispatch_order} />) : null)}
                                        </Box>
                                    </EventCard>
                                )}
                                {event.type === "completed" && (
                                    <EventCard
                                        icon={CheckCircle}
                                        iconColor="#DD9100"
                                        accentLeft="#DD9100"
                                        title="Driver Departed from Receiver"
                                        subtitle="Delivery completed — orders signed off"
                                    >
                                        <Box sx={{ mt: 1 }}>
                                            <SectionLabel label="Delivered Orders" color={eventColor} />
                                            <Typography variant="caption" display="block" sx={{ mt: 0.5, color: "text.secondary" }}>
                                                Receiver: {event.receiver_name ? <b>{event.receiver_name}</b> : '-'}
                                            </Typography>
                                            {event.items.map((item) => item.dispatch_order ? (<OrderTag color='#DD9100' key={item.id} order={item.dispatch_order} freight={item.freight_details} />) : null)}
                                        </Box>
                                        {(event.signed_by || event.signature_img) && (
                                            <Box sx={{ mt: 2 }}>
                                                <Divider sx={{ mb: 1.5 }}>
                                                    <Chip
                                                        icon={<AssignmentTurnedIn sx={{ fontSize: "14px !important" }} />}
                                                        label="Completed Shipment at Receiver"
                                                        size="small"
                                                        sx={{ fontSize: 13, fontWeight: 700, bgcolor: signatureBg, color: eventColor, border: `1px solid ${signatureBorder}`, "& .MuiChip-icon": { color: eventColor } }}
                                                    />
                                                </Divider>
                                                {(event.signed_by || event.signature_img) ? (<Box sx={{ mb: 1.5 }}><SignatureBlock signedBy={event.signed_by} signatureImg={event.signature_img} color={signatureBg} borderColor={signatureBorder} /></Box>) : null}
                                            </Box>
                                        )}
                                    </EventCard>
                                )}
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
            </Timeline>
        </Box>
    );
}