import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export default makeStyles({ name: 'DriverClockHistory' })((theme) => {
    const isDark = theme.palette.mode === 'dark';
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const success = theme.palette.success.main;
    const warning = theme.palette.warning.main;
    const error = theme.palette.error.main;
    const divider = isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.1);

    return {
        root: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        },
        tabsBar: {
            borderBottom: `1px solid ${divider}`,
            flexShrink: 0,
        },
        tabRoot: {
            textTransform: 'none',
            fontWeight: 700,
            fontSize: 13.5,
            minHeight: 44,
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
                color: primary,
            },
        },
        tabIndicator: {
            backgroundColor: primary,
            height: 2.5,
            borderRadius: 3,
        },

        listWrap: {
            flex: 1,
            overflowY: 'auto',
            padding: theme.spacing(1, 1.5, 2),
        },

        emptyState: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: theme.spacing(6, 2),
            color: theme.palette.text.secondary,
        },
        emptyIcon: {
            fontSize: 32,
            opacity: 0.35,
        },
        emptyText: {
            fontSize: 13.5,
            fontWeight: 600,
        },

        row: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: theme.spacing(1.1, 1.25),
            borderRadius: 10,
            borderBottom: `1px solid ${divider}`,
            transition: 'background-color 0.15s ease',
            '&:hover': {
                background: isDark ? alpha('#fff', 0.03) : alpha(secondary, 0.03),
            },
        },
        rowEditing: {
            background: alpha(primary, 0.06),
            '&:hover': {
                background: alpha(primary, 0.06),
            },
        },

        rowIcon: {
            width: 28,
            height: 28,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: isDark ? alpha('#fff', 0.05) : alpha(secondary, 0.06),
        },

        dateCol: {
            flexShrink: 0,
            width: 96,
        },
        dateText: {
            fontSize: 12.5,
            fontWeight: 700,
            color: isDark ? '#fff' : '#0f172a',
            lineHeight: 1.25,
        },
        subText: {
            fontSize: 10.5,
            color: theme.palette.text.secondary,
            marginTop: 1,
        },

        valuesInline: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            minWidth: 0,
        },
        valueText: {
            fontSize: 13,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: isDark ? '#fff' : '#0f172a',
            whiteSpace: 'nowrap',
        },
        valueDash: {
            color: theme.palette.text.disabled,
            fontWeight: 500,
        },
        arrowIcon: {
            fontSize: 14,
            color: theme.palette.text.disabled,
            flexShrink: 0,
        },

        editRow: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        editField: {
            // width: 130,
            // flexShrink: 0,
            '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
            },
        },

        actions: {
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexShrink: 0,
        },
        editBtn: {
            color: theme.palette.text.disabled,
            '&:hover': {
                color: primary,
                background: alpha(primary, 0.08),
            },
        },
        saveBtn: {
            color: success,
            '&:hover': { background: alpha(success, 0.1) },
        },
        cancelBtn: {
            color: error,
            '&:hover': { background: alpha(error, 0.1) },
        },

        skeletonRow: {
            borderRadius: 10,
            marginBottom: theme.spacing(0.75),
        },
    };
});