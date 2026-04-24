import { alpha, colors } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme, props) => {

    return ({

        hero: {
            padding: '24px 32px 0',
            animation: '$fadeUp 0.6s 0.1s ease both',
        },

        '@keyframes fadeUp': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
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
                color: theme.palette.primary.main,
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
            borderRadius: 18,
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
            background: `${theme.palette.primary.main}18`,
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
            background: theme.palette.primary.main,
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
            cursor: 'pointer',
            padding: '11px 18px',
            borderBottom: `1px solid ${theme.palette.secondary.main}08`,
            transition: 'background 0.15s',
            background: props?.isSelected ? alpha(theme.palette.primary.main, 0.4) : props?.index % 2 === 0 ? colors.grey[100] : colors.grey[50],
            '&:last-child': {
                borderBottom: 'none',
            },
            '&:hover': {
                background: props?.isSelected ? alpha(theme.palette.primary.main, 0.6) : `${theme.palette.secondary.main}05`,
            },
        },

        tripItemToday: {
            background: `${theme.palette.primary.main}07`,
            '&:hover': {
                background: `${theme.palette.primary.main}10`,
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

        tripIndexToday: {
            background: `${theme.palette.primary.main}18`,
            color: theme.palette.primary.main,
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
            marginBottom: 2,
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

        tripDateDot: {
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: `${theme.palette.secondary.main}30`,
            flexShrink: 0,
        },

        tripDateDotToday: {
            background: '#2ecc8d',
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

        selectedTrip: {
            background: alpha(theme.palette.primary.main, 0.4),
            '&:hover': {
                background: alpha(theme.palette.primary.main, 0.6)
            }
        },

        tripBadgeUpcoming: {
            background: `${theme.palette.secondary.main}0d`,
            color: theme.palette.secondary.light,
            border: `1px solid ${theme.palette.secondary.main}20`,
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

        statsRow: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 14,
        },

        statCard: {
            background: theme.palette.background.default,
            border: `1px solid ${theme.palette.secondary.main}14`,
            borderRadius: 14,
            padding: '10px 12px',
            textAlign: 'center',
            transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
            cursor: 'default',
            '&:hover': {
                borderColor: `${theme.palette.primary.main}40`,
                boxShadow: `0 4px 16px ${theme.palette.primary.main}18`,
            },
        },

        statNumber: {
            fontFamily: 'Inter, sans-serif',
            fontSize: 32,
            fontWeight: 800,
            lineHeight: 1,
            color: theme.palette.secondary.main,
        },

        statNumberGold: { color: theme.palette.primary.main },
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
            color: theme.palette.info.main
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

        hoursBtn: {
            fontSize: 11,
            fontWeight: 700,
            color: theme.palette.info.main,
            background: `${theme.palette.info.main}14`,
            border: `1px solid ${theme.palette.info.main}35`,
            borderRadius: 8,
            padding: '7px 14px',
            cursor: 'pointer',
            letterSpacing: 0.5,
            transition: 'background 0.2s',
            '&:hover': {
                background: `${theme.palette.info.main}25`,
            },
        },

        sectionTitle: {
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: theme.palette.secondary.light,
            paddingTop: '10px',
            animation: '$fadeUp 0.6s 0.25s ease both',
        },

        actionGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
            animation: '$fadeUp 0.6s 0.3s ease both',
        },

        actionBtn: {
            borderRadius: 16,
            padding: '20px 18px',
            display: 'flex',
            // flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            textDecoration: 'none',
            '&:hover': {
                // transform: 'translateY(-3px)',
            },
            '&:active': {
                transform: 'scale(0.97)',
            },
        },

        actionBtnPrimary: {
            background: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: `1px solid ${theme.palette.primary.main}`,
            '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2)
            },
        },

        actionBtnSecondary: {
            background: alpha(theme.palette.info.main, 0.1),
            color: theme.palette.info.main,
            border: `1px solid ${theme.palette.info.main}`,
            '&:hover': {
                background: alpha(theme.palette.info.main, 0.2)
            },
        },

        actionBtnTertiary: {
            background: '#eaf9f3',
            color: '#1a8a5a',
            border: '1px solid #1a8a5a',
            '&:hover': {
                background: '#d8f5ea',
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
            background: theme.palette.primary.main,
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
            color: theme.palette.primary.main,
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
            color: theme.palette.primary.main,
        },

        btnLeftGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: 16,
        },

        activitySection: {
            animation: '$fadeUp 0.6s 0.35s ease both',
        },

        activityList: {
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
        },

        activityItem: {
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: theme.palette.background.default,
            border: `1px solid ${theme.palette.secondary.main}12`,
            borderRadius: 14,
            padding: '14px 16px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&:hover': {
                borderColor: `${theme.palette.primary.main}35`,
                boxShadow: `0 2px 12px ${theme.palette.primary.main}12`,
            },
        },

        activityDot: {
            width: 10,
            height: 10,
            borderRadius: '50%',
            flexShrink: 0,
        },

        dotGreen: { background: '#2ecc8d' },
        dotGold: { background: theme.palette.primary.main },
        dotBlue: { background: theme.palette.info.main },

        activityInfo: {
            flex: 1,
            minWidth: 0,
        },

        activityTitle: {
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: theme.palette.secondary.main,
        },

        activitySub: {
            fontSize: 11,
            color: theme.palette.secondary.light,
            marginTop: 1,
        },

        activityTime: {
            fontSize: 11,
            color: theme.palette.secondary.light,
            flexShrink: 0,
            fontWeight: 600,
        },
    })
});