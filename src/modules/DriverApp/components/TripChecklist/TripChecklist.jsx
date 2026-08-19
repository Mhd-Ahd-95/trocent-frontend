import React from "react";
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, Paper, TextField, Typography, } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import QuestionApi from "../../../apis/Questions.api";
import { useStyles } from "./TripChecklist.styles";
import { useTranslation } from 'react-i18next';
import { useDriverKm, useDriverMutation } from "../../../hooks/useDrivers";

function buildQueue(sections) {
    return sections
        .slice()
        .sort((a, b) => a.order_level - b.order_level)
        .flatMap((section) => section.questions.slice().sort((a, b) => a.order_level - b.order_level).map((q) => ({ question: q, section })));
}

function nextIndex(queue, currentIndex, answeredFalseOnGate) {
    if (!answeredFalseOnGate) return currentIndex + 1;
    const currentSectionId = queue[currentIndex].section.id;
    let i = currentIndex + 1;
    while (i < queue.length && queue[i].section.id === currentSectionId) i++;
    return i;
}

function SectionPill({ name }) {
    const { classes } = useStyles();
    return (
        <Box className={classes.sectionPill}>
            <span className={classes.sectionDot} />
            {name}
        </Box>
    );
}

function CompletionScreen({ onConfirm, loading }) {
    const { classes } = useStyles();
    const { t } = useTranslation();
    return (
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={2.5} py={2}>
            <Box className={classes.completionIcon}>
                <CheckCircleIcon sx={{ fontSize: 36, color: "success.main" }} />
            </Box>
            <Box>
                <Typography variant="h6" fontWeight={800} gutterBottom>
                    {t('checklist.allCompleted')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('checklist.completedDesc')}
                </Typography>
            </Box>
            <Button
                fullWidth
                variant="outlined"
                color="success"
                size="large"
                disabled={loading}
                onClick={onConfirm}
                startIcon={loading ? <CircularProgress size={18} color="success" /> : <CheckCircleIcon />}
                sx={{ borderRadius: 3, fontWeight: 800, py: 1.5, textTransform: "uppercase", letterSpacing: "0.06em" }}
            >
                {t('checklist.confirmStartTrip')}
            </Button>
        </Box>
    );
}

function KmInScreen({ value, onChange, onSubmit, loading }) {
    const { classes } = useStyles();
    const { t } = useTranslation();
    return (
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={2.5} py={2}>
            <Box className={classes.completionIcon}>
                <DirectionsCarIcon sx={{ fontSize: 36, color: "warning.main" }} />
            </Box>
            <Box>
                <Typography variant="h6" fontWeight={800} gutterBottom>
                    {t('checklist.kmInTitle', 'Enter starting odometer')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('checklist.kmInDesc', 'We need your km-in reading before this trip can start.')}
                </Typography>
            </Box>
            <TextField
                fullWidth
                type="number"
                autoFocus
                label={t('checklist.kmIn', 'Km In')}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={loading}
                inputProps={{ min: 0, inputMode: 'decimal' }}
            />
            <Button
                fullWidth
                variant="contained"
                color="warning"
                size="large"
                disabled={loading || value === '' || Number(value) < 0}
                onClick={onSubmit}
                startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <DirectionsCarIcon />}
                sx={{ borderRadius: 3, fontWeight: 800, py: 1.5, textTransform: "uppercase", letterSpacing: "0.06em" }}
            >
                {t('checklist.saveKmIn', 'Save & Continue')}
            </Button>
        </Box>
    );
}

