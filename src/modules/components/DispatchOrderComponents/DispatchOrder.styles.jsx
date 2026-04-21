import { makeStyles } from 'tss-react/mui';

export const useTripRowStyles = makeStyles()((theme, { isActive, isToday, expanded }) => ({

    accordion: {
        overflow: 'hidden',
        border: '1.5px solid',
        borderColor: expanded ? theme.palette.primary.main : theme.palette.divider,
        borderRadius: 8,
        overflowX: 'auto',
        backgroundColor: isToday
            ? `${theme.palette.primary.main}17`
            : theme.palette.background.paper,
        '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: theme.shadows[2],
        },
        '&:before': {
            display: 'none',
        },
        '&.Mui-expanded': {
            margin: 0,
        },
    },

    accordionHeader: {
        paddingInline: theme.spacing(1.5),
        paddingBlock: theme.spacing(0.5),
        cursor: 'pointer',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
    },

    tripIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: isActive ? `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})` : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isActive ? `0 2px 8px ${theme.palette.success.main}66` : `0 2px 8px ${theme.palette.primary.main}66`,
        flexShrink: 0,
        transition: 'background 0.3s, box-shadow 0.3s',
    },

    driverLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: '0.75rem',
        color: isActive ? theme.palette.success.main : theme.palette.text.secondary,
        fontWeight: isActive ? 600 : 400,
        transition: 'color 0.3s',
    },

    driverName: {
        fontSize: '0.875rem',
        fontWeight: isActive ? 700 : 600,
        color: isActive ? theme.palette.success.main : theme.palette.text.primary,
        transition: 'color 0.3s',
    },

    pulseDotWrapper: {
        position: 'relative',
        width: 10,
        height: 10,
        flexShrink: 0,
    },

    pulseRing: {
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        backgroundColor: theme.palette.success.main,
        animation: 'pulseRing 1.4s ease-out infinite',
        '@keyframes pulseRing': {
            '0%': { transform: 'scale(0.8)', opacity: 1 },
            '100%': { transform: 'scale(2.2)', opacity: 0 },
        },
    },

    pulseDot: {
        position: 'absolute',
        inset: 1,
        borderRadius: '50%',
        backgroundColor: theme.palette.success.main,
        animation: 'pulseDot 1.4s ease-in-out infinite',
        '@keyframes pulseDot': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 },
        },
    },

    accordionDetails: {
        backgroundColor: theme.palette.grey[50],
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1),
    },

    showCompletedBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        paddingInline: theme.spacing(1.5),
        paddingBlock: theme.spacing(0.5),
        borderRadius: 8,
        cursor: 'pointer',
        border: '1px dashed',
        borderColor: 'rgba(0,0,0,0.1)',
        color: theme.palette.text.secondary,
        fontSize: 12,
        fontWeight: 600,
        transition: 'all 0.15s',
        '&:hover': {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            backgroundColor: `${theme.palette.primary.main}14`,
        },
    },

    expandIcon: {
        fontSize: 15,
        transition: 'transform 0.2s',
    },

}));

export const useOrderCardStyles = makeStyles()((theme, { orderStatus }) => ({

    paper: {
        paddingBlock: 0,
        paddingInline: theme.spacing(1),
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: 8,
        backgroundColor: theme.palette.background.paper,
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
            height: 6,
        },
    },

    gridContainer: {
        cursor: 'pointer',
        minHeight: 50,
    },

    orderLink: {
        textDecoration: 'none',
    },

    sectionLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: '0.75rem',
        fontWeight: 600,
    },

    shipperLabel: {
        color: theme.palette.success.main,
    },

    receiverLabel: {
        color: theme.palette.info.main,
    },

    addressText: {
        fontSize: 14,
        color: theme.palette.text.secondary,
    },

    specialInstructions: {
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        fontSize: 12,
        color: theme.palette.text.secondary,
    },

    serviceChip: {
        marginTop: theme.spacing(0.5),
        height: 20,
        fontSize: '0.8rem',
    },

    statusChipPickedUp: {
        height: 22,
        fontSize: '0.7rem',
        letterSpacing: '0.1px',
        marginTop: -4,
        marginLeft: 20,
        animation: 'pulseGreen 1.5s infinite',
        '@keyframes pulseGreen': {
            '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)' },
            '70%': { boxShadow: '0 0 0 8px rgba(76, 175, 80, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
        },
    },

    statusChipArrived: {
        height: 22,
        fontSize: '0.7rem',
        letterSpacing: '0.1px',
        marginTop: -4,
        marginLeft: 20,
        animation: 'pulseAmber 1.5s infinite',
        '@keyframes pulseAmber': {
            '0%': { boxShadow: '0 0 0 0 rgba(235, 176, 65, 0.7)' },
            '70%': { boxShadow: '0 0 0 8px rgba(235, 176, 65, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(235, 176, 65, 0)' },
        },
    },

    statusChipDelivered: {
        height: 22,
        fontSize: '0.8rem',
        marginTop: -4,
        marginLeft: 20,
    },

    actionsStack: {
        height: '100%',
        justifyContent: 'center',
    },

    undispatchBtn: {
        '&:hover': {
            backgroundColor: theme.palette.error.light + '33',
        },
    },

    updateStatusBtn: {
        '&:hover': {
            backgroundColor: theme.palette.success.light + '33',
        },
    },

    addNoteBtn: {
        '&:hover': {
            backgroundColor: theme.palette.warning.light + '33',
        },
    },

    referenceText: {
        fontSize: 11,
    },

    timeLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: '0.75rem',
        color: theme.palette.text.secondary,
        fontWeight: 500,
    },

}));