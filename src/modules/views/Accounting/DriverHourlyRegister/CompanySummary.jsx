import React, { useCallback } from 'react'
import { Box, Typography, Button, Grid } from '@mui/material'
import { PictureAsPdfRounded } from '@mui/icons-material'
import useStyles from './Driver.styles'
import DriverGroupedSummary from './DriverGroupedSummary'

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

const CompanyStatTile = ({ classes, cx, label, value, highlight }) => (
    <Box className={cx(classes.companyStatTile, highlight && classes.companyStatTileHighlight)}>
        <Typography className={cx(classes.companyStatLabel, highlight && classes.companyStatLabelHighlight)}>
            {label}
        </Typography>
        <Typography className={cx(classes.companyStatValue, highlight && classes.companyStatValueHighlight)}>
            {value}
        </Typography>
    </Box>
)

const CompanySummary = React.memo(({ company, drivers = [] }) => {

    const { classes, cx } = useStyles()

    const totals = React.useMemo(() => {
        const tex = company.extra_charges_pay
        const { tc, td, thp, tkp, tp } = company.drivers.reduce((acc, driver) => {
            acc['tc'] += driver.adjusted_clocked_total
            acc['td'] += driver.adjusted_distance_total
            acc['thp'] += driver.total_hourly_pay
            acc['tkp'] += driver.total_km_pay
            acc['tp'] += driver.total_pay
            return acc
        }, { tc: 0, td: 0, thp: 0, tkp: 0, tp: 0 })
        return { tex, tc, td, thp, tkp, tp: tp + tex }
    }, [company])

    const handleGeneratePdf = useCallback((e) => {
        e.stopPropagation()
    }, [])

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Box className={classes.companySummaryBand}>
                    <Grid container className={classes.companySummaryRow} wrap="nowrap" alignItems="stretch">
                        <CompanyStatTile classes={classes} cx={cx} label="Total Clocked" value={formatSeconds(durationToSeconds(totals.tc))} />
                        <CompanyStatTile classes={classes} cx={cx} label="Total Distance" value={`${Number(totals.td || 0).toFixed(2)} km`} />
                        <CompanyStatTile classes={classes} cx={cx} label="Total Hourly Pay" value={money(totals.thp || 0)} />
                        <CompanyStatTile classes={classes} cx={cx} label="Total KM Pay" value={money(totals.tkp || 0)} />
                        <CompanyStatTile classes={classes} cx={cx} label="Extra Charge Pay" value={money(totals.tex || 0)} />
                        <CompanyStatTile classes={classes} cx={cx} label="TOTAL PAY" value={money(totals.tp || 0)} highlight />

                        <Box className={classes.companyDivider} />

                        <Box className={classes.companyRunningTotalGroup} onClick={(e) => e.stopPropagation()}>
                            <Button
                                variant="contained"
                                className={classes.companyGeneratePdfButton}
                                startIcon={<PictureAsPdfRounded sx={{ fontSize: 18 }} />}
                                onClick={handleGeneratePdf}
                            >
                                Generate PDF
                            </Button>
                        </Box>
                    </Grid>
                </Box>
            </Grid>
            <Grid size={12}>
                {drivers.map(d => <DriverGroupedSummary key={d.driver_id} driver={d} days={d.days} />)}
            </Grid>
        </Grid>
    )
})

CompanySummary.displayName = 'CompanySummary'
export default CompanySummary