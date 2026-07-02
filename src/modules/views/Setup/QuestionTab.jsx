import React, { useState, useCallback, useMemo } from 'react'
import { Box, Typography, TextField, IconButton, Tooltip, Collapse, CircularProgress, Grid, Checkbox, FormControlLabel, Chip, useMediaQuery, useTheme, } from '@mui/material'
import { Add, Delete, Edit, Check, Close, KeyboardArrowUp, KeyboardArrowDown, HelpOutline, PowerSettingsNew, QuestionAnswer, AddCircleOutline, } from '@mui/icons-material'
import { useQuestionMutation, useSectionsWithQuestions } from '../../hooks/useQuestion'
import { useSectionHeaderStyles, useQuestionRowStyles, useAddQuestionRowStyles, useQuestionTabStyles, } from './Question.styles'


function SectionHeader({ section, onEdit, onDelete, isDeleting, isUpdating }) {

    const { classes, cx } = useSectionHeaderStyles()
    const [editing, setEditing] = useState(false)
    const [name, setName] = useState(section.name)

    const handleConfirm = useCallback(async () => {
        if (!name.trim()) return
        await onEdit(section.id, { name: name.trim() })
        setEditing(false)
    }, [name, section.id, onEdit])

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') handleConfirm()
        if (e.key === 'Escape') { setEditing(false); setName(section.name) }
    }, [handleConfirm, section.name])

    return (
        <Box className={cx(classes.root, classes.rootExpanded)}>
            <Box className={classes.accent} />
            {editing ? (
                <>
                    <TextField
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        size='small'
                        className={classes.editInput}
                        onClick={e => e.stopPropagation()}
                    />
                    <Tooltip title='Confirm (Enter)'>
                        <IconButton size='small' className={classes.confirmBtn}
                            onClick={e => { e.stopPropagation(); handleConfirm() }}>
                            {isUpdating ? <CircularProgress size={18} /> : <Check sx={{ fontSize: 25 }} />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Cancel (Esc)'>
                        <IconButton size='small' className={classes.cancelBtn}
                            onClick={e => { e.stopPropagation(); setEditing(false); setName(section.name) }}>
                            <Close sx={{ fontSize: 25 }} />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <>
                    <Box className={classes.titleRow}>
                        <Typography className={classes.title}>{section.name}</Typography>
                        <Chip
                            label={`${section.questions?.length ?? 0} question${section.questions?.length !== 1 ? 's' : ''}`}
                            size='small'
                            className={classes.chip}
                        />
                    </Box>
                    <Box className={classes.actions}>
                        <Tooltip title='Edit section name'>
                            <IconButton size='small' className={classes.editBtn}
                                onClick={e => { e.stopPropagation(); setEditing(true) }}>
                                <Edit className={classes.editIcon} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete section'>
                            <IconButton size='small' className={classes.deleteBtn} color='error'
                                onClick={e => { e.stopPropagation(); onDelete(section.id) }}>
                                {isDeleting ? <CircularProgress size='20px' /> : <Delete className={classes.deleteIcon} />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </>
            )}
        </Box>
    )
}

function QuestionRow({ question, index, total, onDelete, onDeactivate, onReorder, onEdit, isDeleting, isUpdating, isDeactivated }) {

    const { classes, cx } = useQuestionRowStyles()
    const [editing, setEditing] = useState(false)
    const [enVal, setEnVal] = useState(question.question_en)
    const [frVal, setFrVal] = useState(question.question_fr)

    const handleConfirm = useCallback(async () => {
        if (!enVal.trim() || !frVal.trim()) return
        await onEdit(question.id, { question_en: enVal.trim(), question_fr: frVal.trim() })
        setEditing(false)
    }, [enVal, frVal, question.id, onEdit])

    const handleCancelEdit = useCallback(() => {
        setEditing(false)
        setEnVal(question.question_en)
        setFrVal(question.question_fr)
    }, [question.question_en, question.question_fr])

    const handleFrKeyDown = useCallback((e) => {
        if (e.key === 'Enter') handleConfirm()
        if (e.key === 'Escape') handleCancelEdit()
    }, [handleConfirm, handleCancelEdit])

    const handleMoveUp = useCallback(async () => await onReorder(index, index - 1), [question.id, index, onReorder])
    const handleMoveDown = useCallback(async () => await onReorder(index, index + 1), [question.id, index, onReorder])
    const handleDelete = useCallback(async () => await onDelete(question.id), [question.id, onDelete])
    const handleDeactivate = useCallback(async () => await onDeactivate(question.id, question.section_id), [question.id, question.is_activated, onDeactivate])
    const handleStartEdit = useCallback(() => setEditing(true), [])

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Box className={classes.root}>
            <Grid container alignItems='flex-start' spacing={1}>
                <Grid size='auto'>
                    <Box className={classes.indexBadge}>
                        <Typography className={classes.indexText}>{index + 1}</Typography>
                    </Box>
                </Grid>
                <Grid size='grow'>
                    {editing ? (
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 12, sm: 6, md: 5.5 }}>
                                <TextField
                                    fullWidth value={enVal}
                                    onChange={e => setEnVal(e.target.value)}
                                    placeholder='Question in English'
                                    autoFocus label='EN'
                                    className={classes.editTextField}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 5.5 }}>
                                <TextField
                                    fullWidth value={frVal}
                                    onChange={e => setFrVal(e.target.value)}
                                    placeholder='Question en français'
                                    label='FR'
                                    onKeyDown={handleFrKeyDown}
                                    className={classes.editTextField}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 1 }} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Tooltip title='Save (Enter)'>
                                    <IconButton size='small' className={classes.saveBtn} onClick={handleConfirm}>
                                        {isUpdating ? <CircularProgress size={18} /> : <Check sx={{ fontSize: 25 }} />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Cancel (Esc)'>
                                    <IconButton size='small' className={classes.cancelBtn} onClick={handleCancelEdit}>
                                        <Close sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    ) : (
                        <Box>
                            <Box className={classes.enRow}>
                                <Typography component='span' className={classes.labelEN}>EN</Typography>
                                <Typography className={classes.textEN}>{question.question_en}</Typography>
                                {question.gate && <Chip label='Gate' size='medium' className={classes.gateChip} />}
                            </Box>
                            <Box className={cx(classes.enRow, classes.frRow)}>
                                <Typography component='span' className={classes.labelFR}>FR</Typography>
                                <Typography className={classes.textFR}>{question.question_fr}</Typography>
                            </Box>
                        </Box>
                    )}
                </Grid>
                {!editing && (
                    <Grid size={isMobile ? 12 : 'auto'}>
                        <Box className={`${classes.actions} .actions`}>
                            <Tooltip title='Move up'>
                                <span>
                                    <IconButton size='small' disabled={index === 0}
                                        className={classes.actionBtn} onClick={handleMoveUp}>
                                        <KeyboardArrowUp sx={{ fontSize: 30 }} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title='Move down'>
                                <span>
                                    <IconButton size='small' disabled={index === total - 1}
                                        className={classes.actionBtn} onClick={handleMoveDown}>
                                        <KeyboardArrowDown sx={{ fontSize: 30 }} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title='Edit'>
                                <IconButton size='small' className={classes.editBtn} onClick={handleStartEdit}>
                                    <Edit className={classes.editIcon} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={question.is_activated ? 'Deactivate' : 'Activate'}>
                                <IconButton size='small' className={classes.activateBtn} onClick={handleDeactivate}>
                                    {isDeactivated ? <CircularProgress size={18} /> : <PowerSettingsNew sx={{ fontSize: 20, color: question.is_activated ? '#10b956' : '#94A3B8' }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete'>
                                <IconButton size='small' className={classes.deleteBtn} color='error' onClick={handleDelete}>
                                    {isDeleting ? <CircularProgress size={18} /> : <Delete className={classes.actionIcon} />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}

function AddQuestionRow({ sectionId, onAdd, isAdding }) {

    const { classes } = useAddQuestionRowStyles()
    const [show, setShow] = useState(false)
    const [en, setEn] = useState('')
    const [fr, setFr] = useState('')
    const [gate, setGate] = useState(false)

    const handleAdd = useCallback(async () => {
        if (!en.trim() || !fr.trim()) return
        await onAdd({ section_id: sectionId, question_en: en.trim(), question_fr: fr.trim(), gate, is_activated: true })
        setEn(''); setFr(''); setGate(false); setShow(false)
    }, [en, fr, gate, sectionId, onAdd])

    const handleCancel = useCallback(() => {
        setShow(false); setEn(''); setFr(''); setGate(false)
    }, [])

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') handleAdd()
        if (e.key === 'Escape') setShow(false)
    }, [handleAdd])

    return (
        <Box>
            {!show ? (
                <Box className={classes.trigger} onClick={() => setShow(true)}>
                    <AddCircleOutline sx={{ fontSize: 20 }} />
                    <Typography className={classes.triggerLabel}>Add question</Typography>
                </Box>
            ) : (
                <Collapse in={show}>
                    <Box className={classes.form}>
                        <Grid container spacing={1.5} alignItems='center'>
                            <Grid size={{ xs: 12, sm: 5 }}>
                                <TextField
                                    fullWidth label='Question in English' value={en}
                                    onChange={e => setEn(e.target.value)} autoFocus
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 5 }}>
                                <TextField
                                    fullWidth size='small' label='Question en français' value={fr}
                                    onChange={e => setFr(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 'auto' }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={gate} onChange={e => setGate(e.target.checked)}
                                            className={classes.checkbox} />
                                    }
                                    label={<Typography className={classes.gateLabel}>Gate</Typography>}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 'auto' }}>
                                <Box sx={{ display: 'flex', gap: 2.5 }}>
                                    <Tooltip title='Add (Enter)'>
                                        <IconButton onClick={handleAdd} size='small' className={classes.confirmBtn}>
                                            {isAdding ? <CircularProgress size='18px' /> : <Check sx={{ fontSize: 25 }} />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Cancel (Esc)'>
                                        <IconButton onClick={handleCancel} size='small' className={classes.cancelBtn}>
                                            <Close sx={{ fontSize: 25 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Collapse>
            )}
        </Box>
    )
}

const MemoQuestionRow = React.memo(QuestionRow)
const MemoAddQuestionRow = React.memo(AddQuestionRow)
const MemoSectionHeader = React.memo(SectionHeader)

const QuestionTab = ({ enabled }) => {

    const { classes } = useQuestionTabStyles()
    const { data: sections = [], isLoading } = useSectionsWithQuestions({ enabled })

    const { createSection, updateSection, deleteSection, createQuestion, updateQuestion, deleteQuestion, reorderQuestion, deactivateQuestion, } = useQuestionMutation()
    const sectionRef = React.useRef('')
    const [showAddSection, setShowAddSection] = useState(false)
    const [deletingQuestionId, setDeletingQuestionId] = React.useState(null)

    const sortedSections = useMemo(() => [...sections].sort((a, b) => a.order_level - b.order_level), [sections])

    const handleAddSection = useCallback(async () => {
        const value = sectionRef.current?.value
        if (!value.trim()) return
        await createSection.mutateAsync({ name: value.trim() })
        sectionRef.current = ''
        setShowAddSection(false)
    }, [sectionRef, createSection])

    const handleEditSection = useCallback(async (id, data) => await updateSection.mutateAsync({ sid: id, payload: data }), [updateSection])

    const handleDeleteSection = useCallback(async (id) => {
        setDeletingQuestionId(id)
        await deleteSection.mutateAsync({ sid: id })
        setDeletingQuestionId(null)
    }, [deleteSection])

    const handleEditQuestion = useCallback(async (id, data) => await updateQuestion.mutateAsync({ qid: id, payload: data }), [updateQuestion])

    const handleDeleteQuestion = useCallback(async (sectionId, id) => {
        setDeletingQuestionId(id)
        await deleteQuestion.mutateAsync({ sid: sectionId, qid: id })
        setDeletingQuestionId(null)
    }, [deleteQuestion])

    const handleDeactivate = useCallback(async (id, sectionId) => {
        setDeletingQuestionId(id)
        await deactivateQuestion.mutateAsync({ qid: id, sid: sectionId })
        setDeletingQuestionId(null)
    }, [deactivateQuestion])

    const handleAddQuestion = useCallback(async (data) => await createQuestion.mutateAsync(data), [createQuestion])

    const handleReorder = useCallback(async (sectionId, questions, fromIdx, toIdx) => {
        const reordered = [...questions]
        const [moved] = reordered.splice(fromIdx, 1)
        reordered.splice(toIdx, 0, moved)
        const orders = reordered.map((q, i) => ({ id: Number(q.id), order_level: i + 1 }))
        await reorderQuestion.mutateAsync({ section_id: sectionId, orders })
    }, [reorderQuestion])


    if (isLoading) return (
        <Box className={classes.loader}>
            <CircularProgress size={32} />
        </Box>
    )

    return (
        <Box className={classes.container}>
            <Box className={classes.header}>
                <Box className={classes.headerLeft}>
                    <Box className={classes.headerIcon}>
                        <QuestionAnswer sx={{ fontSize: 20 }} color='primary' />
                    </Box>
                    <Box>
                        <Typography className={classes.headerTitle}>Manage Questions</Typography>
                        <Typography className={classes.headerSubtitle}>
                            {sections.length} section{sections.length !== 1 ? 's' : ''} · {sections.reduce((acc, s) => acc + (s.questions?.length ?? 0), 0)} questions
                        </Typography>
                    </Box>
                </Box>
                <button
                    type='button'
                    className={classes.addSectionBtn}
                    onClick={() => {
                        setShowAddSection(true)
                        setTimeout(() => document.getElementById('new-section-input')?.focus(), 50)
                    }}
                >
                    <Add style={{ fontSize: 18 }} />
                    New Section
                </button>
            </Box>
            <Collapse in={showAddSection}>
                <Box className={classes.newSectionForm}>
                    <HelpOutline sx={{ fontSize: 25, flexShrink: 0 }} color='primary' />
                    <TextField
                        inputRef={sectionRef}
                        id='new-section-input'
                        fullWidth
                        placeholder='Section name (e.g. Generic, Hazardous Material...)'
                        className={classes.newSectionInput}
                    />
                    <Tooltip title='Create section (Enter)'>
                        <IconButton onClick={handleAddSection} size='small' className={classes.newSectionConfirm}>
                            {createSection.isPending ? <CircularProgress size='18px' /> : <Check sx={{ fontSize: 25 }} />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Cancel (Esc)'>
                        <IconButton
                            onClick={() => { setShowAddSection(false); }}
                            size='small'
                            className={classes.newSectionCancel}>
                            <Close sx={{ fontSize: 25 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Collapse>
            {sections.length === 0 && !showAddSection && (
                <Box className={classes.emptyState}>
                    <QuestionAnswer className={classes.emptyIcon} />
                    <Typography className={classes.emptyTitle}>No sections yet</Typography>
                    <Typography className={classes.emptySubtitle}>Click "New Section" to get started</Typography>
                </Box>
            )}
            <Grid container spacing={3}>
                {sortedSections.map(section => (
                    <Grid size={12} key={section.id}>
                        <Box className={classes.sectionCard}>
                            <MemoSectionHeader
                                section={section}
                                onEdit={handleEditSection}
                                isUpdating={updateSection.isPending}
                                isDeleting={deletingQuestionId === section.id && deleteSection.isPending}
                                onDelete={handleDeleteSection}
                            />
                            {section.questions?.length === 0 && (
                                <Box className={classes.emptySection}>
                                    <Typography className={classes.emptySectionText}>
                                        No questions in this section yet.
                                    </Typography>
                                </Box>
                            )}
                            {section.questions?.sort((a, b) => a.order_level - b.order_level).map((question, index) => (
                                <MemoQuestionRow
                                    key={question.id}
                                    section={section}
                                    question={question}
                                    index={index}
                                    total={section.questions.length}
                                    isDeleting={deletingQuestionId === question.id && deleteQuestion.isPending}
                                    isDeactivated={deletingQuestionId === question.id && deactivateQuestion.isPending}
                                    isUpdating={updateQuestion.isPending}
                                    onEdit={handleEditQuestion}
                                    onDelete={(id) => handleDeleteQuestion(section.id, id)}
                                    onDeactivate={handleDeactivate}
                                    onReorder={(fromIdx, toIdx) => handleReorder(section.id, section.questions, fromIdx, toIdx)}
                                />
                            ))}
                            <MemoAddQuestionRow
                                sectionId={section.id}
                                isAdding={createQuestion.isPending}
                                onAdd={handleAddQuestion}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default React.memo(QuestionTab)