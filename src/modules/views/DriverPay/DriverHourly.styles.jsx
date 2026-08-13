import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export default makeStyles({ name: 'DriverHourly' })((theme) => {

    const isDark = theme.palette.mode === 'dark';
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const success = theme.palette.success.main;
    const warning = theme.palette.warning.main;
    const error = theme.palette.error.main;
    const trip = theme.palette.info.main;
    const divider = isDark ? alpha('#fff', 0.12) : alpha(secondary, 0.15);

    return {
        tableContainer: {
            borderRadius: 10,
            border: `2px solid ${divider}`,
            overflow: 'hidden',
        },
        headerCell: {
            fontSize: 14,
            fontWeight: 800,
            // textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: isDark ? '#fff' : '#000',
            background: isDark ? alpha('#fff', 0.04) : alpha(secondary, 0.06),
            padding: theme.spacing(1, 2),
            borderBottom: `2px solid ${divider}`,
            borderRight: `1px solid ${divider}`,
            '&:last-child': {
                borderRight: 'none',
            },
        },
        valueRow: {
            '& > .MuiTableCell-root': {
                borderBottom: 'none',
            },
        },
        bodyCell: {
            padding: theme.spacing(1.5, 2, 1),
            borderRight: `1px solid ${divider}`,
            '&:last-child': {
                borderRight: 'none',
            },
        },
        dateText: {
            fontSize: 14,
            fontWeight: 700,
            color: isDark ? '#fff' : secondary,
            whiteSpace: 'nowrap',
        },
        routeCity: {
            fontSize: 13,
            fontWeight: 600,
            color: theme.palette.text.secondary,
        },
        routeArrow: {
            fontSize: 16,
            flexShrink: 0,
            color: alpha(primary, 0.8),
        },
        summaryValue: {
            fontSize: 13.5,
            fontWeight: 700,
            whiteSpace: 'nowrap',
        },

        diffChip: {
            fontWeight: 800,
            fontSize: 12.5,
            height: 26,
            borderRadius: 8,
            '& .MuiChip-icon': {
                marginLeft: 6,
            },
        },
        diffChipGood: { background: alpha(success, 0.12), color: success },
        diffChipWarn: { background: alpha(warning, 0.14), color: warning },
        diffChipBad: { background: alpha(error, 0.12), color: error },
        diffChipNeutral: { background: alpha(secondary, 0.08), color: theme.palette.text.secondary },
        adjustmentField: {
            width: '100%',
            '& .MuiOutlinedInput-root': {
                height: 32,
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
            },
        },
        timelineRow: {
            '& > .MuiTableCell-root': {
                borderBottom: `1px solid ${divider}`,
            },
            '&:hover': {
                background: isDark ? alpha('#fff', 0.02) : alpha(secondary, 0.02),
            },
        },
        timelineCell: {
            padding: theme.spacing(1, 2, 1.5),
        },
        timelineTitleRow: {
            display: 'flex',
            alignItems: 'center'
        },
        timelineArrowRow: {
            display: 'flex',
        },
        timelineValueRow: {
            display: 'flex',
            alignItems: 'center',
            marginTop: 1,
        },
        timelineColumn: {
            minWidth: 0,
        },
        timelineTitle: {
            fontSize: 13,
            fontWeight: 800,
            textTransform: 'capitalize',
        },
        timelineArrow: {
            fontSize: 15,
            color: theme.palette.text.disabled,
        },
        timelineNodeValue: {
            fontSize: 13.5,
            fontWeight: 700,
            whiteSpace: 'nowrap',
        },

        timelineSegment: {
            position: 'relative',
            height: 0,
            margin: theme.spacing(0, 0.5),
        },
        timelineSegmentIdle: {
            borderTop: `4px solid ${warning}`,
        },
        timelineSegmentActive: {
            borderTop: `4px solid ${trip}`,
        },
        timelineSegmentValue: {
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translate(-50%, -50%)',
            background: theme.palette.background.paper,
            padding: theme.spacing(0, 0.75),
            fontSize: 11.5,
            fontWeight: 700,
            whiteSpace: 'nowrap',
        },
        timelineSegmentValueIdle: {
            color: warning,
        },
        timelineSegmentValueActive: {
            color: trip,
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
        labelText: {
            fontSize: 12,
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
        tripColumn: {
            backgroundColor: isDark ? alpha('#fff', 0.04) : theme.palette.grey[100],
            borderBottom: `1px solid ${isDark ? alpha('#fff', 0.1) : alpha(secondary, 0.12)}`,
            fontSize: 13,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: isDark ? theme.palette.grey[400] : theme.palette.grey[600],
            whiteSpace: 'nowrap',
            padding: theme.spacing(1.5, 2),
        },
    };
});