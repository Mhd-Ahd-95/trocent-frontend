import { alpha } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const COLORS = {
    dark: '#2c3e50',
    darkLight: 'rgba(44,62,80,0.09)',
    darkBorder: 'rgba(44,62,80,0.07)',
    darkBorderMd: 'rgba(44,62,80,0.08)',
    darkBorderSm: 'rgba(44,62,80,0.05)',
    darkOverlay: 'rgba(44,62,80,0.025)',
    darkIcon: 'rgba(44,62,80,0.2)',

    textPrimary: '#161616',
    textSecondary: '#5b5d5e',
    textMuted: '#95a5a6',
    textLight: '#bdc3c7',
    white: '#fff',
    whiteAlpha48: 'rgba(255,255,255,0.48)',
    whiteAlpha42: 'rgba(255,255,255,0.42)',

    dispatchedBg: 'rgba(41,128,185,0.1)',
    dispatchedColor: '#1a5276',
    dispatchedBorder: 'rgba(41,128,185,0.3)',

    pickedUpBg: 'rgba(221,145,0,0.1)',
    pickedUpColor: '#7d5200',
    pickedUpBorder: 'rgba(221,145,0,0.3)',

    deliveredBg: 'rgba(39,174,96,0.1)',
    deliveredColor: '#1a5e35',
    deliveredBorder: 'rgba(39,174,96,0.3)',

    completedBg: 'rgba(39,174,96,0.15)',
    completedColor: '#1a5e35',
    completedBorder: 'rgba(39,174,96,0.4)',

    green: '#27ae60',
    greenCC: '#27ae60CC',
    greenBg: 'rgba(39,174,96,0.08)',
    greenBgHover: 'rgba(39,174,96,0.16)',
    greenBorder: 'rgba(39,174,96,0.18)',
    greenDone: '#1a5e35',
    greenDoneBg: 'rgba(39,174,96,0.1)',
    greenDoneBorder: 'rgba(39,174,96,0.25)',
    greenShadow: 'rgba(39,174,96,0.4)',

    blue: '#2980b9',
    blueCC: '#2980b9CC',
    blueBg: 'rgba(41,128,185,0.08)',
    blueBgHover: 'rgba(41,128,185,0.16)',
    blueBorder: 'rgba(41,128,185,0.18)',
    blueShadow: 'rgba(41,128,185,0.4)',

    amber: '#DD9100',
    amberBg: 'rgba(221,145,0,0.18)',
    amberBorder: 'rgba(221,145,0,0.45)',

    emptyIconBg: 'rgba(44,62,80,0.08)',
};

