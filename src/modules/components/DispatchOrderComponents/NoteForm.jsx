import React, { useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Avatar, Stack, Grid, Divider, } from '@mui/material';
import { NoteAdd, LocalShipping, Inventory2, AccessTime, Person, } from '@mui/icons-material';
import globalVariables from '../../global';
import SubmitButton from '../SubmitButton/SubmitButton';
import StyledButton from '../StyledButton/StyledButton';

const DUMMY_NOTES = [
    {
        id: 1,
        note_type: 'pickup',
        note: 'Driver will arrive between 10am-11am. Customer requested ...',
        created_by: 'Mhd Ahd',
        created_at: '2026-03-10T09:32:00',
    },
    {
        id: 2,
        note_type: 'delivery',
        note: 'Receiver not available until 2pm.',
        created_by: 'IAM',
        created_at: '2026-03-10T11:15:00',
    }
];

const NOTE_TYPES = [
    {
        value: 'pickup',
        label: 'Pickup Note',
        icon: <LocalShipping sx={{ fontSize: 15 }} />,
        color: '#2980b9',
        bg: '#2980b91a',
    },
    {
        value: 'delivery',
        label: 'Delivery Note',
        icon: <Inventory2 sx={{ fontSize: 15 }} />,
        color: '#DD9100',
        bg: '#DD91001a',
    },
];

const getNoteType = (value) => NOTE_TYPES.find((t) => t.value === value);

const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-CA', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const NoteHistoryItem = ({ note }) => {
    const type = getNoteType(note.note_type);
    return (
        <Box
            sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', transition: 'box-shadow 0.15s ease', '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.07)' } }}>
            <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 700, bgcolor: type?.bg, color: type?.color, border: `1.5px solid ${type?.color}30`, flexShrink: 0, }}>
                    {type?.icon}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={0.5}>
                        <Chip
                            label={type?.label}
                            size="small"
                            sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: type?.bg, color: type?.color, border: `1px solid ${type?.color}30`, letterSpacing: '0.3px', }}
                        />
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Person sx={{ fontSize: 12, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                {note.created_by}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">·</Typography>
                            <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.disabled">
                                {formatDate(note.created_at)}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Typography variant="body2" color="text.primary" sx={{ mt: 0.75, lineHeight: 1.6, fontSize: 13 }}>
                        {note.note}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default function OrderNoteForm({ order, onClose }) {

    const authedUser = globalVariables.auth.user
    const [note, setNote] = React.useState({ do_id: order.id, order_id: order.order_id, note_type: '', text_note: '', user_id: authedUser.id })
    const [submitted, setSubmitted] = useState(false);
    const [notes, setNotes] = useState(DUMMY_NOTES);

    const handleSave = () => {
        setSubmitted(true);
        console.log(note);
    };

    return (
        <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }}        >
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <FormControl fullWidth required>
                            <InputLabel sx={{ fontSize: 13 }}>Note Type</InputLabel>
                            <Select
                                value={note.note_type}
                                label="Note Type"
                                // required
                                onChange={(e) => setNote((prev) => ({ ...prev, note_type: e.target.value }))}
                                sx={{ fontSize: 13, borderRadius: 2 }}
                                renderValue={(val) => {
                                    const t = getNoteType(val);
                                    return (
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Box sx={{ color: t?.color, display: 'flex' }}>{t?.icon}</Box>
                                            <Typography fontSize={13} fontWeight={600}>{t?.label}</Typography>
                                        </Stack>
                                    );
                                }}
                            >
                                {NOTE_TYPES.map((t) => (
                                    <MenuItem key={t.value} value={t.value}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color, }}>
                                                {t.icon}
                                            </Box>
                                            <Box>
                                                <Typography fontSize={13} fontWeight={600}>{t.label}</Typography>
                                                <Typography fontSize={11} color="text.secondary">{t.value === 'pickup' ? 'Note for pickup leg' : 'Note for delivery leg'}</Typography>
                                            </Box>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            multiline
                            required
                            minRows={4}
                            maxRows={6}
                            // size="small"
                            label="Note"
                            placeholder="Enter instructions, or any relevant details…"
                            value={note.text_note}
                            onChange={(e) => setNote((prev) => ({ ...prev, text_note: e.target.value }))}
                            helperText={`${note.text_note.length} characters`}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 }, '& .MuiFormHelperText-root': { mx: 0 }, }}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Divider />
                    </Grid>
                    <Grid size={12}>
                        <Box sx={{ maxHeight: 'calc(100vh - 480px)', overflowY: 'auto' }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                                    Notes History
                                </Typography>
                                <Chip
                                    label={`${notes.length} note${notes.length !== 1 ? 's' : ''}`}
                                    size="small"
                                    sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: 'grey.100', color: 'text.secondary' }}
                                />
                            </Stack>

                            {notes.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <NoteAdd sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                    <Typography variant="body2" color="text.disabled">No notes yet</Typography>
                                </Box>
                            ) : (
                                <Stack spacing={1.5}>
                                    {notes.map((note) => (
                                        <NoteHistoryItem key={note.id} note={note} />
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </div>
            <div style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '16px 24px', zIndex: 1 }}            >
                <Grid container spacing={2} justifyContent={'flex-start'}>
                    <Grid size='auto'>
                        <SubmitButton
                            type='submit'
                            variant='outlined'
                            color='secondary'
                            size='small'
                            textTransform='capitalize'
                        // isLoading={loading}
                        >
                            Submit
                        </SubmitButton>
                    </Grid>
                    <Grid size='auto'>
                        <StyledButton
                            variant='outlined'
                            color='error'
                            size='small'
                            // disabled={loading}
                            textTransform='capitalize'
                        // onClick={() => reset()}
                        >
                            Reset
                        </StyledButton>
                    </Grid>
                </Grid>
            </div>
        </form>
    );
}