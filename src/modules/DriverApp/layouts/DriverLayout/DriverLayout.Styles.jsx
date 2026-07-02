import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme) => ({

    root: {
        background: theme.palette.background.default,
        color: theme.palette.secondary.main,
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
    },

    bgMesh: {
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '-30%',
            right: '-20%',
            width: 700,
            height: 700,
            background: `radial-gradient(circle, ${theme.palette.primary.main}18 0%, transparent 70%)`,
            animation: '$drift1 12s ease-in-out infinite alternate',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: 600,
            height: 600,
            background: `radial-gradient(circle, ${theme.palette.secondary.main}0d 0%, transparent 70%)`,
            animation: '$drift2 15s ease-in-out infinite alternate',
        },
    },

    '@keyframes drift1': {
        from: { transform: 'translate(0, 0) scale(1)' },
        to: { transform: 'translate(-40px, 30px) scale(1.1)' },
    },
    '@keyframes drift2': {
        from: { transform: 'translate(0, 0) scale(1)' },
        to: { transform: 'translate(30px, -40px) scale(1.12)' },
    },

    appWrapper: {
        position: 'relative',
        zIndex: 1,
        maxWidth: 800,
        margin: '0 auto',
        height: '100dvh',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        background: theme.palette.background.paper,
        boxShadow: '0 0 60px rgba(0,0,0,0.08)',
    },
    content: {
        width: '100%',
        flex: 1,
        overflow: 'hidden auto',
        padding: '10px 20px',
        [theme.breakpoints.down('sm')]: {
            padding: '8px 14px',
        },
    },
    bottomNav: {
        flexShrink: 0,
        position: 'sticky',
        bottom: 0,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1.5px solid ${theme.palette.secondary.main}20`,
        display: 'flex',
        alignItems: 'flex-start',
        paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        paddingTop: 6,
        animation: '$slideUp 0.5s 0.4s ease both',
        zIndex: 100,
    },
    '@keyframes slideUp': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
    navItem: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        cursor: 'pointer',
        minHeight: 56,
        padding: '8px 4px',
        transition: 'opacity 0.2s',
        WebkitTapHighlightColor: 'transparent',
        '&:not($navItemActive):hover': {
            opacity: 0.65,
        },
    },

    navItemActive: {},

    navIcon: {
        lineHeight: 1,
        color: theme.palette.secondary.light,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
            fontSize: '26px !important',
            [theme.breakpoints.down('sm')]: {
                fontSize: '28px !important',
            },
        },
    },

    navIconActive: {
        color: `${theme.palette.primary.main} !important`,
    },
    navLabel: {
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.4,
        color: theme.palette.secondary.light,
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('sm')]: {
            fontSize: 13,
            letterSpacing: 0.3,
        },
    },

    navLabelActive: {
        color: `${theme.palette.primary.main} !important`,
    },
    menuSheet: {
        maxWidth: 800,
        margin: '0 auto',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: '10px 0 calc(env(safe-area-inset-bottom, 16px) + 12px)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
    },

    sheetHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        background: theme.palette.secondary.main,
        opacity: 0.25,
        margin: '6px auto 14px',
    },

    sheetSection: {
        padding: '0 20px',
    },

    sheetSectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
        color: theme.palette.secondary.light,
    },

    sheetSectionTitle: {
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },

    langItem: {
        borderRadius: 12,
        marginBottom: 4,
        padding: '10px 12px',
        '&.Mui-selected': {
            background: `${theme.palette.primary.main}12`,
            '&:hover': {
                background: `${theme.palette.primary.main}1a`,
            },
        },
    },

    langPrimary: {
        fontSize: 15,
        fontWeight: 600,
        color: theme.palette.secondary.main,
    },

    langSecondary: {
        fontSize: 12,
        color: theme.palette.secondary.light,
    },

    langCheck: {
        minWidth: 'auto',
        color: theme.palette.primary.main,
        justifyContent: 'flex-end',
    },
}));