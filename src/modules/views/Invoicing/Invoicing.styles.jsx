import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

const COLUMN_WIDTHS = {
    checkbox: 48,
    orderNumber: 110,
    references: 260,
    deliveryDate: 130,
    fromCity: 120,
    toCity: 120,
    freightCharge: 120,
    fuelSurcharge: 120,
    accessorial: 110,
    subTotal: 110,
    total: 130,
};

const TABLE_MIN_WIDTH = Object.values(COLUMN_WIDTHS).reduce((a, b) => a + b, 0);

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

        orderTableWrap: {
            borderRadius: 12,
            border: `1px solid ${isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.12)}`,
            overflow: 'hidden',
            background: theme.palette.background.paper,
        },

        tableScroll: {
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
                height: 8,
            },
            '&::-webkit-scrollbar-thumb': {
                background: isDark ? alpha('#fff', 0.15) : alpha(secondary, 0.25),
                borderRadius: 8,
            },
        },

        table: {
            tableLayout: 'fixed',
            minWidth: TABLE_MIN_WIDTH,
            borderCollapse: 'collapse',
        },

        headerRow: {
            background: isDark ? alpha('#fff', 0.04) : alpha(secondary, 0.045),
        },
        headerCell: {
            fontSize: 13,
            fontWeight: 700,
            color: isDark ? '#fff' : '#000',
            whiteSpace: 'nowrap',
            borderBottom: `1px solid ${isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.12)}`,
            padding: theme.spacing(1.15, 1.25),
        },
        headerMoney: {
            textAlign: 'right',
        },

        rowColor: {
            backgroundColor: theme.palette.grey[100],
        },

        bodyRow: {
            transition: 'background-color 0.15s ease',
            '&:last-of-type td': {
                borderBottom: 'none',
            },
            '&:hover': {
                backgroundColor: isDark ? alpha('#fff', 0.03) : alpha(primary, 0.05),
            },
        },
        bodyTotalRow: {
            transition: 'background-color 0.15s ease',
            '&:last-of-type td': {
                borderBottom: 'none',
            },
            backgroundColor: isDark ? alpha('#fff', 0.03) : alpha(primary, 0.2),
        },
        bodyRowSelected: {
            backgroundColor: `${isDark ? alpha(primary, 0.12) : alpha(primary, 0.07)} !important`,
        },
        bodyCell: {
            borderBottom: `1px solid ${isDark ? alpha('#fff', 0.06) : alpha(secondary, 0.08)}`,
            padding: theme.spacing(1.15, 1.25),
            verticalAlign: 'top',
        },

        colCheckbox: { width: COLUMN_WIDTHS.checkbox },
        colOrderNumber: { width: COLUMN_WIDTHS.orderNumber },
        colReferences: { width: COLUMN_WIDTHS.references },
        colDeliveryDate: { width: COLUMN_WIDTHS.deliveryDate },
        colFromCity: { width: COLUMN_WIDTHS.fromCity },
        colToCity: { width: COLUMN_WIDTHS.toCity },
        colFreightCharge: { width: COLUMN_WIDTHS.freightCharge },
        colFuelSurcharge: { width: COLUMN_WIDTHS.fuelSurcharge },
        colAccessorial: { width: COLUMN_WIDTHS.accessorial },
        colSubTotal: { width: COLUMN_WIDTHS.subTotal },
        colTotal: { width: COLUMN_WIDTHS.total },

        rowCheckbox: {
            padding: 4,
            color: alpha(secondary, 0.4),
            '&.Mui-checked': {
                color: primary,
            },
        },

        cellValue: {
            fontSize: 13,
            fontWeight: 600,
            color: theme.palette.text.primary,
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        cellTotalValue: {
            fontSize: 14,
            fontWeight: 700,
            color: theme.palette.text.primary,
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        cellValueWrap: {
            fontSize: 13,
            fontWeight: 600,
            color: theme.palette.text.primary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
        },
        cellValueStrong: {
            fontSize: 13,
            fontWeight: 700,
            color: theme.palette.text.primary,
        },
        cityValue: {
            fontSize: 13,
            fontWeight: 600,
            color: theme.palette.info.main,
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
        },
        orderNumberLink: {
            fontSize: 13.5,
            fontWeight: 700,
            color: primary,
            textDecoration: 'none',
            width: 'fit-content',
            whiteSpace: 'nowrap',
            '&:hover': {
                textDecoration: 'underline',
                color: theme.palette.primary.hover || primary,
            },
        },

        cellMoney: {
            textAlign: 'right',
        },
        totalValue: {
            fontSize: 14,
            fontWeight: 800,
            color: secondary,
            whiteSpace: 'nowrap',
        },

        celltotalValue: {
            fontSize: 16,
            fontWeight: 800,
            color: primary,
            whiteSpace: 'nowrap',
        },

        submitBar: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: theme.spacing(1.5),
            padding: theme.spacing(1.5, 1.75),
            borderTop: `1px solid ${isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.12)}`,
        },
        selectionHint: {
            fontSize: 12,
            fontWeight: 600,
            color: theme.palette.text.secondary,
        },
        submitButton: {
            height: 38,
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 9,
            paddingInline: theme.spacing(2.5),
            boxShadow: `0 4px 12px ${alpha(primary, 0.35)}`,
        },
        total: {
            fontSize: 16,
            fontWeight: 700
        },


        statusDot: {
            position: 'relative',
            width: 8,
            height: 8,
            borderRadius: '50%',
            flexShrink: 0,
        },
        statusDotPulsing: {
            '&::before': {
                content: '""',
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                backgroundColor: 'inherit',
                animation: 'pulseRing 1.6s ease-in-out infinite',
                '@keyframes pulseRing': {
                    '0%': { transform: 'scale(1)', opacity: 0.6 },
                    '70%': { transform: 'scale(2)', opacity: 0 },
                    '100%': { transform: 'scale(2)', opacity: 0 },
                },
            },
        },
        statusDotGreen: {
            backgroundColor: theme.palette.success.main,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.success.main, 0.18)}`,
        },
        statusDotOrange: {
            backgroundColor: theme.palette.info.main,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.info.main, 0.18)}`,
        },
        statusDotRed: {
            backgroundColor: theme.palette.error.main,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.error.main, 0.18)}`,
        },
        orderNumberRow: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
        },
    };
});