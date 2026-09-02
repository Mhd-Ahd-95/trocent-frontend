import React, { useState, useCallback } from 'react'
import { Box, Typography, IconButton, TextField, InputAdornment } from '@mui/material'
import { EditRounded, DeleteOutlineRounded, ReceiptLongRounded, CheckRounded, CloseRounded } from '@mui/icons-material'
import useStyles from './Driver.styles'
import { useBillingMutation } from '../../../hooks/useBillings'

function ExtraChargeRow({ item, index, companyId, classes, cx, onClose }) {

    const { updateExtraCharge, deleteExtraCharge } = useBillingMutation()

    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState({ note: item.note, price: String(item.price) })

    const isDraftValid = draft.note.trim().length > 0 && draft.price !== '' && !Number.isNaN(Number(draft.price))

    const handleStartEdit = useCallback(() => {
        setDraft({ note: item.note, price: String(item.price) })
        setIsEditing(true)
    }, [item])

    const handleCancelEdit = useCallback(() => {
        setDraft({ note: item.note, price: String(item.price) })
        setIsEditing(false)
    }, [item])

    const handleSaveEdit = useCallback(async () => {
        if (!isDraftValid) return
        await updateExtraCharge.mutateAsync({ id: item.id, payload: { note: draft.note.trim(), price: Number(draft.price), company_id: companyId }, })
        setIsEditing(false)
        onClose?.()
    }, [isDraftValid, draft, item.id, updateExtraCharge])

    const handleRemove = useCallback(async () => {
        await deleteExtraCharge.mutateAsync({ id: item.id, cid: companyId })
        onClose?.()
    }, [item.id, companyId, deleteExtraCharge])

    const isBusy = updateExtraCharge.isPending || deleteExtraCharge.isPending

    if (isEditing) {
        return (
            <Box className={cx(classes.extraChargeCard, classes.extraChargeCardEditing)}>
                <Box className={classes.extraChargeIndex}>{String(index + 1).padStart(2, '0')}</Box>
                <TextField
                    size="small"
                    autoFocus
                    fullWidth
                    value={draft.note}
                    onChange={(e) => setDraft((prev) => ({ ...prev, note: e.target.value }))}
                    className={classes.extraChargeEditField}
                    placeholder="Note"
                />
                <TextField
                    size="small"
                    type="number"
                    value={draft.price}
                    onChange={(e) => setDraft((prev) => ({ ...prev, price: e.target.value }))}
                    className={cx(classes.extraChargeEditField, classes.extraChargeEditPriceField)}
                    placeholder="0.00"
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                />
                <Box className={classes.extraChargeActions}>
                    <IconButton
                        size="small"
                        className={classes.extraChargeSaveBtn}
                        disabled={!isDraftValid || isBusy}
                        onClick={handleSaveEdit}
                    >
                        <CheckRounded sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" className={classes.extraChargeActionBtn} disabled={isBusy} onClick={handleCancelEdit}>
                        <CloseRounded sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            </Box>
        )
    }

    return (
        <Box className={classes.extraChargeCard}>
            <Box className={classes.extraChargeIndex}>{String(index + 1).padStart(2, '0')}</Box>
            <Box className={classes.extraChargeContent}>
                <Typography className={classes.extraChargeNote}>{item.note}</Typography>
            </Box>
            <Typography className={classes.extraChargePrice}>
                ${Number(item.price).toFixed(2)}
            </Typography>
            <Box className={classes.extraChargeActions}>
                <IconButton size="small" className={classes.extraChargeActionBtn} disabled={isBusy} onClick={handleStartEdit}>
                    <EditRounded sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton
                    size="small"
                    className={cx(classes.extraChargeActionBtn, classes.extraChargeDeleteBtn)}
                    disabled={isBusy}
                    onClick={handleRemove}
                >
                    <DeleteOutlineRounded sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>
        </Box>
    )
}

export default function ExtraChargesDisplay({ companyId, extraCharges = [], onClose }) {

    const { classes, cx } = useStyles()

    if (extraCharges.length === 0) {
        return (
            <Box className={classes.emptyState}>
                <ReceiptLongRounded sx={{ fontSize: 40, opacity: 0.35, mb: 1 }} />
                <Box sx={{ fontWeight: 700 }}>No Extra Charges</Box>
                <Box sx={{ fontSize: 13, mt: 0.5 }}>This company has no extra charges added yet.</Box>
            </Box>
        )
    }

    return (
        <Box className={classes.extraChargesWrap}>
            <Box className={classes.extraChargesList}>
                {extraCharges.map((item, idx) => (
                    <ExtraChargeRow
                        key={item.id}
                        item={item}
                        index={idx}
                        companyId={companyId}
                        classes={classes}
                        cx={cx}
                        onClose={onClose}
                    />
                ))}
            </Box>
        </Box>
    )
}