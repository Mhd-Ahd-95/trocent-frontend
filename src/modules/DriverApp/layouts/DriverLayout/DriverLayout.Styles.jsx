import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme) => ({

    root: {
        background: theme.palette.background.default,
        color: theme.palette.secondary.main,
        height: '100vh',
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
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        background: theme.palette.background.paper,
        boxShadow: '0 0 60px rgba(0,0,0,0.08)',
    },
    content: {
        width: '100%',
        height: '100%',
        overflow: 'hidden auto',
        padding: '10px 20px'
    },
    bottomNav: {
        position: 'sticky',
        bottom: 0,
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${theme.palette.secondary.main}14`,
        display: 'flex',
        padding: '5px 0 20px',
        animation: '$slideUp 0.5s 0.4s ease both',
    },

    '@keyframes slideUp': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },

    navItem: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'center',
        gap: 4,
        cursor: 'pointer',
        padding: '6px 0',
        transition: 'opacity 0.2s',
        '&:not($navItemActive):hover': {
            opacity: 0.65,
        },
    },

    navItemActive: {},

    navIcon: {
        fontSize: 20,
        lineHeight: 1,
        color: theme.palette.secondary.light,
    },

    navIconActive: {
        color: `${theme.palette.primary.main} !important`,
    },

    navLabel: {
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: 0.5,
        color: theme.palette.secondary.light,
    },

    navLabelActive: {
        color: `${theme.palette.primary.main} !important`,
    },
}));