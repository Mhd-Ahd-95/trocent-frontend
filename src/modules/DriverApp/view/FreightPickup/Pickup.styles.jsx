import { alpha } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme) => {
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;
    const success = theme.palette.success.main;
    return {

        '@keyframes fadeUp': {
            from: { opacity: 0, transform: 'translateY(14px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
        },

        '@keyframes successPop': {
            '0%': { transform: 'scale(0.85)', opacity: 0 },
            '70%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)', opacity: 1 },
        },

        backRow: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'flex-end',
            gap: 4,
            marginBottom: 5,
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
            gap: 12,
            marginBottom: 20,
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

        accordionBadge: {
            fontSize: 11,
            fontWeight: 800,
            color: theme.palette.success.dark,
            background: alpha(success, 0.1),
            border: `1px solid ${alpha(success, 0.3)}`,
            borderRadius: 5,
            padding: '2px 7px',
            letterSpacing: '0.06em',
        },

        accessorialList: {
            margin: '0 -16px',
        },

        accessorialItem: {
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '13px 16px',
            borderBottom: `1px solid ${alpha(secondary, 0.06)}`,
            cursor: 'pointer',
            transition: 'background 0.12s',
            '&:last-child': { borderBottom: 'none' },
            '&:hover': { background: alpha(secondary, 0.03) },
        },

        accessorialItemActive: {
            background: alpha(success, 0.04),
            '&:hover': { background: alpha(success, 0.08) },
        },

        accessorialCheck: {
            width: 26,
            height: 26,
            borderRadius: 7,
            border: `2px solid ${alpha(secondary, 0.2)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.15s, border-color 0.15s',
        },

        accessorialCheckActive: {
            background: success,
            borderColor: success,
        },

        accessorialCheckIcon: { fontSize: '16px !important', color: '#fff' },

        accessorialLabel: {
            fontSize: 16,
            fontWeight: 600,
            color: secondary,
            flex: 1,
            lineHeight: 1.3,
        },

        accessorialLabelActive: {
            fontWeight: 700,
        },

        signatureArea: {
            position: 'relative',
        },

        signatureCanvas: {
            width: '100%',
            height: 160,
            borderRadius: 12,
            border: `1.5px dashed ${alpha(secondary, 0.2)}`,
            background: alpha(secondary, 0.015),
            cursor: 'crosshair',
            display: 'block',
            touchAction: 'none',
        },

        signatureCanvasActive: {
            borderColor: alpha(primary, 0.4),
            background: alpha(primary, 0.02),
        },

        signatureHint: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 15,
            color: alpha(secondary, 0.25),
            fontWeight: 500,
            pointerEvents: 'none',
            userSelect: 'none',
            textAlign: 'center',
        },

        signatureFooter: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingTop: 10,
        },

        clearBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 14px',
            borderRadius: 8,
            border: `1px solid ${alpha(secondary, 0.15)}`,
            background: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            color: secondaryLight,
            transition: 'background 0.12s',
            '&:hover': { background: alpha(secondary, 0.05) },
        },

        clearIcon: { fontSize: '15px !important' },

        actionsWrap: {
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 6,
        },

        actionBtn: {
            width: '100%',
            padding: '18px 20px',
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
            '&:disabled': { opacity: 0.45, cursor: 'not-allowed' },
        },

        actionBtnComplete: {
            background: secondary,
            color: '#fff',
            boxShadow: `0 4px 20px ${alpha(secondary, 0.25)}`,
            '&:hover:not(:disabled)': {
                opacity: 0.9,
                boxShadow: `0 6px 24px ${alpha(secondary, 0.35)}`,
            },
        },

        successWrap: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 16,
            animation: '$successPop 0.45s ease both',
            textAlign: 'center',
            padding: '0 24px',
        },

        successIcon: {
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: alpha(success, 0.12),
            border: `2px solid ${alpha(success, 0.3)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },

        successTitle: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 26,
            fontWeight: 800,
            color: secondary,
            lineHeight: 1.2,
        },

        successSub: {
            fontSize: 16,
            color: secondaryLight,
            fontWeight: 500,
            lineHeight: 1.5,
        },

        successOrderList: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
            marginTop: 4,
        },

        successOrderChip: {
            fontSize: 14,
            fontWeight: 700,
            color: theme.palette.success.dark,
            background: alpha(success, 0.1),
            border: `1px solid ${alpha(success, 0.3)}`,
            borderRadius: 8,
            padding: '5px 12px',
        },
    };
});