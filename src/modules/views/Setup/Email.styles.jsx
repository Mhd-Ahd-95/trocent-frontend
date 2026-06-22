import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
    root: {
        padding: 24,
        backgroundColor: theme.palette.background.default,
        minHeight: "100%",
    },

    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,

        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            gap: 12,
        },
    },

    pageTitle: {
        fontSize: 20,
        fontWeight: 700,
        color: theme.palette.secondary.main,
        lineHeight: 1.2,
        marginBottom: 4,
    },

    pageSubtitle: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 1.5,
    },

    createBtn: {
        textTransform: "none",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 16,
        minWidth: 130,
        height: 40,
        padding: "0 16px",
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.hover,
        },
    },

    filterRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 22,
    },

    filterBtn: {
        textTransform: "none",
        borderRadius: 16,
        border: "1px solid #D9D9D9",
        backgroundColor: "#fff",
        color: "#4B5563",
        fontSize: 15,
        fontWeight: 600,
        minHeight: 30,
        height: 35,
        padding: "0 14px",

        "&:hover": {
            backgroundColor: "#FAFAFA",
            borderColor: "#CFCFCF",
        },
    },

    filterBtnActive: {
        textTransform: "none",
        borderRadius: 16,
        fontSize: 15,
        fontWeight: 600,
        minHeight: 30,
        height: 35,
        padding: "0 14px",
        backgroundColor: theme.palette.primary.main,
        color: "#fff",

        "&:hover": {
            backgroundColor: theme.palette.primary.hover,
        },
    },

    filterCount: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 16,
        height: 16,
        padding: "0 5px",
        borderRadius: 8,
        fontSize: 10,
        fontWeight: 600,
        marginLeft: 8,
        backgroundColor: "rgba(255,255,255,.25)",
    },

    templateCard: {
        backgroundColor: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 14,
        padding: 15,
        transition: "all .2s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
            borderColor: theme.palette.primary.main,
        },
    },

    templateSubCard: {
        display: "flex",
        flexDirection: "column",
    },

    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 10,
    },

    cardTitle: {
        fontSize: 15,
        fontWeight: 600,
        color: theme.palette.secondary.main,
        // lineHeight: 1.4,
    },

    iconBtn: {
        width: 24,
        height: 24,
        padding: 0,
        color: "#6B7280",

        "&:hover": {
            backgroundColor: "transparent",
            color: theme.palette.primary.main,
        },
    },

    iconBtnDanger: {
        width: 24,
        height: 24,
        padding: 0,
        color: "#EF4444",

        "&:hover": {
            backgroundColor: "transparent",
            color: "#DC2626",
        },
    },

    subjectLine: {
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 13,
        fontWeight: 400,
        color: "#111827",
        marginTop: 6,
        marginBottom: 8,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },

    bodyPreview: {
        marginTop: 8,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#FAFAFA",
        border: "1px solid #ECECEC",
        maxHeight: 200,
        overflowY: "auto",
    },

    placeholdersPanel: {
        backgroundColor: "#FAFAFA",
        border: "1px solid #d8d8d8",
        borderRadius: 12,
        padding: 10,
        height: "100%",
    },

    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#fff",
        border: "1px dashed #D1D5DB",
        borderRadius: 14,
        padding: 48,
    },
}));