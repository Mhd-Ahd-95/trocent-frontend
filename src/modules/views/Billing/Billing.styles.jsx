import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export default makeStyles({ name: 'Billing' })((theme) => {

    const isDark = theme.palette.mode === 'dark';
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;
    const shipperColor = theme.palette.success.main;
    const receiverColor = theme.palette.info.main;

    return {
        page: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
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
        orderCard: {
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1.5),
            border: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.1) : alpha(secondary, 0.4),
            background: theme.palette.background.paper,
            padding: theme.spacing(1.75, 2),
            // contentVisibility: 'auto',
            // containIntrinsicSize: 'auto 460px',
            overflow: 'hidden',
            overflowX: 'auto'
        },
        orderNumber: {
            fontSize: 18,
            fontWeight: 800,
            color: primary,
            letterSpacing: '-0.01em',
        },
        orderMetaLine: {
            fontSize: 12,
            color: theme.palette.text.secondary,
            marginTop: 1,
        },
        orderMetaStrong: {
            fontWeight: 700,
            color: isDark ? '#fff' : secondary,
        },
        topRightCol: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 6,
        },
        approveButton: {
            height: 35,
            fontSize: 14,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 7,
            boxShadow: `0 3px 10px ${alpha(primary, 0.35)}`,
        },
        approveChip: {
            height: 26,
            fontSize: 11.5,
            fontWeight: 800,
        },
        payoutInput: {
            width: 140,
            '& .MuiOutlinedInput-root': {
                height: 35,
                fontSize: 12,
                borderRadius: 6,
                fontWeight: 700,
            },
            '& input': {
                padding: '2px 8px',
            },
        },
        infoBox: {
            boxSizing: 'border-box',
            borderRadius: 10,
            border: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.09) : alpha(secondary, 0.11),
            background: isDark ? alpha('#fff', 0.02) : alpha(secondary, 0.02),
            padding: theme.spacing(1.25, 1.5),
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
        },
        infoSubBox: {
            boxSizing: 'border-box',
            borderRadius: 8,
            background: isDark ? alpha('#fff', 0.03) : alpha(secondary, 0.035),
            padding: theme.spacing(1, 1.25),
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
        },
        boxTitle: {
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
            paddingBottom: 6,
            borderBottom: '1px solid',
            borderColor: isDark ? alpha('#fff', 0.08) : alpha(secondary, 0.09),
        },
        boxTitle_shipper: {
            color: shipperColor,
        },
        boxTitle_receiver: {
            color: receiverColor,
        },
        boxTitle_waiting: {
            color: primary,
        },
        boxTitle_neutral: {
            color: secondary,
            opacity: isDark ? 0.9 : 0.85,
        },
        partyName: {
            fontSize: 13,
            fontWeight: 700,
            color: isDark ? '#fff' : secondary,
        },
        addressText: {
            fontSize: 12,
            color: theme.palette.text.secondary,
        },
        specialInstructions: {
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: 12,
            color: theme.palette.text.secondary,
            marginTop: 2,
        },
        timeCol: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 2
        },
        timeLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 700,
            color: theme.palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
        },
        dateValue: {
            fontSize: 13,
            fontWeight: 700,
            color: isDark ? '#fff' : secondary,
            marginTop: 2,
        },
        timeRangeValue: {
            fontSize: 12,
            color: theme.palette.text.secondary,
        },
        kvRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 8,
            textAlign: 'center',
        },
        kvColumn: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'baseline',
            gap: 2,
        },
        kvLabel: {
            fontSize: 12,
            color: theme.palette.text.secondary,
        },
        kvValue: {
            fontSize: 13,
            fontWeight: 700,
            color: isDark ? '#fff' : secondary,
        },
        kvValueEmphasis: {
            fontSize: 13.5,
            fontWeight: 800,
            color: isDark ? '#fff' : secondary,
        },
        kvTotal: {
            fontSize: 20,
            color: theme.palette.text.secondary,
            fontWeight: 700,
        },
        kvTotalValue: {
            fontSize: 21,
            fontWeight: 700,
            color: isDark ? '#fff' : primary,
        },
        freightLineRow: {
            display: 'grid',
            gridTemplateColumns: '22px 48px 1fr auto',
            gap: '0 8px',
            alignItems: 'baseline',
            marginBottom: 3,
        },
        freightPieces: {
            fontSize: 12,
            fontWeight: 800,
            color: primary,
        },
        freightType: {
            fontSize: 12,
            color: isDark ? '#fff' : secondary,
            opacity: 0.85,
        },
        freightDims: {
            fontSize: 12,
            color: theme.palette.text.secondary,
        },
        freightDescription: {
            fontSize: 12,
            fontWeight: 700,
            color: isDark ? '#fff' : secondary,
        },
        chargesTitleRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        editButton: {
            width: 28,
            height: 28,
            borderRadius: 8,
            marginTop: -6,
            background: isDark ? alpha('#fff', 0.08) : alpha(primary, 0.08),
            border: '1px solid',
            borderColor: alpha(primary, 0.3),
            '&:hover': {
                background: alpha(primary, 0.18),
            },
        },
        sectionDivider: {
            borderStyle: 'dashed',
            borderColor: isDark ? alpha('#fff', 0.15) : alpha(secondary, 0.18),
            margin: '2px 0',
        },
        serviceChip: {
            height: 26,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: '0.03em',
            borderRadius: 6,
            alignSelf: 'flex-start',
        },
        serviceChipDirect: {
            background: alpha('#2980b9', 0.14),
            color: '#2980b9',
        },
        serviceChipRush: {
            background: alpha('#e67e22', 0.16),
            color: '#e67e22',
        },
        serviceChipRegular: {
            background: alpha(secondary, 0.1),
            color: secondary,
        },
        notesText: {
            fontSize: 12,
            color: theme.palette.text.secondary,
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
        driverNotes: {
            margin: 0,
            paddingInline: theme.spacing(3)
        }
    };
});