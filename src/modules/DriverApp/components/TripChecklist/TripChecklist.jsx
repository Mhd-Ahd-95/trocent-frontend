import React from "react";
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, Paper, Typography, } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import QuestionApi from "../../../apis/Questions.api";
import { useStyles } from "./TripChecklist.styles";

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
    return (
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={2.5} py={2}>
            <Box className={classes.completionIcon}>
                <CheckCircleIcon sx={{ fontSize: 36, color: "success.main" }} />
            </Box>
            <Box>
                <Typography variant="h6" fontWeight={800} gutterBottom>
                    All Questions Completed
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    You've answered all required checklist questions.
                    <br />
                    Confirm below to start your trip.
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
                Confirm &amp; Start Trip
            </Button>
        </Box>
    );
}

export default function TripChecklist({ sections, tripId, checklistId, onComplete, driverId }) {
    const { classes } = useStyles();
    const queue = React.useMemo(() => buildQueue(sections), [sections]);
    const [idx, setIdx] = React.useState(0);
    const [answering, setAnswering] = React.useState(false);
    const [completing, setCompleting] = React.useState(false);
    const [done, setDone] = React.useState(false);
    const [animKey, setAnimKey] = React.useState(0);

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
                            Pre-Trip Checklist
                        </Typography>
                    }
                    subheader={
                        <Typography variant="caption" fontSize={'14px'} color="text.secondary">
                            Complete before starting your trip
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
                        <CompletionScreen onConfirm={handleComplete} loading={completing} />
                    ) : current ? (
                        <Box key={animKey}>
                            <SectionPill name={current.section.name} />
                            <Typography className={classes.questionText} color="text.primary">
                                {current.question.question_en}
                            </Typography>
                            {current.question.gate && (
                                <Paper className={classes.gateWarning} elevation={0}>
                                    <WarningAmberIcon sx={{ fontSize: 20, color: "warning.main" }} />
                                    Answering No will skip to the next section
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
                                        Yes
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
                                        No
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