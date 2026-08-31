import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export default makeStyles({ name: 'Billing' })((theme, props) => {

    const isDark = theme.palette.mode === 'dark';
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    return {
        filterRoot: {
            borderRadius: 16,
            border: '1.5px solid',
            borderColor: isDark ? alpha('#fff', 0.1) : alpha(secondary, 0.14),
            backgroundColor: isDark ? alpha(secondary, 0.25) : alpha(theme.palette.background.default, 0.9),
            overflow: 'hidden',
            boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : `0 2px 12px ${alpha(secondary, 0.08)}`,
        },
        filterHeader: {
            padding: theme.spacing(1.25, 2.5),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'background 0.15s',
            '&:hover': {
                background: isDark ? alpha('#fff', 0.03) : alpha(primary, 0.04),
            },
        },
        filterHeaderLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1.25),
        },
        filterIconBadge: {
            width: 30,
            height: 30,
            borderRadius: 9,
            background: `linear-gradient(135deg, ${primary} 0%, ${alpha(primary, 0.7)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 2px 8px ${alpha(primary, 0.4)}`,
            flexShrink: 0,
        },
        filterTitle: {
            fontSize: 13,
            fontWeight: 700,
            color: isDark ? '#fff' : secondary,
            letterSpacing: '-0.01em',
        },
        filterCountChip: {
            height: 18,
            borderRadius: 6,
            background: primary,
            color: '#fff',
            fontSize: 10,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            padding: '0 7px',
        },
        filterChevron: {
            width: 26,
            height: 26,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDark ? alpha('#fff', 0.07) : alpha(secondary, 0.07),
            transition: 'transform 0.25s ease',
        },
        filterChevronOpen: {
            transform: 'rotate(180deg)',
        },
        filterBody: {
            padding: theme.spacing(2.5),
            paddingTop: theme.spacing(2),
            borderTop: '1.5px solid',
            borderColor: isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.1),
        },
        filterGrid: {
            display: 'grid',
            gap: theme.spacing(2),
            gridTemplateColumns: '1fr',
            [theme.breakpoints.up('sm')]: {
                gridTemplateColumns: '1fr 1fr',
            },
            [theme.breakpoints.up('md')]: {
                gridTemplateColumns: props?.isInvoicing ? 'repeat(4, 1fr)' : props?.commission ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
            },
        },
        labelText: {
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            opacity: 0.7,
            minHeight: 14,
        },
        driverMeta: {
            fontSize: 12.5,
            color: alpha('#000', 0.6),
            // marginTop: 1,
        },
        inputRoot: {
            '& .MuiOutlinedInput-root': {
                borderRadius: 5,
                backgroundColor: isDark ? alpha('#fff', 0.05) : theme.palette.background.paper,
                fontSize: 13,
                height: 40,
                fontWeight: 500,
                '& fieldset': {
                    borderColor: isDark ? alpha('#fff', 0.12) : alpha(secondary, 0.18),
                    borderWidth: 1.5,
                },
                '&:hover fieldset': {
                    borderColor: alpha(primary, 0.55),
                },
                '&.Mui-focused fieldset': {
                    borderColor: primary,
                    boxShadow: `0 0 0 3px ${alpha(primary, 0.15)}`,
                },
            },
        },
        searchButton: {
            height: 40,
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 13,
            textTransform: 'none',
            boxShadow: `0 3px 10px ${alpha(primary, 0.4)}`,
        },
        clearButton: {
            height: 40,
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 13,
            textTransform: 'none',
        },
        filterActionsRow: {
            marginTop: theme.spacing(1.5),
            display: 'flex',
            justifyContent: 'flex-end',
            gap: theme.spacing(1),
        },
        accordionRoot: {
            borderRadius: '14px !important',
            border: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.09) : alpha(secondary, 0.12),
            overflow: 'hidden',
            overflowX: 'auto',
            boxShadow: 'none',
            '&:before': {
                display: 'none',
            },
            '&.Mui-expanded': {
                margin: 0,
            },
        },
        accordionSummary: {
            position: 'relative',
            paddingLeft: theme.spacing(3.5),
            minHeight: 56,
            background: isDark ? alpha(secondary, 0.35) : alpha(secondary, 0.035),
            '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 5,
                background: `linear-gradient(180deg, ${primary} 0%, ${alpha(primary, 0.6)} 100%)`,
            },
            '&.Mui-expanded': {
                minHeight: 56,
                borderBottom: '1px solid',
                borderColor: isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.1),
            },
        },
        accordionSummaryContent: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: theme.spacing(1.5),
            flexWrap: 'wrap',
            width: '100%',
            paddingRight: theme.spacing(1),
        },
        customerIdentity: {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 0,
        },
        customerName: {
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.01em',
            color: isDark ? '#fff' : secondary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        customerMeta: {
            fontSize: 12,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            opacity: 0.75,
        },
        orderCountChip: {
            fontSize: 11,
            fontWeight: 800,
            height: 22,
            background: isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.08),
            color: isDark ? '#fff' : secondary,
        },
        accordionDetails: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1.5),
            padding: theme.spacing(1.5),
            background: isDark ? 'transparent' : alpha(secondary, 0.012),
        },
        payDate: {
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.01em',
            color: isDark ? '#fff' : secondary,
        }
    };
});