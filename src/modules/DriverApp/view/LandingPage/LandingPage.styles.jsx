import { alpha, colors } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme, props) => {

    const primaryColor = theme.palette.primary.main;

    return ({

        '@keyframes fadeUp': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
        },

        '@keyframes blink': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.25 },
        },

        hero: {
            padding: '24px 32px 0',
            animation: '$fadeUp 0.6s 0.1s ease both',
        },

        driverName: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 30,
            fontWeight: 800,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: theme.palette.secondary.main,
            '& em': {
                color: primaryColor,
                fontStyle: 'normal',
            },
        },

        driverMeta: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 10,
        },

        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.3,
        },

        badgeId: {
            background: `${theme.palette.secondary.main}12`,
            color: theme.palette.secondary.main,
            border: `1px solid ${theme.palette.secondary.main}25`,
        },

        tripsCard: {
            background: theme.palette.background.default,
            border: `1px solid ${theme.palette.secondary.main}14`,
            borderRadius: 15,
            overflow: 'hidden',
            animation: '$fadeUp 0.6s 0.15s ease both',
        },

        tripsCardHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px 12px',
            borderBottom: `1px solid ${theme.palette.secondary.main}0e`,
        },

        tripsCardLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
        },

        tripsCardIcon: {
            width: 28,
            height: 28,
            borderRadius: 8,
            background: `${primaryColor}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },

        tripsCardTitle: {
            fontSize: 13,
            fontWeight: 700,
            color: theme.palette.secondary.main,
            letterSpacing: 0.2,
        },

        tripsCount: {
            minWidth: 22,
            height: 22,
            borderRadius: 99,
            background: primaryColor,
            color: '#fff',
            fontSize: 11,
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 6px',
        },

        tripsList: {
            padding: '4px 0 6px',
        },

        tripItem: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: props?.isLocked ? 'not-allowed' : 'pointer',
            padding: '11px 18px',
            borderBottom: `1px solid ${theme.palette.secondary.main}08`,
            transition: 'background 0.15s, opacity 0.15s',
            background: props?.isSelected ? alpha(primaryColor, 0.4) : props?.index % 2 === 0 ? colors.grey[100] : colors.grey[50],
            position: 'relative',
            opacity: props?.isLocked ? 0.45 : 1,
            '&:last-child': {
                borderBottom: 'none',
            },
            '&:hover': {
                background: props?.isLocked
                    ? props?.index % 2 === 0 ? colors.grey[100] : colors.grey[50]
                    : props?.isSelected ? alpha(primaryColor, 0.6) : `${theme.palette.secondary.main}05`,
            },
        },

        tripItemActive: {
            background: `${primaryColor}09`,
            borderBottom: `1px solid ${primaryColor}18`,
            opacity: '1 !important',
            cursor: 'default',
            '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                background: primaryColor,
            },
            '&:hover': {
                background: `${primaryColor}09`,
            },
        },

        tripIndex: {
            width: 28,
            height: 28,
            borderRadius: 8,
            background: `${theme.palette.secondary.main}0d`,
            color: theme.palette.secondary.light,
            fontSize: 12,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontFamily: 'Inter, sans-serif',
        },

        tripIndexActive: {
            background: `${primaryColor}18`,
            color: primaryColor,
        },

        tripInfo: {
            flex: 1,
            minWidth: 0,
        },

        tripNumber: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 800,
            color: theme.palette.secondary.main,
            letterSpacing: '-0.01em',
            fontVariantNumeric: 'tabular-nums',
        },

        tripDate: {
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            color: props?.isToday ? '#2ecc8d' : theme.palette.secondary.light,
            fontWeight: 500,
        },

        tripRight: {
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            flexShrink: 0,
        },

        liveBadge: {
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: `${primaryColor}18`,
            border: `1px solid ${primaryColor}55`,
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 10,
            fontWeight: 800,
            color: theme.palette.primary.dark,
            letterSpacing: '0.06em',
            flexShrink: 0,
            userSelect: 'none',
        },

        liveDot: {
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: primaryColor,
            flexShrink: 0,
            animation: '$blink 1.2s ease-in-out infinite',
        },

        tripBadge: {
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.1em',
            borderRadius: 6,
            padding: '3px 7px',
            flexShrink: 0,
        },

        tripBadgeToday: {
            background: 'rgba(46,204,141,0.12)',
            color: '#1a8a5a',
            border: '1px solid rgba(46,204,141,0.28)',
        },

        tripBadgeUpcoming: {
            background: `${theme.palette.secondary.main}0d`,
            color: theme.palette.secondary.light,
            border: `1px solid ${theme.palette.secondary.main}20`,
        },

        tripBadgeOlder: {
            background: `${theme.palette.error.main}0d`,
            color: theme.palette.error.light,
            border: `1px solid ${theme.palette.error.main}20`,
        },

        noTrips: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '28px 16px',
            gap: 6,
        },

        noTripsIcon: {
            fontSize: 32,
            marginBottom: 4,
            opacity: 0.35,
        },

        noTripsText: {
            fontSize: 14,
            fontWeight: 700,
            color: theme.palette.secondary.light,
        },

        noTripsSub: {
            fontSize: 12,
            color: `${theme.palette.secondary.light}99`,
            fontWeight: 500,
        },

        actionBtn: {
            borderRadius: 16,
            padding: '20px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            outline: 'none',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s, background 0.2s',
            textDecoration: 'none',
            '&:active:not([disabled])': {
                transform: 'scale(0.97)',
            },
        },

        actionBtnPrimary: {
            background: alpha(primaryColor, 0.1),
            color: primaryColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: `1px solid ${primaryColor}`,
            cursor: 'pointer',
            '&:hover:not([disabled])': {
                background: alpha(primaryColor, 0.2),
            },
            '&[disabled]': {
                opacity: 0.38,
                cursor: 'not-allowed',
                border: `1px solid ${theme.palette.secondary.main}30`,
                background: `${theme.palette.secondary.main}08`,
                color: theme.palette.secondary.light,
                '& $btnArrow': {
                    color: theme.palette.secondary.light,
                },
            },
        },

        actionBtnSecondary: {
            background: alpha(theme.palette.info.main, 0.1),
            color: theme.palette.info.main,
            border: `1px solid ${theme.palette.info.main}`,
            cursor: 'pointer',
            '&:hover:not([disabled])': {
                background: alpha(theme.palette.info.main, 0.2),
            },
            '&[disabled]': {
                opacity: 0.38,
                cursor: 'not-allowed',
                border: `1px solid ${theme.palette.secondary.main}30`,
                background: `${theme.palette.secondary.main}08`,
                color: theme.palette.secondary.light,
            },
        },

        actionBtnTertiary: {
            background: '#eaf9f3',
            color: '#1a8a5a',
            border: '1px solid #1a8a5a',
            cursor: 'pointer',
            '&:hover:not([disabled])': {
                background: '#d8f5ea',
            },
            '&[disabled]': {
                opacity: 0.38,
                cursor: 'not-allowed',
            },
        },

        btnIcon: {
            width: 42,
            height: 42,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
        },

        btnIconPrimary: {
            background: primaryColor,
            width: 50,
            height: 50,
        },

        btnIconSecondary: {
            background: `${theme.palette.secondary.main}0d`,
        },

        btnIconTertiary: {
            background: 'rgba(26,138,90,0.12)',
        },

        btnTitle: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            lineHeight: 1,
            color: 'inherit',
        },

        btnTitlePrimary: {
            fontSize: 20,
            color: primaryColor,
        },

        btnSubtitle: {
            fontSize: 11,
            fontWeight: 500,
            opacity: 0.65,
            marginTop: 3,
            color: 'inherit',
        },

        btnArrow: {
            fontSize: 22,
            fontWeight: 700,
            color: primaryColor,
        },

        btnLeftGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: 16,
        },

        hoursChip: {
            background: `${theme.palette.info.main}0d`,
            border: `1px solid ${theme.palette.info.main}30`,
            borderRadius: 14,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: '$fadeUp 0.6s 0.25s ease both',
        },

        hoursLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
        },

        hoursIcon: {
            color: theme.palette.info.main,
        },

        hoursTitle: {
            fontSize: 11,
            fontWeight: 700,
            color: theme.palette.info.main,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
        },

        hoursValue: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1.1,
            color: theme.palette.secondary.main,
        },

        statCard: {
            background: theme.palette.background.default,
            border: `1px solid ${theme.palette.secondary.main}14`,
            borderRadius: 14,
            padding: '10px 12px',
            textAlign: 'center',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            cursor: 'default',
            '&:hover': {
                borderColor: `${primaryColor}40`,
                boxShadow: `0 4px 16px ${primaryColor}18`,
            },
        },

        statNumber: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 32,
            fontWeight: 800,
            lineHeight: 1,
            color: theme.palette.secondary.main,
        },

        statNumberGold: { color: primaryColor },
        statNumberGreen: { color: '#1a8a5a' },
        statNumberBlue: { color: theme.palette.info.main },

        statLabel: {
            fontSize: 10,
            fontWeight: 700,
            color: theme.palette.secondary.light,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            marginTop: 4,
        },
    });
});