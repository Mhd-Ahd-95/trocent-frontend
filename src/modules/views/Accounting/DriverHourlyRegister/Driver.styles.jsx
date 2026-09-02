import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export default makeStyles({ name: 'Billing' })((theme) => {

    const isDark = theme.palette.mode === 'dark';
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const success = theme.palette.success.main;
    const error = theme.palette.error.main;

    return {
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
            background: theme.palette.grey[100],
            borderBottom: '1px solid',
            borderColor: theme.palette.grey[300],
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
            fontWeight: 600,
            color: secondary,
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
            padding: theme.spacing(1, 2.5, 2),
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
            background: isDark ? alpha('#fff', 0.03) : theme.palette.grey[200],
        },
        statTileHighlight: {
            background: alpha(primary, 0.2),
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

        daysTableWrap: {
            borderRadius: 10,
            border: `1px solid ${isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.1)}`,
            overflow: 'hidden',
        },
        daysTableHeaderRow: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(1, 2),
            background: isDark ? alpha('#fff', 0.03) : theme.palette.grey[100],
            borderBottom: `1px solid ${isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.08)}`,
        },
        daysTableHeaderCell: {
            fontSize: 11.5,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: theme.palette.text.secondary,
        },
        dayRow: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(1.25, 2),
            borderBottom: `1px solid ${isDark ? alpha('#fff', 0.05) : alpha(secondary, 0.05)}`,
            '&:last-child': { borderBottom: 'none' },
        },
        dayCellPrimary: {
            fontSize: 13,
            fontWeight: 700,
            color: isDark ? '#fff' : '#0f172a',
        },
        dayCellValue: {
            fontSize: 13,
            fontWeight: 600,
            color: isDark ? '#fff' : '#0f172a',
        },
        dayNoteText: {
            fontSize: 12,
            color: theme.palette.text.secondary,
            fontStyle: 'italic',
            marginTop: 2,
        },

        companySummaryBand: {
            borderRadius: 16,
            padding: theme.spacing(2, 2.25),
            background: isDark
                ? `linear-gradient(135deg, ${alpha(secondary, 0.9)} 0%, ${alpha(secondary, 0.55)} 100%)`
                : `linear-gradient(135deg, ${secondary} 0%, ${alpha(secondary, 0.85)} 100%)`,
            boxShadow: `0 8px 24px ${alpha(secondary, 0.28)}`,
            marginBottom: theme.spacing(2),
        },
        companySummaryRow: {
            display: 'flex',
            alignItems: 'stretch',
            flexWrap: 'nowrap',
            gap: theme.spacing(1.5),
            overflowX: 'auto',
        },
        companyStatTile: {
            flex: '1 1 0',
            boxSizing: 'border-box',
            borderRadius: 10,
            padding: theme.spacing(1.25, 1.5),
            textAlign: 'center',
            background: alpha('#fff', 0.1),
            border: '1px solid',
            borderColor: alpha('#fff', 0.16),
            backdropFilter: 'blur(6px)',
        },
        companyStatTileHighlight: {
            background: `linear-gradient(135deg, ${primary} 0%, ${alpha(primary, 0.75)} 100%)`,
            border: '1px solid',
            borderColor: alpha(primary, 0.5),
            boxShadow: `0 4px 16px ${alpha(primary, 0.45)}`,
        },
        companyStatLabel: {
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: alpha('#fff', 0.75),
            marginBottom: 4,
            whiteSpace: 'nowrap',
        },
        companyStatLabelHighlight: {
            color: alpha('#fff', 1),
        },
        companyStatValue: {
            fontSize: 16,
            fontWeight: 800,
            color: '#fff',
            whiteSpace: 'nowrap',
        },
        companyStatValueHighlight: {
            fontSize: 18,
            fontWeight: 900,
            color: '#fff',
        },
        companyDivider: {
            width: 1,
            alignSelf: 'stretch',
            background: alpha('#fff', 0.22),
            flexShrink: 0,
        },
        companyRunningTotalGroup: {
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),
            paddingLeft: theme.spacing(0.5),
        },
        companyGeneratePdfButton: {
            height: 40,
            padding: theme.spacing(0, 2.25),
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 9,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            background: primary,
            color: '#fff',
            boxShadow: 'none',
            border: '2px solid ' + primary,
            '&:hover': {
                background: alpha(primary, 0.8),
                boxShadow: 'none',
            },
        },
        extraChargesHeaderLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1.25),
        },
        extraChargesIconBadge: {
            width: 32,
            height: 32,
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: `linear-gradient(135deg, ${primary} 0%, ${alpha(primary, 0.7)} 100%)`,
            color: '#fff',
            boxShadow: `0 3px 10px ${alpha(primary, 0.35)}`,
        },
        extraChargesTitle: {
            fontSize: 13,
            fontWeight: 800,
            color: isDark ? '#fff' : '#0f172a',
            lineHeight: 1.3,
        },
        extraChargesSubtitle: {
            fontSize: 11,
            fontWeight: 600,
            color: theme.palette.text.secondary,
        },
        extraChargesWrap: {
            padding: 5,
            overflow: 'auto',
            paddingBottom: 10,
        },
        extraChargesList: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(1.5, 1.25),
            gap: 15,
        },
        extraChargeCard: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1.25),
            padding: theme.spacing(1, 1.25),
            borderRadius: 10,
            transition: 'background-color 0.15s ease',
            background: isDark ? alpha('#fff', 0.03) : alpha(secondary, 0.09),
        },
        extraChargeCardEditing: {
            background: isDark ? alpha(primary, 0.08) : alpha(primary, 0.06),
            border: '1px solid',
            borderColor: alpha(primary, 0.3),
            gap: theme.spacing(1),
        },
        extraChargeIndex: {
            fontSize: 12,
            fontWeight: 800,
            color: isDark ? alpha('#fff', 0.3) : alpha(secondary, 0.5),
            fontVariantNumeric: 'tabular-nums',
            width: 20,
            flexShrink: 0,
        },
        extraChargeContent: {
            flex: 1,
            minWidth: 0,
        },
        extraChargeNote: {
            fontSize: 15,
            fontWeight: 600,
            color: isDark ? '#fff' : '#1e293b',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        extraChargePrice: {
            fontSize: 16,
            fontWeight: 800,
            color: success,
            whiteSpace: 'nowrap',
            flexShrink: 0,
        },
        extraChargeActions: {
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexShrink: 0,
        },
        extraChargeActionBtn: {
            width: 26,
            height: 26,
            color: theme.palette.text.disabled,
            '&:hover': {
                color: primary,
                background: alpha(primary, 0.08),
            },
        },
        extraChargeDeleteBtn: {
            '&:hover': {
                color: error,
                background: alpha(error, 0.08),
            },
        },
        extraChargeEditField: {
            '& .MuiOutlinedInput-root': {
                height: 34,
                fontSize: 12.5,
                fontWeight: 600,
                borderRadius: 7,
                background: theme.palette.background.paper,
            },
        },
        extraChargeEditPriceField: {
            width: 110,
            flexShrink: 0,
        },
        extraChargeSaveBtn: {
            width: 26,
            height: 26,
            color: theme.palette.success.main,
            '&:hover': {
                background: alpha(theme.palette.success.main, 0.1),
            },
            '&.Mui-disabled': {
                color: theme.palette.text.disabled,
            },
        },
    };
});