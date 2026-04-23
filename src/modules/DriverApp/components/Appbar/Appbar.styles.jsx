import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme) => ({
    topBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px 14px',
        borderBottom: `1px solid ${theme.palette.secondary.main}14`,
        background: theme.palette.background.paper,
        animation: '$slideDown 0.5s ease both',
    },

    '@keyframes slideDown': {
        from: { opacity: 0, transform: 'translateY(-16px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },

    logoMark: {
        fontSize: 24,
        fontWeight: 800,
        letterSpacing: 1,
        color: theme.palette.secondary.main,
    },

    avatarRing: {
        color: theme.palette.background.paper,
        background: theme.palette.common.black,
        cursor: "pointer  ",
        fontSize: 15,
        height: 40,
        width: 40,
        textTransform: 'uppercase'
    },
}));