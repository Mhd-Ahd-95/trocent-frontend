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
        card: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(2),
            padding: theme.spacing(1.5, 2.5),
            borderRadius: 16,
            border: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.1) : alpha(secondary, 0.15),
            backgroundColor: theme.palette.background.paper,
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
                borderColor: alpha(primary, 0.5),
                boxShadow: `0 6px 20px ${alpha(primary, isDark ? 0.25 : 0.12)}`,
            },
            [theme.breakpoints.down('md')]: {
                flexWrap: 'wrap',
            },
        },
        cardSelected: {
            borderColor: primary,
            backgroundColor: alpha(primary, isDark ? 0.12 : 0.04),
            boxShadow: `0 0 0 1px ${primary}`,
        },
        cardIcon: {
            width: 44,
            height: 44,
            borderRadius: 12,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(primary, 0.12),
            color: primary,
        },
        cardIconSummary: {
            backgroundColor: alpha(secondary, 0.14),
            color: secondary,
        },
        cardMain: {
            minWidth: 0,
            flex: '0 1 260px',
        },
        cardTitleRow: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),
            flexWrap: 'wrap',
        },
        cardTitle: {
            fontWeight: 700,
            fontSize: 15,
        },
        cardSub: {
            color: theme.palette.text.secondary,
            fontSize: 13,
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        cardAmounts: {
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(90px, 1fr))',
            columnGap: theme.spacing(10),
            flex: '1 1 auto',
            [theme.breakpoints.down('1340')]: {
                columnGap: theme.spacing(2),
                rowGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
            },
        },
        cardAmountsAudit: {
            gridTemplateColumns: 'repeat(6, minmax(90px, 1fr))',
            columnGap: theme.spacing(6),
            [theme.breakpoints.down('1340')]: {
                columnGap: theme.spacing(2),
                rowGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
            },
        },
        amountLabel: {
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            color: theme.palette.text.secondary,
        },
        amountValue: {
            fontSize: 14,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
        },
        cardTotal: {
            textAlign: 'right',
            minWidth: 120,
            paddingLeft: theme.spacing(2),
            borderLeft: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.1) : alpha(secondary, 0.15),
            [theme.breakpoints.down('sm')]: {
                textAlign: 'left',
                borderLeft: 'none',
                paddingLeft: theme.spacing(0),
            }
        },
        cardTotalValue: {
            fontSize: 18,
            fontWeight: 800,
            color: success,
            fontVariantNumeric: 'tabular-nums',
        },
        selectionBar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(1.5, 2),
            borderRadius: 12,
            background: isDark ? alpha('#fff', 0.03) : theme.palette.grey[100],
            border: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.1),
        },
        selectionBarLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(0.5),
        },
        selectionBarText: {
            fontSize: 13,
            fontWeight: 700,
            color: theme.palette.text.secondary,
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
        group: {
            display: 'flex',
            border: '1px solid #ccc',
            borderRadius: 10,
            flexDirection: 'column',
            gap: theme.spacing(1.5),
        },
        groupHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1.5),
            borderBottom: '1px solid #ccc',
            padding: theme.spacing(1, 2),
            flexWrap: 'wrap',
            position: 'relative',
            '&:before': {
                content: '""',
                borderTopLeftRadius: 10,
                position: 'absolute',
                top: 0,
                left: -0.5,
                height: '100%',
                width: '4px',
                background: primary
            }
        },
        groupName: {
            fontSize: 16,
            fontWeight: 800,
        },
        groupMeta: {
            fontSize: 13,
            color: theme.palette.text.secondary,
        },
        groupActions: {
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),
            flexWrap: 'wrap',
        },
        groupTotal: {
            fontSize: 14,
            fontWeight: 700,
            color: success,
            fontVariantNumeric: 'tabular-nums',
            paddingLeft: theme.spacing(1),
        },
        groupRows: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1.5),
            padding: theme.spacing(1.5, 2)
        },
        cardAction: {
            flexShrink: 0,
        },
    };

});