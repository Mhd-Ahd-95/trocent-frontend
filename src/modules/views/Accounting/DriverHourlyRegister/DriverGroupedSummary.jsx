import React, { useState, useCallback } from 'react'
import { Box, Typography, TextField, Button, Grid, Collapse, InputAdornment } from '@mui/material'
import { TuneRounded, PictureAsPdfRounded } from '@mui/icons-material'
import moment from 'moment'
import useStyles from './Driver.styles'

const money = (value) => `$${Number(value || 0).toFixed(2)}`

const durationToSeconds = (value) => {
    if (!value) return 0
    if (typeof value === 'number') return value
    const parts = String(value).split(':').map(Number)
    if (parts.length !== 3 || parts.some(Number.isNaN)) return 0
    const [h, m, s] = parts
    return h * 3600 + m * 60 + s
}

const formatSeconds = (totalSeconds) => {
    const sign = totalSeconds < 0 ? '-' : ''
    const abs = Math.abs(Math.round(totalSeconds))
    const h = String(Math.floor(abs / 3600)).padStart(2, '0')
    const m = String(Math.floor((abs % 3600) / 60)).padStart(2, '0')
    const s = String(abs % 60).padStart(2, '0')
    return `${sign}${h}:${m}:${s}`
}

const StatTile = ({ classes, cx, label, value, highlight }) => (
    <Box className={cx(classes.statTile, highlight && classes.statTileHighlight)}>
        <Typography className={cx(classes.statLabel, highlight && classes.statLabelHighlight)}>
            {label}
        </Typography>
        <Typography className={cx(classes.statValue, highlight && classes.statValueHighlight)}>
            {value}
        </Typography>
    </Box>
)

const DriverGroupedSummary = React.memo(({ driver, days = [] }) => {

    const { classes, cx } = useStyles()
    const [expanded, setExpanded] = useState(false)
    const [totalPay, setTotalPay] = useState(driver?.total_pay ?? 0)

    const handleToggle = useCallback(() => {
        setExpanded((prev) => !prev)
    }, [])

    const handleTotalPayChange = useCallback((e) => {
        setTotalPay(e.target.value)
    }, [])

    const handleGeneratePdf = useCallback((e) => {
        e.stopPropagation()
    }, [])

    return (
        <Box className={classes.dateGroupRoot}>
            <Box onClick={handleToggle} className={cx(classes.summaryHeader, expanded && classes.summaryHeaderExpanded)}>
                <Box>
                    <Typography className={classes.dateHeading}>
                        {driver?.driver_name}
                    </Typography>
                    <Typography className={classes.orderCountText}>
                        {driver?.driver_number} · {days.length} Day{days.length !== 1 ? 's' : ''}
                    </Typography>
                </Box>
                <Box className={cx(classes.toggleIcon, expanded && classes.toggleIconOpen)}>
                    <TuneRounded sx={{ fontSize: 18, color: 'primary.contrastText' }} />
                </Box>
            </Box>

            <Box className={classes.summaryBody}>
                <Grid container className={classes.summaryRow} wrap="nowrap" alignItems="stretch">
                    <StatTile classes={classes} cx={cx} label="Approved At" value={driver?.approved_at ? moment(driver.approved_at).format('MMM D, YYYY') : '—'} />
                    <StatTile classes={classes} cx={cx} label="Adjusted Clocked" value={formatSeconds(durationToSeconds(driver?.adjusted_clocked_total))} />
                    <StatTile classes={classes} cx={cx} label="Adjusted Distance" value={`${Number(driver?.adjusted_distance_total || 0).toFixed(2)} km`} />
                    <StatTile classes={classes} cx={cx} label="Hourly Pay" value={money(driver?.total_hourly_pay)} />
                    <StatTile classes={classes} cx={cx} label="KM Pay" value={money(driver?.total_km_pay)} />
                    <StatTile classes={classes} cx={cx} label="TOTAL PAY" value={money(driver?.total_pay)} highlight />

                    <Box className={classes.divider} />

                    <Box className={classes.runningTotalGroup} onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="contained"
                            className={classes.generatePdfButton}
                            startIcon={<PictureAsPdfRounded sx={{ fontSize: 18 }} />}
                            onClick={handleGeneratePdf}
                        >
                            Generate PDF
                        </Button>
                    </Box>
                </Grid>
            </Box>

            <Collapse in={expanded} timeout="auto">
                <Box sx={{ p: 2, pt: 0 }}>
                    <Box className={classes.daysTableWrap}>
                        <Box className={classes.daysTableHeaderRow}>
                            <Grid container sx={{ width: '100%' }} alignItems="center">
                                <Grid size={2}><Typography className={classes.daysTableHeaderCell}>Date</Typography></Grid>
                                <Grid size={2.5}><Typography className={classes.daysTableHeaderCell}>Note</Typography></Grid>
                                <Grid size={1.5}><Typography className={classes.daysTableHeaderCell}>Adjusted Hours</Typography></Grid>
                                <Grid size={1.5}><Typography className={classes.daysTableHeaderCell}>Adjusted KM</Typography></Grid>
                                <Grid size={1.5}><Typography className={classes.daysTableHeaderCell}>Hourly Pay</Typography></Grid>
                                <Grid size={1.5}><Typography className={classes.daysTableHeaderCell}>KM Pay</Typography></Grid>
                                <Grid size={1.5}><Typography className={classes.daysTableHeaderCell}>Total</Typography></Grid>
                            </Grid>
                        </Box>

                        {days.map((day, idx) => (
                            <Box key={`${day.date}-${idx}`} className={classes.dayRow}>
                                <Grid container sx={{ width: '100%' }} alignItems="center">
                                    <Grid size={2}>
                                        <Typography className={classes.dayCellPrimary}>
                                            {moment(day.date).format('ddd, MMM D, YYYY')}
                                        </Typography>
                                        {day.note && (
                                            <Typography className={classes.dayNoteText}>{day.note}</Typography>
                                        )}
                                    </Grid>
                                    <Grid size={2.5}>
                                        <Typography className={classes.dayCellValue}>
                                            {day.note || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid size={1.5}>
                                        <Typography className={classes.dayCellValue}>
                                            {formatSeconds(durationToSeconds(day.adjustment_hours))}
                                        </Typography>
                                    </Grid>
                                    <Grid size={1.5}>
                                        <Typography className={classes.dayCellValue}>
                                            {Number(day.adjustment_km || 0).toFixed(2)} km
                                        </Typography>
                                    </Grid>
                                    <Grid size={1.5}>
                                        <Typography className={classes.dayCellValue}>{money(day.day_hourly_pay)}</Typography>
                                    </Grid>
                                    <Grid size={1.5}>
                                        <Typography className={classes.dayCellValue}>{money(day.day_km_pay)}</Typography>
                                    </Grid>
                                    <Grid size={1.5}>
                                        <Typography className={cx(classes.dayCellValue, classes.statValueHighlight)}>
                                            {money(day.day_total_pay)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Collapse>
        </Box>
    )
})

DriverGroupedSummary.displayName = 'DriverGroupedSummary'
export default DriverGroupedSummary