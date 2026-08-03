import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export default makeStyles({ name: 'Billing' })((theme) => {

    const isDark = theme.palette.mode === 'dark';
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    return {
        toolbarRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: theme.spacing(1),
        },
        toolbarButton: {
            height: 32,
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 8,
        },
        emptyState: {
            padding: theme.spacing(8),
            textAlign: 'center',
            border: '1px dashed',
            borderColor: isDark ? alpha('#fff', 0.15) : alpha(secondary, 0.2),
            borderRadius: 14,
            color: theme.palette.text.secondary,
        },
        listWrap: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
            transition: 'opacity 0.15s ease',
        },
        listWrapFetching: {
            opacity: 0.5,
        },
        paginationBar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: theme.spacing(1.5),
            padding: theme.spacing(2, 0.5, 0.5),
        },
        paginationInfo: {
            fontSize: 12.5,
            color: theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
        },
        rowsPerPageSelect: {
            height: 32,
            fontSize: 12.5,
            fontWeight: 600,
            borderRadius: 8,
        },
        muiPaginationRoot: {
            '& .MuiPaginationItem-root': {
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 9,
            },
            '& .Mui-selected': {
                background: `${primary} !important`,
                color: '#fff',
                boxShadow: `0 3px 10px ${alpha(primary, 0.4)}`,
            },
        },

        dateGroupRoot: {
            border: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.1) : alpha(secondary, 0.12),
            borderRadius: 12,
            overflow: 'hidden',
            background: theme.palette.background.paper,
        },
        summaryHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(1, 2.5),
            cursor: 'pointer',
            background: alpha(primary, 0.12),
            borderBottom: '1px solid',
            borderColor: alpha(primary, 0.35),
            transition: 'background-color 0.15s ease',
        },
        summaryHeaderExpanded: {
            background: alpha(primary, 0.18),
        },
        dateHeading: {
            fontWeight: 800,
            fontSize: 15,
            color: isDark ? '#fff' : secondary,
        },
        orderCountText: {
            fontSize: 11.5,
            fontWeight: 700,
            color: primary,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            marginTop: 2,
        },
        toggleIcon: {
            width: 32,
            height: 32,
            borderRadius: 8,
            background: primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease',
            flexShrink: 0,
        },
        toggleIconOpen: {
            transform: 'rotate(90deg)',
        },
        summaryBody: {
            padding: theme.spacing(1, 2.5),
        },
        summaryRow: {
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
            background: isDark ? alpha('#fff', 0.03) : theme.palette.grey[100],
        },
        statTileHighlight: {
            background: alpha(primary, 0.12),
        },
        statLabel: {
            fontSize: 12,
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
        divider: {
            width: 1,
            alignSelf: 'stretch',
            background: isDark ? alpha('#fff', 0.1) : alpha(secondary, 0.15),
            flexShrink: 0,
        },
        runningTotalGroup: {
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),
            paddingLeft: theme.spacing(0.5),
        },
        runningTotalLabel: {
            fontSize: 12.5,
            color: theme.palette.text.secondary,
            whiteSpace: 'nowrap',
        },
        runningTotalSign: {
            fontSize: 15,
            color: isDark ? '#fff' : secondary,
        },
        runningTotalInput: {
            width: 130,
            '& .MuiOutlinedInput-root': {
                height: 40,
                fontSize: 14.5,
                fontWeight: 600,
                borderRadius: 8,
            },
        },
        approveButton: {
            height: 40,
            padding: theme.spacing(0, 2.5),
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 8,
            whiteSpace: 'nowrap',
            flexShrink: 0,
        },
        approvedChip: {
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            height: 40,
            padding: theme.spacing(0, 1.75),
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            color: theme.palette.success.main,
            background: alpha(theme.palette.success.main, 0.12),
            whiteSpace: 'nowrap',
            flexShrink: 0,
        },
    };
});