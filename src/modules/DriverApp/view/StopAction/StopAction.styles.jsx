import { alpha } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme) => {
    const primary        = theme.palette.primary.main;
    const secondary      = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;
    const success        = theme.palette.success.main;
    const info           = theme.palette.info.main;
    const error          = theme.palette.error.main;
    const warning        = theme.palette.warning.main;

    return {

        '@keyframes fadeUp': {
            from: { opacity: 0, transform: 'translateY(12px)' },
            to:   { opacity: 1, transform: 'translateY(0)' },
        },

        '@keyframes slideDown': {
            from: { opacity: 0, transform: 'translateY(-6px)' },
            to:   { opacity: 1, transform: 'translateY(0)' },
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

        savedComment: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: '10px 14px',
            background: alpha(primary, 0.05),
            borderTop: `1px solid ${alpha(primary, 0.1)}`,
        },

        savedCommentIcon: { fontSize: '15px !important', color: primary, flexShrink: 0, marginTop: 1 },

        savedCommentText: {
            fontSize: 14,
            color: secondary,
            fontWeight: 500,
            lineHeight: 1.5,
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
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.08em',
            borderRadius: 5,
            padding: '3px 8px',
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            flexShrink: 0,
        },

        statusDispatched:       { background: alpha(info, 0.1),    color: theme.palette.info.dark,    border: `1px solid ${alpha(info, 0.3)}` },
        statusArrivedShipper:   { background: alpha(warning, 0.1), color: theme.palette.warning.dark, border: `1px solid ${alpha(warning, 0.3)}` },
        statusPickedUp:         { background: alpha(success, 0.1), color: theme.palette.success.dark, border: `1px solid ${alpha(success, 0.3)}` },
        statusDelivered:        { background: alpha(success, 0.15),color: theme.palette.success.dark, border: `1px solid ${alpha(success, 0.4)}` },
        statusCompleted:        { background: alpha(success, 0.15),color: theme.palette.success.dark, border: `1px solid ${alpha(success, 0.4)}` },

        serviceRush:    { background: alpha(error, 0.1),        color: theme.palette.error.dark,    border: `1px solid ${alpha(error, 0.3)}` },
        serviceRegular: { background: alpha(info, 0.1),         color: theme.palette.info.dark,     border: `1px solid ${alpha(info, 0.3)}` },
        serviceDirect:  { background: 'rgba(142,68,173,0.1)',   color: '#6c3483',                   border: '1px solid rgba(142,68,173,0.3)' },

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
    };
});