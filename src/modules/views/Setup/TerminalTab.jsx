import React, { useState } from 'react'
import { Box, Typography, TextField, IconButton, InputAdornment, Tooltip, Collapse, CircularProgress, Grid, Container } from '@mui/material'
import { Add, Delete, MenuBook, Check, Close, Terminal } from '@mui/icons-material'
import useStyles from './Setup.styles.jsx'
import { useTerminals, useTerminalsMutation } from '../../hooks/useTerminals.jsx'


function TerminalTab({ enabled }) {

    const { classes } = useStyles()
    const { data: terminals, isLoading } = useTerminals({ enabled })
    const [inputValue, setInputValue] = useState('')
    const [showInput, setShowInput] = useState(false)
    const [deletingTerminal, setDeletingTerminal] = React.useState(null)

    const { create, remove } = useTerminalsMutation()

    const handleAdd = async () => {
        const name = inputValue.trim()
        if (!name) return
        await create.mutateAsync({ terminal: name })
        setInputValue('')
        setShowInput(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
        if (e.key === 'Escape') { setShowInput(false); setInputValue('') }
    }

    const handleDelete = async (terminal) => {
        setDeletingTerminal(terminal)
        await remove.mutateAsync(terminal)
        setDeletingTerminal(null)
    }

    return (
        <Container maxWidth='md'>
            <Box className={classes.drawerBody}>
                <Box className={classes.scrollArea}>
                    {isLoading ? <Grid container component={Box} justifyContent={'center'} py={10}>
                        <CircularProgress />
                    </Grid> :
                        <Box className={classes.listCard}> 
                            <Box className={classes.listHeader}>
                                <Box className={classes.listHeaderLeft}>
                                    <Typography className={classes.listTitle}>Terminals</Typography> 
                                    {terminals.length > 0 && (
                                        <Typography className={classes.listCount}>
                                            {terminals?.length}
                                        </Typography>
                                    )}
                                </Box>
                                <button
                                    type='button'
                                    className={classes.addBtn}
                                    onClick={() => {
                                        setShowInput(true)
                                        setTimeout(() => document.getElementById('terminal-input')?.focus(), 50)
                                    }}
                                >
                                    {create.isPending ? <CircularProgress size={'18px'} /> : <Add style={{ fontSize: 18 }} />}
                                    Add terminals
                                </button>
                            </Box>
                            {terminals.length === 0 && !showInput && (
                                <Box className={classes.emptyState}>
                                    <MenuBook style={{ fontSize: 24, color: '#CBD5E1' }} />
                                    <Typography className={classes.emptyText}>No terminals added yet</Typography>
                                </Box>
                            )}
                            {terminals.sort((a,b) => a.terminal.localeCompare(b.terminal)).map((terminal, index) => (
                                <Box key={terminal.terminal ?? index} className={classes.bookRow}>
                                    <Typography className={classes.bookIndex}>{index + 1}</Typography>
                                    <Typography className={classes.bookName}>{terminal.terminal}</Typography>
                                    <Box className={`${classes.bookActions} bookActions`}>
                                        <Tooltip title='Remove'>
                                            <IconButton
                                                className={`${classes.iconBtn} ${classes.deleteBtn}`}
                                                disabled={remove.isPending}
                                                onClick={() => handleDelete(terminal.terminal)}
                                            >
                                                {remove.isPending && deletingTerminal === terminal.terminal ? <CircularProgress size='18px' /> : <Delete style={{ fontSize: 22 }} color='error' />}
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            ))}
                            <Collapse in={showInput}>
                                <Box className={classes.inputRow}>
                                    <TextField
                                        id='terminal-input'
                                        className={classes.input}
                                        variant='outlined'
                                        size='small'
                                        placeholder='e.g. TERM-MTL, TERM-OTT...'
                                        value={inputValue}
                                        onChange={e => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <Terminal style={{ fontSize: 18, color: '#94A3B8' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Tooltip title='Add (Enter)'>
                                        <IconButton className={classes.confirmBtn} onClick={handleAdd}>
                                            {create.isPending ? <CircularProgress size={'18px'} /> : <Check style={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Cancel (Esc)'>
                                        <IconButton
                                            className={classes.rowCancelBtn}
                                            onClick={() => { setShowInput(false); setInputValue('') }}
                                        >
                                            <Close style={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Collapse>
                        </Box>
                    }
                </Box>
            </Box>
        </Container>
    )
}

export default React.memo(TerminalTab)