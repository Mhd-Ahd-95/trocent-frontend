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

        totalsRoot: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
            width: '100%',
        },
        totalsToolbar: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        dateCard: {
            border: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.12) : alpha(secondary, 0.15),
            borderRadius: 14,
            overflow: 'hidden',
            background: theme.palette.background.paper,
        },
        dateHeader: {
            // minWidth: 820,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: theme.spacing(2),
            padding: theme.spacing(1, 2.5),
            background: isDark ? alpha(primary, 0.12) : alpha(primary, 0.06),
            borderBottom: '1px solid ' + alpha(primary, 0.2),
        },
        dateBlock: { display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) },

        dateIconWrap: {
            minWidth: 40,
            fontSize: 18,
            height: 40,
            paddingInline: 2,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: primary,
            fontWeight: '800',
            background: alpha(primary, 0.15),
        },
        dateTitle: { fontSize: 18, fontWeight: 800, lineHeight: 1.2 },
        dateSub: { fontSize: 12.5, color: theme.palette.text.secondary, marginTop: 2 },
        totalPayBlock: { textAlign: 'right' },
        totalPayLabel: {
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
        },
        totals: {
            fontSize: 18,
            fontWeight: 800,
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
        },
        totalsValue: { fontSize: 24, fontWeight: 800, lineHeight: 1.1, color: primary },
        totalPayValue: { fontSize: 22, fontWeight: 800, lineHeight: 1.1, color: success },
        totalsBox: {
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            borderRadius: 10,
            padding: theme.spacing(1, 2),
            border: '1px solid ' + primary,
            background: alpha(primary, 0.05)
        },
        tableScroll: {
            overflowX: 'auto',
            padding: theme.spacing(1, 0),
        },
        tableInner: {
            minWidth: 820,
            display: 'flex',
            flexDirection: 'column',
        },
        tableHead: {
            padding: theme.spacing(1, 1.5),
            borderBottom: '1px solid #ccc',
            fontSize: 12,
            fontWeight: 700,
            color: theme.palette.text.secondary,
        },
        tableRow: {
            padding: theme.spacing(1, 1.5),
            transition: 'background 0.15s ease',
        },
        rowEven: {
            background: theme.palette.grey[100]
        },
        rowOdd: {
            background: '#fff'
        },
        orderNumber: { fontSize: 14, fontWeight: 800 },
        partyCell: { minWidth: 0 },
        routeName: { fontSize: 14, fontWeight: 700 },
        routeAddress: { fontSize: 12.5, color: theme.palette.text.secondary },
        routeArrow: {
            alignSelf: 'flex-end',
            width: 30,
            height: 30,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: primary,
            background: alpha(primary, 0.12),
        },
        arrowCell: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cellCenter: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        },
        numCell: { fontSize: 14, fontWeight: 600 },

        commissionRegisterHeader: {
            cursor: 'pointer',
            transition: 'background 0.15s ease',
        },
        commissionRegisterHeaderExpanded: {
            background: isDark ? alpha(primary, 0.16) : alpha(primary, 0.1),
        },
        commissionMetaLabel: {
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
        },
        commissionMetaValue: {
            fontSize: 14,
            fontWeight: 700,
            color: isDark ? '#fff' : '#0f172a',
            whiteSpace: 'nowrap',
        },
        commissionInvoiceSub: {
            fontSize: 12,
            color: theme.palette.text.secondary,
            marginTop: 2,
        },
        commissionToggleIcon: {
            width: 32,
            height: 32,
            borderRadius: 8,
            background: primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease',
            flexShrink: 0,
            color: '#fff',
        },
        commissionToggleIconOpen: {
            transform: 'rotate(180deg)',
        },
        commissionBody: {
            padding: theme.spacing(1.5, 2.5, 2),
        },
        commissionDateBlock: {
            marginBottom: theme.spacing(2),
            border: '1px solid #ccc',
            borderRadius: 8,
            '&:last-child': { marginBottom: 0, },
        },
        commissionDateBlockHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(1, 1.5),
            background: isDark ? alpha('#fff', 0.03) : theme.palette.grey[200],
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            marginBottom: theme.spacing(1),
        },
        commissionDateLabel: {
            fontSize: 13,
            fontWeight: 800,
        },
        commissionDateTotal: {
            fontSize: 13,
            fontWeight: 800,
            color: success,
        },
        registeredRowMetaLine: {
            display: 'flex',
            gap: 6,
            fontSize: 11.5,
            fontWeight: 700,
            color: theme.palette.text.secondary,
            letterSpacing: '0.02em',
            marginTop: 2,
        },
    };


});