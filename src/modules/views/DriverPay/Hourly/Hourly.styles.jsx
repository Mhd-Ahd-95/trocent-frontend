import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export default makeStyles({ name: 'DriverPay' })((theme) => {

    const isDark = theme.palette.mode === 'dark';
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const success = theme.palette.success.main;
    const warning = theme.palette.warning.main;
    const error = theme.palette.error.main;
    const info = theme.palette.info.main;
    const divider = isDark ? alpha('#fff', 0.12) : alpha(secondary, 0.15);

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
        accordionDetails: {
            padding: theme.spacing(1.5, 2.5, 2.5),
            background: theme.palette.background.paper,
        },
        customerIdentity: {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        },
        customerName: {
            fontSize: 14,
            fontWeight: 800,
            color: isDark ? '#fff' : '#0f172a',
            lineHeight: 1.2,
        },
        extraChargesWrap: {
            marginBottom: theme.spacing(2.5),
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.25) : alpha('#ccc', 0.6),
            // background: isDark
            //     ? `linear-gradient(180deg, ${alpha(primary, 0.08)} 0%, ${alpha('#fff', 0.02)} 100%)`
            //     : `linear-gradient(180deg, ${alpha(primary, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
        },
        extraChargesHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: theme.spacing(1.5),
            padding: theme.spacing(0.8, 2),
            borderBottom: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.06) : alpha('#ccc', 0.6),
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
        extraChargesTotalPill: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: theme.spacing(0.5, 1.75),
            borderRadius: 10,
            background: isDark ? alpha(success, 0.12) : alpha(success, 0.08),
            flexShrink: 0,
        },
        extraChargesTotalLabel: {
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: alpha(success, 0.9),
            lineHeight: 1.4,
        },
        extraChargesTotalValue: {
            fontSize: 15,
            fontWeight: 800,
            color: success,
            lineHeight: 1.2,
        },
        extraChargesList: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(1, 1.25),
            gap: 5,
        },
        extraChargeCard: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1.25),
            padding: theme.spacing(1, 1.25),
            borderRadius: 10,
            transition: 'background-color 0.15s ease',
            background: isDark ? alpha('#fff', 0.03) : alpha(secondary, 0.035),
            // '&:hover extraChargeActions': {
            //     opacity: 1,
            // },
        },
        extraChargeIndex: {
            fontSize: 10.5,
            fontWeight: 800,
            color: isDark ? alpha('#fff', 0.3) : alpha(secondary, 0.35),
            fontVariantNumeric: 'tabular-nums',
            width: 20,
            flexShrink: 0,
        },
        extraChargeContent: {
            flex: 1,
            minWidth: 0,
        },
        extraChargeNote: {
            fontSize: 14,
            fontWeight: 600,
            color: isDark ? '#fff' : '#1e293b',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        extraChargePrice: {
            fontSize: 15,
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
            opacity: 1,
            transition: 'opacity 0.15s ease',
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

        root: {
            borderRadius: 14,
            border: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.1),
            background: isDark ? alpha('#fff', 0.015) : theme.palette.grey[50],
            overflow: 'hidden',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(1.5, 2.5),
            borderBottom: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.06) : alpha(secondary, 0.08),
            background: theme.palette.background.paper,
        },
        driverInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1.5),
        },
        actions: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
        },
        avatar: {
            width: 34,
            height: 34,
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 12.5,
            fontWeight: 800,
            flexShrink: 0,
        },
        identity: {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        },
        name: {
            fontSize: 14,
            fontWeight: 800,
            color: isDark ? '#fff' : '#0f172a',
            lineHeight: 1.2,
        },
        metaRow: {
            display: 'flex',
            alignItems: 'center',
            gap: 6,
        },
        meta: {
            fontSize: 11.5,
            fontWeight: 600,
            color: theme.palette.text.secondary,
        },
        customerMeta: {
            fontSize: 12,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            opacity: 0.75,
        },
        dot: {
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: theme.palette.text.disabled,
        },
        btnAccordion: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 30,
            padding: theme.spacing(0, 1.5),
            borderRadius: 20,
            border: '1px solid',
            background: 'transparent',
            fontSize: 13.5,
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
        },
        detailsButton: {
            borderColor: alpha(secondary, 0.4),
            background: 'transparent',
            color: secondary,
            transition: 'background-color 0.15s ease, border-color 0.15s ease',
            '&:hover': {
                borderColor: secondary,
                background: alpha(secondary, 0.08),
            },
        },
        extraButton: {
            borderColor: alpha(primary, 0.4),
            background: 'transparent',
            color: primary,
            transition: 'background-color 0.15s ease, border-color 0.15s ease',
            '&:hover': {
                borderColor: primary,
                background: alpha(primary, 0.08),
            },
        },
        historyButton: {
            borderColor: alpha(info, 0.4),
            background: 'transparent',
            color: info,
            transition: 'background-color 0.15s ease, border-color 0.15s ease',
            '&:hover': {
                borderColor: info,
                background: alpha(info, 0.08),
            },
        },
        body: {
            padding: theme.spacing(1.5),
        },

        hourlyRoot: {
            width: '100%',
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
        statValueError: {
            color: `${error} !important`,
        },
        statValueSuccess: {
            color: `${success} !important`,
        },
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
        tableContainer: {
            borderRadius: 10,
            border: `2px solid ${divider}`,
            overflow: 'auto',
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