export default makeStyles()((theme) => {
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;
    const success = theme.palette.success.main;
    const info = theme.palette.info.main;
    const error = theme.palette.error.main;
    const warning = theme.palette.warning.main;

    return {
        '@keyframes fadeUp': {
            from: { opacity: 0, transform: 'translateY(12px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
        },

        '@keyframes slideDown': {
            from: { opacity: 0, transform: 'translateY(-6px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
        },

        page: {
            paddingBottom: 40,
            animation: '$fadeUp 0.35s ease both',
        },

        backRow: {
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 16,
            cursor: 'pointer',
            width: 'fit-content',
            color: secondaryLight,
            transition: 'color 0.15s',
            '&:hover': { color: secondary },
        },

        backIcon: { fontSize: '18px !important' },

        backLabel: {
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
        },

        pageTitle: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
        },

        pageTitleIcon: {
            width: 46,
            height: 46,
            borderRadius: 13,
            background: alpha(success, 0.1),
            border: `1px solid ${alpha(success, 0.22)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },

        pageTitleText: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 22,
            fontWeight: 800,
            color: secondary,
            lineHeight: 1,
        },

        pageTitleSub: {
            fontSize: 14,
            color: secondaryLight,
            marginTop: 4,
            fontWeight: 500,
        },

        card: {
            background: theme.palette.background.paper,
            border: `1px solid ${alpha(secondary, 0.1)}`,
            borderRadius: 14,
            overflow: 'hidden',
            marginBottom: 12,
        },

        cardHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 14px',
            borderBottom: `1px solid ${alpha(secondary, 0.07)}`,
            background: alpha(secondary, 0.025),
        },

        cardHeaderIcon: { fontSize: '16px !important', color: secondaryLight },

        cardHeaderTitle: {
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: secondary,
        },

        infoRow: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '12px 14px',
            borderBottom: `1px solid ${alpha(secondary, 0.06)}`,
            '&:last-child': { borderBottom: 'none' },
        },

        infoIconWrap: {
            width: 30,
            height: 30,
            borderRadius: 8,
            background: alpha(secondary, 0.06),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
        },

        infoIcon: { fontSize: '15px !important', color: secondaryLight },

        infoLabel: {
            fontSize: 11,
            fontWeight: 700,
            color: alpha(secondary, 0.38),
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            lineHeight: 1,
            marginBottom: 4,
        },

        infoValue: {
            fontSize: 15,
            fontWeight: 600,
            color: secondary,
            lineHeight: 1.4,
        },

        infoValueMuted: {
            fontSize: 13,
            fontWeight: 400,
            color: secondaryLight,
            lineHeight: 1.4,
        },

        infoValuePhone: {
            fontSize: 15,
            fontWeight: 700,
            color: info,
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
        },

        commentToggleBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '12px 14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.12s',
            '&:hover': { background: alpha(secondary, 0.03) },
        },

        commentToggleBtnBordered: {
            borderBottom: `1px solid ${alpha(secondary, 0.07)}`,
        },

        commentToggleIcon: {
            width: 30,
            height: 30,
            borderRadius: 8,
            background: alpha(primary, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },

        commentToggleLabel: {
            flex: 1,
            textAlign: 'left',
            fontSize: 15,
            fontWeight: 700,
            color: secondary,
        },

        commentChevron: {
            fontSize: '18px !important',
            color: secondaryLight,
            transition: 'transform 0.25s',
        },

        commentChevronOpen: { transform: 'rotate(180deg)' },

        commentBody: {
            padding: '12px 14px',
            animation: '$slideDown 0.2s ease both',
        },

        commentInput: {
            width: '100%',
            minHeight: 100,
            padding: '12px 14px',
            border: `1px solid ${alpha(secondary, 0.18)}`,
            borderRadius: 10,
            fontSize: 15,
            fontFamily: 'Inter, sans-serif',
            color: secondary,
            background: alpha(secondary, 0.02),
            resize: 'vertical',
            outline: 'none',
            lineHeight: 1.5,
            boxSizing: 'border-box',
            transition: 'border-color 0.15s, background 0.15s',
            '&:focus': { borderColor: alpha(primary, 0.5), background: '#fff' },
            '&::placeholder': { color: alpha(secondary, 0.3) },
        },

        commentCharCount: {
            fontSize: 13,
            color: alpha(secondary, 0.35),
            fontWeight: 500,
        },

        commentCancelBtn: {
            padding: '10px 16px',
            borderRadius: 8,
            border: `1px solid ${alpha(secondary, 0.15)}`,
            background: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: secondaryLight,
            transition: 'background 0.12s',
            '&:hover': { background: alpha(secondary, 0.05) },
        },

        commentSaveBtn: {
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: primary,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            '&:hover': { opacity: 0.88 },
            '&:active': { transform: 'scale(0.97)' },
            '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
        },

        freightBillItem: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            borderBottom: `1px solid ${alpha(secondary, 0.06)}`,
            cursor: 'pointer',
            transition: 'background 0.12s',
            '&:last-child': { borderBottom: 'none' },
            '&:hover': { background: alpha(secondary, 0.03) },
        },

        freightBillItemOpen: {
           background: alpha(secondary, 0.1)
        },

        freightBillItemCollapse: {
            borderBottom: `1px solid ${alpha(secondary, 0.06)}`,
        },

        freightBillCheck: {
            width: 22,
            height: 22,
            borderRadius: 6,
            border: `2px solid ${alpha(secondary, 0.2)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.15s, border-color 0.15s',
        },

        freightBillCheckActive: {
            background: success,
            borderColor: success,
        },

        freightBillCheckIcon: { fontSize: '14px !important', color: '#fff' },

        freightBillInfo: { flex: 1, minWidth: 0 },

        freightBillOrderNum: {
            fontSize: 15,
            fontWeight: 800,
            color: secondary,
            lineHeight: 1.2,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
        },

        freightBillSub: {
            fontSize: 13,
            color: secondaryLight,
            fontWeight: 500,
            marginTop: 3,
        },

        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.08em',
            borderRadius: 5,
            padding: '3px 8px',
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            flexShrink: 0,
        },

        statusDispatched: { background: alpha(info, 0.1), color: theme.palette.info.dark, border: `1px solid ${alpha(info, 0.3)}` },
        statusArrivedShipper: { background: alpha(warning, 0.1), color: theme.palette.warning.dark, border: `1px solid ${alpha(warning, 0.3)}` },
        statusPickedUp: { background: alpha(success, 0.1), color: theme.palette.success.dark, border: `1px solid ${alpha(success, 0.3)}` },
        statusDelivered: { background: alpha(success, 0.15), color: theme.palette.success.dark, border: `1px solid ${alpha(success, 0.4)}` },
        statusCompleted: { background: alpha(success, 0.15), color: theme.palette.success.dark, border: `1px solid ${alpha(success, 0.4)}` },

        serviceRush: { background: alpha(error, 0.1), color: theme.palette.error.dark, border: `1px solid ${alpha(error, 0.3)}` },
        serviceRegular: { background: alpha(info, 0.1), color: theme.palette.info.dark, border: `1px solid ${alpha(info, 0.3)}` },
        serviceDirect: { background: 'rgba(142,68,173,0.1)', color: '#6c3483', border: '1px solid rgba(142,68,173,0.3)' },

        thisOrderTag: {
            fontSize: 10,
            fontWeight: 700,
            color: theme.palette.primary.dark,
            background: alpha(primary, 0.1),
            border: `1px solid ${alpha(primary, 0.3)}`,
            borderRadius: 4,
            padding: '1px 6px',
            letterSpacing: '0.06em',
        },

        actionsCard: {
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 4,
        },

        actionBtn: {
            width: '100%',
            padding: '17px 20px',
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'opacity 0.15s, transform 0.1s, box-shadow 0.15s',
            '&:active:not(:disabled)': { transform: 'scale(0.98)' },
        },

        actionBtnArrive: {
            background: secondary,
            color: '#fff',
            '&:hover': {
                opacity: 0.88,
                boxShadow: `0 4px 16px ${alpha(secondary, 0.25)}`,
            },
        },

        actionBtnArrived: {
            background: alpha(success, 0.1),
            color: theme.palette.success.dark,
            border: `1px solid ${alpha(success, 0.3)}`,
            cursor: 'default',
        },

        actionBtnDisabled: {
            background: alpha(secondary, 0.08),
            color: alpha(secondary, 0.35),
            border: `1px solid ${alpha(secondary, 0.12)}`,
            cursor: 'not-allowed',
        },

        actionBtnPickup: {
            background: success,
            color: '#fff',
            boxShadow: `0 4px 18px ${alpha(success, 0.3)}`,
            '&:hover': { boxShadow: `0 6px 22px ${alpha(success, 0.4)}` },
        },

        actionBtnDone: {
            background: alpha(success, 0.1),
            color: theme.palette.success.dark,
            border: `1px solid ${alpha(success, 0.3)}`,
            cursor: 'default',
        },
        freightHeaderRow: {
            padding: '4px 8px',
            marginBottom: 4,
            background: COLORS.darkLight,
        },
        freightHeaderText: {
            fontWeight: 700,
        },
        freightRow: {
            padding: '6px 8px',
            borderRadius: 4,
            '&:not(:last-child)': {
                borderBottom: `1px solid ${COLORS.darkBorderSm}`,
            },
        },
        freightPieceBadge: {
            width: 20,
            height: 20,
            borderRadius: 5,
            background: COLORS.darkLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 800,
        },
        freightType: {
            fontSize: 13,
            fontWeight: 700,
            color: COLORS.dark,
        },
        freightDims: {
            fontSize: 13,
            fontWeight: 500,
            color: COLORS.dark,
            fontVariantNumeric: 'tabular-nums',
        },
        freightDesc: {
            fontSize: 13,
            color: COLORS.dark,
        },
        freightTotalsRow: {
            display: 'flex',
            gap: 16,
            marginTop: 8,
            paddingTop: 8,
            justifyContent: 'flex-end',
            borderTop: `1px solid ${COLORS.darkBorderMd}`,
            paddingLeft: 8,
            paddingRight: 8,
            alignItems: 'center',
        },
        freightTotalNumber: {
            fontSize: 15,
            fontWeight: 800,
            color: COLORS.dark,
            fontVariantNumeric: 'tabular-nums',
        },
        freightTotalUnit: {
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
        freightTotalDot: {
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: COLORS.darkIcon,
            alignSelf: 'center',
        },
        legDetailLabel: {
            fontSize: 12,
            fontWeight: 700,
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 3.2,
        },
        legDetailValue: {
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.dark,
        },
        legDetailInstructions: {
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.5,
        },
        legDetailInstructionsText: { color: COLORS.dark },
        legDetailInstructionsEmpty: { color: COLORS.textLight },
    };
});