import React from 'react';
import { Collapse } from '@mui/material';
import { Notifications, Check } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

const useStyles = makeStyles()((theme) => {

    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    return {
        '@keyframes pulseRing': {
            '0%': { transform: 'scale(0.95)', boxShadow: `0 0 0 0 ${alpha(primary, 0.7)}` },
            '70%': { transform: 'scale(1)', boxShadow: `0 0 0 10px ${alpha(primary, 0)}` },
            '100%': { transform: 'scale(0.95)', boxShadow: `0 0 0 0 ${alpha(primary, 0)}` },
        },

        '@keyframes shimmer': {
            '0%': { backgroundPosition: '-200% center' },
            '100%': { backgroundPosition: '200% center' },
        },

        '@keyframes slideDown': {
            from: { opacity: 0, transform: 'translateY(-16px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
        },

        '@keyframes dotBlink': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.2 },
        },

        wrapper: {
            animation: '$slideDown 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
            marginBottom: theme.spacing(2),
        },

        banner: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px 14px 14px',
            borderRadius: 15,
            background: secondary,
            border: `1.5px solid ${primary}`,
            boxShadow: `0 0 0 0 ${alpha(primary, 0.5)}, 0 4px 24px ${alpha(secondary, 0.35)}`,
            animation: '$pulseRing 2s ease-in-out infinite',
            overflow: 'hidden',
        },

        shimmerOverlay: {
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(105deg, transparent 40%, ${alpha(primary, 0.08)} 50%, transparent 60%)`,
            backgroundSize: '200% 100%',
            animation: '$shimmer 3s linear infinite',
            borderRadius: 'inherit',
            pointerEvents: 'none',
        },

        iconWrap: {
            position: 'relative',
            width: 42,
            height: 42,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: alpha(primary, 0.15),
            borderRadius: 11,
            border: `1px solid ${alpha(primary, 0.35)}`,
        },

        dot: {
            position: 'absolute',
            top: 6,
            right: 6,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: primary,
            border: `1.5px solid ${secondary}`,
            animation: '$dotBlink 1.4s ease-in-out infinite',
        },

        label: {
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: primary,
            textTransform: 'uppercase',
            marginBottom: 2,
        },

        message: {
            fontSize: 14,
            fontWeight: 600,
            color: '#e8edf2',
            letterSpacing: '0.4px',
            lineHeight: 1.35,
            '& strong': {
                color: primary,
                fontWeight: 800,
            },
        },

        tripRef: {
            color: primary,
            fontWeight: 800,
        },

        textGroup: {
            flex: 1,
            minWidth: 0,
        },

        ackButton: {
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 14px',
            borderRadius: 10,
            border: `1.5px solid ${primary}`,
            background: alpha(primary, 0),
            color: primary,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'capitilize',
            flexShrink: 0,
            transition: 'background 0.18s, box-shadow 0.18s, transform 0.15s',
            outline: 'none',
            '&:hover': {
                background: alpha(primary, 0.22),
            },
            '&:active': {
                transform: 'scale(0.97)',
            },
        },

        ackIcon: {
            fontSize: '18px !important',
        },
    };
});


export default function DriverNotificationBanner({ tripNumber, message, onAcknowledge, visible = true }) {

    const { classes } = useStyles();
    const defaultMessage = (<>Your trip (<span className={classes.tripRef}>#{tripNumber}</span>) has been updated with new orders.</>);

    return (
        <Collapse in={visible} unmountOnExit>
            <div className={classes.wrapper}>
                <div className={classes.banner}>
                    <div className={classes.shimmerOverlay} />
                    <div className={classes.iconWrap}>
                        <Notifications sx={{ fontSize: 20, color: '#DD9100' }} />
                        <span className={classes.dot} />
                    </div>
                    <div className={classes.textGroup}>
                        <div className={classes.label}>● New Notification</div>
                        <div className={classes.message}>
                            {message ?? defaultMessage}
                        </div>
                    </div>
                    <button className={classes.ackButton} onClick={onAcknowledge}>
                        <Check className={classes.ackIcon} />
                        Acknowledge
                    </button>
                </div>
            </div>
        </Collapse>
    );
}