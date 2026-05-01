import { alpha } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme, props) => {
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    const statusColors = {
        dispatched: { bg: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.dark, border: alpha(theme.palette.info.main, 0.3) },
        'picked up': { bg: alpha(primary, 0.1), color: theme.palette.primary.dark, border: alpha(primary, 0.3) },
        delivered: { bg: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.dark, border: alpha(theme.palette.success.main, 0.3) },
        completed: { bg: alpha(theme.palette.success.main, 0.15), color: theme.palette.success.dark, border: alpha(theme.palette.success.main, 0.4) },
    };

    return {

        '@keyframes fadeUp': {
            from: { opacity: 0, transform: 'translateY(12px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
        },

        '@keyframes blink': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.2 },
        },

        // ─── Page ─────────────────────────────────────────────────────
        page: {
            paddingBottom: 40,
            animation: '$fadeUp 0.4s ease both',
        },

        // ─── Trip Banner ──────────────────────────────────────────────
        tripBanner: {
            background: secondary,
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
        },

        tripBannerLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
        },

        tripBannerIcon: {
            width: 38,
            height: 38,
            borderRadius: 10,
            background: alpha(primary, 0.15),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },

        tripBannerTitle: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 17,
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1,
        },

        tripBannerSub: {
            fontSize: 11,
            fontWeight: 500,
            color: alpha('#fff', 0.5),
            marginTop: 3,
        },

        tripBannerRight: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 4,
        },

        liveChip: {
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: alpha(primary, 0.2),
            border: `1px solid ${alpha(primary, 0.5)}`,
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 10,
            fontWeight: 800,
            color: primary,
            letterSpacing: '0.08em',
            userSelect: 'none',
        },

        liveDot: {
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: primary,
            animation: '$blink 1.2s ease-in-out infinite',
        },

        tripProgress: {
            fontSize: 11,
            color: alpha('#fff', 0.45),
            fontWeight: 600,
        },

        // ─── Order Card ───────────────────────────────────────────────
        orderCard: {
            background: theme.palette.background.paper,
            border: `1px solid ${alpha(secondary, 0.12)}`,
            borderRadius: 14,
            overflow: 'hidden',
            marginBottom: 12,
        },

        // ─── Order Card Header (always visible) ───────────────────────
        orderCardHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 14px',
            cursor: 'default',
            background: alpha(secondary, 0.03),
            borderBottom: `1px solid ${alpha(secondary, 0.08)}`,
        },

        orderStopBadge: {
            width: 26,
            height: 26,
            borderRadius: 7,
            background: secondary,
            color: '#fff',
            fontSize: 11,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },

        orderCardHeaderInfo: {
            flex: 1,
            minWidth: 0,
        },

        orderCardHeaderTitle: {
            fontSize: 12,
            fontWeight: 700,
            color: secondary,
        },

        orderCardHeaderSub: {
            fontSize: 11,
            color: secondaryLight,
            fontWeight: 500,
            marginTop: 1,
        },

        orderTotalChip: {
            fontSize: 10,
            fontWeight: 700,
            color: secondaryLight,
            background: alpha(secondary, 0.07),
            border: `1px solid ${alpha(secondary, 0.12)}`,
            borderRadius: 5,
            padding: '2px 7px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },

        // ─── Leg Row (accordion trigger) ──────────────────────────────
        legRow: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 14px',
            cursor: 'pointer',
            transition: 'background 0.15s',
            borderBottom: `1px solid ${alpha(secondary, 0.07)}`,
            '&:last-child': {
                borderBottom: 'none',
            },
            '&:hover': {
                background: alpha(secondary, 0.04),
            },
        },

        legRowExpanded: {
            background: alpha(secondary, 0.03),
        },

        // colored left dot per leg type
        legDot: {
            width: 8,
            height: 8,
            borderRadius: '50%',
            flexShrink: 0,
        },

        legDotPickup: { background: theme.palette.success.main },
        legDotDelivery: { background: theme.palette.info.main },

        legRowInfo: {
            flex: 1,
            minWidth: 0,
        },

        legRowType: {
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.1em',
            marginBottom: 2,
        },

        legRowTypePickup: { color: theme.palette.success.dark },
        legRowTypeDelivery: { color: theme.palette.info.dark },

        legRowName: {
            fontSize: 13,
            fontWeight: 700,
            color: secondary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },

        legRowAddress: {
            fontSize: 11,
            color: secondaryLight,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: 1,
        },

        legRowRight: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 4,
            flexShrink: 0,
        },

        statusChip: {
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.08em',
            borderRadius: 5,
            padding: '2px 7px',
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
        },

        expandIcon: {
            fontSize: '16px !important',
            color: secondaryLight,
            transition: 'transform 0.25s ease',
        },

        expandIconOpen: {
            transform: 'rotate(180deg)',
        },

        // ─── Collapse body ────────────────────────────────────────────
        collapseBody: {
            padding: '12px 14px 14px',
            borderTop: `1px solid ${alpha(secondary, 0.08)}`,
            background: alpha(secondary, 0.02),
        },

        // ─── Detail rows inside collapse ──────────────────────────────
        detailSection: {
            marginBottom: 12,
        },

        detailSectionLast: {
            marginBottom: 0,
        },

        detailLabel: {
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: alpha(secondary, 0.38),
            marginBottom: 6,
        },

        detailRow: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 7,
            marginBottom: 5,
            '&:last-child': { marginBottom: 0 },
        },

        detailIcon: {
            fontSize: '13px !important',
            color: secondaryLight,
            flexShrink: 0,
            marginTop: 1,
        },

        detailText: {
            fontSize: 12,
            color: secondary,
            fontWeight: 500,
            lineHeight: 1.5,
            flex: 1,
        },

        detailTextMuted: {
            color: secondaryLight,
        },

        // special instructions warning box
        instructionsBox: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 7,
            padding: '8px 10px',
            background: alpha(theme.palette.warning.main, 0.08),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.22)}`,
            borderRadius: 8,
            marginTop: 8,
        },

        instructionsIcon: {
            fontSize: '13px !important',
            color: theme.palette.warning.main,
            flexShrink: 0,
            marginTop: 1,
        },

        instructionsText: {
            fontSize: 11,
            color: theme.palette.warning.dark,
            fontWeight: 500,
            lineHeight: 1.5,
        },

        // ─── Inner divider ────────────────────────────────────────────
        innerDivider: {
            borderTop: `1px dashed ${alpha(secondary, 0.1)}`,
            margin: '10px 0',
        },

        // ─── Freight ──────────────────────────────────────────────────
        freightItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 0',
            borderBottom: `1px solid ${alpha(secondary, 0.06)}`,
            '&:last-of-type': { borderBottom: 'none' },
        },

        freightItemLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
        },

        freightPieceBadge: {
            minWidth: 22,
            height: 22,
            borderRadius: 5,
            background: alpha(secondary, 0.09),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 800,
            color: secondary,
            padding: '0 4px',
            flexShrink: 0,
        },

        freightType: {
            fontSize: 12,
            fontWeight: 700,
            color: secondary,
        },

        freightDesc: {
            fontSize: 11,
            color: secondaryLight,
        },

        freightDims: {
            fontSize: 10,
            fontWeight: 600,
            color: alpha(secondary, 0.4),
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'right',
        },

        freightTotalsRow: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingTop: 8,
            marginTop: 6,
            borderTop: `1px solid ${alpha(secondary, 0.1)}`,
        },

        freightTotalItem: {
            display: 'flex',
            alignItems: 'baseline',
            gap: 3,
        },

        freightTotalNum: {
            fontSize: 14,
            fontWeight: 800,
            color: secondary,
            fontVariantNumeric: 'tabular-nums',
        },

        freightTotalUnit: {
            fontSize: 10,
            fontWeight: 700,
            color: secondaryLight,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },

        freightTotalSep: {
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: alpha(secondary, 0.2),
        },

        // ─── Action button ────────────────────────────────────────────
        actionRow: {
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: 10,
            marginTop: 2,
        },

        actionBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 9,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.04em',
            transition: 'background 0.15s, transform 0.1s',
            border: 'none',
            '&:active': { transform: 'scale(0.97)' },
        },

        actionBtnPickup: {
            background: alpha(theme.palette.success.main, 0.12),
            color: theme.palette.success.dark,
            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
            '&:hover': { background: alpha(theme.palette.success.main, 0.2) },
        },

        actionBtnDelivery: {
            background: alpha(theme.palette.info.main, 0.12),
            color: theme.palette.info.dark,
            border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
            '&:hover': { background: alpha(theme.palette.info.main, 0.2) },
        },

        // ─── Empty ────────────────────────────────────────────────────
        emptyState: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            gap: 6,
        },

        emptyText: {
            fontSize: 14,
            fontWeight: 700,
            color: secondaryLight,
        },

        emptySubText: {
            fontSize: 12,
            color: alpha(secondary, 0.35),
        },
    };
});