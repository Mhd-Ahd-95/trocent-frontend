import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export default makeStyles({ name: 'DriverHourlyCard' })((theme) => {
    const isDark = theme.palette.mode === 'dark';
    const secondary = theme.palette.secondary.main;
    const primary = theme.palette.primary.main;
    const success = theme.palette.success.main;
    const warning = theme.palette.warning.main;
    const error = theme.palette.error.main;
    const info = theme.palette.info.main;

    return {
        root: {
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.1) : alpha(secondary, 0.12),
            background: theme.palette.background.paper,
        },

        statsRow: {
            display: 'flex',
            alignItems: 'stretch',
            flexWrap: 'nowrap',
            gap: theme.spacing(1.5),
            overflowX: 'auto',
        },
        statTile: {
            flex: '1 1 0',
            boxSizing: 'border-box',
            borderRadius: 8,
            padding: theme.spacing(1.25, 1.5),
            textAlign: 'center',
            background: isDark ? alpha('#fff', 0.03) : theme.palette.grey[200],
        },
        statTileHighlight: {
            background: alpha(primary, 0.2),
        },
        statLabel: {
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            color: theme.palette.text.secondary,
            marginBottom: 4,
            whiteSpace: 'nowrap',
        },
        statLabelHighlight: {
            fontWeight: 800,
            color: primary,
        },
        statValue: {
            fontSize: 14,
            fontWeight: 800,
            color: isDark ? '#fff' : '#000',
            whiteSpace: 'nowrap',
        },
        statValueHighlight: {
            fontSize: 15,
            fontWeight: 700,
            color: primary,
        },
        statCell: {
            flex: '1 1 0',
            minWidth: 130,
            padding: theme.spacing(1.5, 2.25),
            borderRight: '1px solid',
            borderBottom: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.08),
            '&:last-child': { borderRight: 'none' },
        },
        statValue: {
            fontSize: 19,
            fontWeight: 800,
            color: isDark ? '#fff' : '#0f172a',
        },
        statValueError: { color: `${error} !important` },
        statValueSuccess: { color: `${success} !important` },
        tableHeaderRow: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(1.5, 2.5),
            background: isDark ? alpha('#fff', 0.02) : theme.palette.grey[50],
            borderBottom: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.08),
        },
        tableHeaderCell: {
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: theme.palette.text.secondary,
        },

        row: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(1.25, 2.5),
            borderBottom: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.06) : alpha(secondary, 0.06),
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            '&:hover': {
                background: isDark ? alpha('#fff', 0.02) : alpha(secondary, 0.02),
            },
        },
        rowOpened: {
            background: alpha(primary, 0.1),
        },
        expandIcon: {
            fontSize: 16,
            color: theme.palette.text.disabled,
            transition: 'transform 0.15s ease',
            marginRight: 6,
        },
        expandIconOpen: {
            transform: 'rotate(90deg)',
        },
        dateText: {
            fontSize: 13.5,
            fontWeight: 700,
            color: isDark ? '#fff' : '#0f172a',
        },
        routeText: {
            fontSize: 12,
            color: theme.palette.text.secondary,
            marginTop: 1,
        },
        cellValue: {
            fontSize: 13,
            fontWeight: 700,
            color: isDark ? '#fff' : '#0f172a',
        },
        idleValue: {
            fontSize: 13,
            fontWeight: 600,
            color: theme.palette.text.secondary,
        },
        statusDot: {
            width: 7,
            height: 7,
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: 6,
        },
        statusText: {
            fontSize: 12.5,
            fontWeight: 700,
        },
        statusGood: { color: success },
        statusWarn: { color: warning },
        statusBad: { color: error },
        adjustField: {
            width: 120,
            '& .MuiOutlinedInput-root': {
                height: 32,
                fontSize: 12.5,
                fontWeight: 700,
                borderRadius: 7,
            },
        },

        timelineWrap: {
            padding: theme.spacing(0.5, 2.5, 2.5),
            background: isDark ? alpha('#fff', 0.015) : alpha(secondary, 0.015),
            borderBottom: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.06) : alpha(secondary, 0.06),
        },
        timelineBar: {
            display: 'flex',
            width: '100%',
            height: 20,
            borderRadius: 6,
            overflow: 'hidden',
            marginTop: 12,
        },
        segmentIdle: {
            background: `repeating-linear-gradient(135deg, ${alpha(warning, 0.35)}, ${alpha(warning, 0.35)} 4px, ${alpha(warning, 0.6)} 4px, ${alpha(warning, 0.6)} 8px)`,
        },
        segmentActive: {
            background: info,
        },
        timelineLabels: {
            display: 'flex',
            marginTop: 8,
        },
        tickTime: {
            fontSize: 12.5,
            fontWeight: 800,
            color: isDark ? '#fff' : '#0f172a',
            whiteSpace: 'nowrap',
        },
        tickDuration: {
            fontSize: 11.5,
            fontWeight: 700,
            color: theme.palette.text.secondary,
            marginLeft: 6,
        },
        tickCaption: {
            fontSize: 11,
            color: theme.palette.text.secondary,
            marginTop: 2,
            whiteSpace: 'nowrap',
        },

        detailGrid: {
            marginTop: 18,
        },
        noteField: {
            '& .MuiOutlinedInput-root': {
                fontSize: 12.5,
                borderRadius: 8,
                background: theme.palette.background.paper,
            },
        },
        whyBox: {
            padding: theme.spacing(1.5, 2),
        },
        whyTitle: {
            fontSize: 13,
            fontWeight: 800,
            marginBottom: 4,
        },
        whyText: {
            fontSize: 12.5,
            color: theme.palette.text.secondary,
            lineHeight: 1.5,
        },
    };
});