export default function TripChecklist({ sections, tripId, checklistId, onComplete, driverId, language = 'en' }) {

    const { classes } = useStyles();
    const { t } = useTranslation();
    const queue = React.useMemo(() => buildQueue(sections), [sections]);
    const [idx, setIdx] = React.useState(0);
    const [answering, setAnswering] = React.useState(false);
    const [completing, setCompleting] = React.useState(false);
    const [done, setDone] = React.useState(false);
    const [animKey, setAnimKey] = React.useState(0);
    const [kmInValue, setKmInValue] = React.useState('');

    const { data: kmData, isLoading: kmLoading } = useDriverKm(driverId);
    const { driverKmInOut } = useDriverMutation();

    const hasActiveKm = Boolean(kmData?.active_km_id);

    const current = queue[idx] ?? null;

    const handleAnswer = async (answer, act) => {
        if (answering || !current) return;
        setAnswering(act);
        try {
            await QuestionApi.answerQuestion(checklistId, current.question.id, answer);
            const skipSection = current.question.gate && answer === false;
            const next = nextIndex(queue, idx, skipSection);
            if (next >= queue.length) {
                setDone(true);
            } else {
                setIdx(next);
                setAnimKey((k) => k + 1);
            }
        } catch (err) {
            console.error("Answer error:", err);
        } finally {
            setAnswering(false);
        }
    };

    const handleKmInSubmit = async () => {
        if (kmInValue === '' || Number(kmInValue) < 0) return;
        try {
            await driverKmInOut.mutateAsync({ did: driverId, kid: null, km_in: kmInValue });
            setKmInValue('');
        } catch (err) {
            console.error("Km in error:", err);
        }
    };

    const handleComplete = async () => {
        setCompleting(true);
        try {
            await QuestionApi.completeQuestionTrip(tripId, driverId);
            onComplete?.();
        } catch (err) {
            console.error("Complete error:", err);
        } finally {
            setCompleting(false);
        }
    };

    return (
        <Box className={classes.overlay}>
            <Card className={classes.card} elevation={10}>
                <CardHeader
                    className={classes.cardHeader}
                    avatar={
                        <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: "warning.soft", border: "3px solid", borderColor: "warning.light", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <WarningAmberIcon sx={{ fontSize: 27, color: "warning.main" }} />
                        </Box>
                    }
                    title={
                        <Typography variant="h6" fontWeight={800}>
                            {t('checklist.preTripChecklist')}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="caption" fontSize={'14px'} color="text.secondary">
                            {t('checklist.completeBeforeStart')}
                        </Typography>
                    }
                    action={
                        !done && (
                            <Typography className={classes.badge}>
                                {idx}/{queue.length}
                            </Typography>
                        )
                    }
                />
                <CardContent className={classes.cardBody}>
                    {done ? (
                        kmLoading ? (
                            <Box display="flex" alignItems="center" justifyContent="center" py={4}>
                                <CircularProgress size={26} />
                            </Box>
                        ) : !hasActiveKm ? (
                            <KmInScreen
                                value={kmInValue}
                                onChange={setKmInValue}
                                onSubmit={handleKmInSubmit}
                                loading={driverKmInOut.isPending}
                            />
                        ) : (
                            <CompletionScreen onConfirm={handleComplete} loading={completing} />
                        )
                    ) : current ? (
                        <Box key={animKey}>
                            <SectionPill name={current.section.name} />
                            <Typography className={classes.questionText} color="text.primary">
                                {current.question[`question_${language}`]}
                            </Typography>
                            {current.question.gate && (
                                <Paper className={classes.gateWarning} elevation={0}>
                                    <WarningAmberIcon sx={{ fontSize: 20, color: "warning.main" }} />
                                    {t('checklist.gateWarning')}
                                </Paper>
                            )}
                            <Grid container spacing={2} justifyContent={'center'} mt={5}>
                                <Grid item xs={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        disabled={answering === 'y' || answering === 'n'}
                                        onClick={() => handleAnswer(true, 'y')}
                                        startIcon={answering === 'y' ? <CircularProgress size={16} color="success" /> : <CheckIcon />}
                                        sx={{ borderRadius: 3, fontWeight: 800, py: 1.5, textTransform: "uppercase" }}
                                    >
                                        {t('checklist.yes')}
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="error"
                                        size="large"
                                        disabled={answering === 'y' || answering === 'n'}
                                        onClick={() => handleAnswer(false, 'n')}
                                        startIcon={answering === 'n' ? <CircularProgress size={16} color="error" /> : <CloseIcon />}
                                        sx={{ borderRadius: 3, fontWeight: 800, py: 1.5, textTransform: "uppercase" }}
                                    >
                                        {t('checklist.no')}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : null}
                </CardContent>
            </Card>
        </Box>
    );
}