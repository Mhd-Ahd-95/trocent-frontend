import React, { useState } from 'react';
import { PlayArrow, Inventory2, AccessTime, Speed, DirectionsCar, QueryBuilder } from '@mui/icons-material';
import useStyles from './LandingPage.styles'
import { Grid } from '@mui/material';
import { DriverLayout } from '../../layouts';

const DRIVER = {
    firstName: 'MATT',
    id: '0001',
    todayTrips: 4,
    completed: 3,
    pending: 1,
    serviceHours: '6h 42m',
};

const ASSIGNED_TRIPS = [
    // { id: 1, trip_number: 19965, trip_date: '2025-08-19', trip_status: 'planning' },
    // { id: 2, trip_number: 19966, trip_date: '2025-08-19', trip_status: 'planning' },
    // { id: 3, trip_number: 19978, trip_date: '2026-04-23', trip_status: 'planning' },
];

const RECENT_ACTIVITY = [
    { id: 1, dotClass: 'dotGreen', title: 'Trip #19965 — Delivered', sub: 'AT&A Advanced Technology · 2 skids', time: '14:32' },
    { id: 2, dotClass: 'dotGold', title: 'Trip #19958 — In Progress', sub: 'Pharmacon Group · 1 pallet · TEMP', time: '11:05' },
    { id: 3, dotClass: 'dotBlue', title: 'Trip #19942 — Picked Up', sub: 'Messagers WHS → TechXperts Inc.', time: '08:20' },
];

function formatTripDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
}

function TripItem({ trip, index, onSelect, isSelected }) {

    const dateLabel = formatTripDate(trip.trip_date);
    const isToday = dateLabel === 'Today';
    const { classes, cx } = useStyles({ isSelected, isToday, index })

    return (
        <div className={classes.tripItem} onClick={(e) => {
            e.preventDefault()
            onSelect(trip)
        }}>
            <div className={cx(classes.tripIndex)}>
                {index + 1}
            </div>
            <div className={classes.tripInfo}>
                <div className={classes.tripNumber}>Trip #{trip.trip_number}</div>
                <div className={classes.tripDate}>
                    <span className={cx(classes.tripDateDot)} />
                    {dateLabel}
                </div>
            </div>
            <div className={cx(classes.tripBadge, isToday ? classes.tripBadgeToday : classes.tripBadgeUpcoming)}>
                {isToday ? 'TODAY' : 'UPCOMING'}
            </div>
        </div>
    );
}

export default function DriverLanding() {
    const { classes, cx } = useStyles();
    const hasTrips = ASSIGNED_TRIPS.length > 0;

    const [selectTrip, setSelectTrip] = React.useState(null)

    const onSelect = React.useCallback((trip) => {
        setSelectTrip((prev) => {
            if (prev?.id === trip.id) return null
            return trip
        })
    }, [selectTrip])

    return (
        <DriverLayout>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <div className={classes.hero}>
                        <div className={classes.driverName}>
                            WELCOME,&nbsp;<em>{DRIVER.firstName}</em>
                        </div>
                        <div className={classes.driverMeta}>
                            <span className={cx(classes.badge, classes.badgeId)}>
                                <Speed sx={{ fontSize: 12 }} />
                                ID: {DRIVER.id}
                            </span>
                        </div>
                    </div>
                </Grid>
                
                <Grid size={12}>
                    <div className={classes.tripsCard}>
                        <div className={classes.tripsCardHeader}>
                            <div className={classes.tripsCardLeft}>
                                <div className={classes.tripsCardIcon}>
                                    <DirectionsCar sx={{ fontSize: 16, color: '#f59e0b' }} />
                                </div>
                                <span className={classes.tripsCardTitle}>Assigned Trips</span>
                            </div>
                            {hasTrips && (
                                <div className={classes.tripsCount}>{ASSIGNED_TRIPS.length}</div>
                            )}
                        </div>
                        {hasTrips ? (
                            <div className={classes.tripsList}>
                                {(ASSIGNED_TRIPS).sort((a, b) => new Date(b.trip_date) - new Date(a.trip_date)).map((trip, i) => (
                                    <TripItem
                                        key={trip.trip_number}
                                        trip={trip}
                                        index={i}
                                        isSelected={selectTrip?.id === trip.id}
                                        onSelect={onSelect}
                                        classes={classes}
                                        cx={cx}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={classes.noTrips}>
                                <div className={classes.noTripsIcon}>🚚</div>
                                <div className={classes.noTripsText}>No active trip assigned</div>
                                <div className={classes.noTripsSub}>Waiting for dispatch assignment</div>
                            </div>
                        )}
                    </div>
                </Grid>
                <Grid size={12}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <button className={cx(classes.actionBtn, classes.actionBtnPrimary)}>
                                <div className={classes.btnLeftGroup}>
                                    <div className={cx(classes.btnIcon, classes.btnIconPrimary)}>
                                        <PlayArrow sx={{ fontSize: 26, color: 'rgba(255,255,255,0.9)' }} />
                                    </div>
                                    <div>
                                        <div className={cx(classes.btnTitle, classes.btnTitlePrimary)}>Start Trip</div>
                                        <div className={classes.btnSubtitle}>View assigned orders</div>
                                    </div>
                                </div>
                                <span className={classes.btnArrow}>→</span>
                            </button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <button className={cx(classes.actionBtn, classes.actionBtnSecondary)}>
                                <div className={cx(classes.btnIcon, classes.btnIconSecondary)}>
                                    <Inventory2 sx={{ fontSize: 20, color: '#95a5a6' }} />
                                </div>
                                <div>
                                    <div className={classes.btnTitle}>Deliveries</div>
                                </div>
                            </button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <button className={cx(classes.actionBtn, classes.actionBtnTertiary)}>
                                <div className={cx(classes.btnIcon, classes.btnIconTertiary)}>
                                    <AccessTime sx={{ fontSize: 20, color: '#1a8a5a' }} />
                                </div>
                                <div>
                                    <div className={classes.btnTitle}>Hours</div>
                                </div>
                            </button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid size={12}>
                    <div className={classes.hoursChip}>
                        <div className={classes.hoursLeft}>
                            <span className={classes.hoursIcon}><QueryBuilder fontSize='medium' /></span>
                            <div>
                                <div className={classes.hoursTitle}>Service Hours</div>
                                <div className={classes.hoursValue}>{DRIVER.serviceHours}</div>
                            </div>
                        </div>
                        {/* <button className={classes.hoursBtn}>VIEW LOG</button> */}
                    </div>
                </Grid>
                {/* <Grid size={12}>
                    <div className={classes.sectionTitle}>Recent Activity</div>
                </Grid>
                <Grid size={12}>
                    <div className={classes.activitySection}>
                        <div className={classes.activityList}>
                            {RECENT_ACTIVITY.map((item) => (
                                <div className={classes.activityItem} key={item.id}>
                                    <div className={cx(classes.activityDot, classes[item.dotClass])} />
                                    <div className={classes.activityInfo}>
                                        <div className={classes.activityTitle}>{item.title}</div>
                                        <div className={classes.activitySub}>{item.sub}</div>
                                    </div>
                                    <div className={classes.activityTime}>{item.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid> */}
                <Grid size={12}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <div className={classes.statCard}>
                                <div className={cx(classes.statNumber, classes.statNumberGold)}>{DRIVER.todayTrips}</div>
                                <div className={classes.statLabel}>Today</div>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <div className={classes.statCard}>
                                <div className={cx(classes.statNumber, classes.statNumberGreen)}>{DRIVER.completed}</div>
                                <div className={classes.statLabel}>Done</div>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <div className={classes.statCard}>
                                <div className={cx(classes.statNumber, classes.statNumberBlue)}>{DRIVER.pending}</div>
                                <div className={classes.statLabel}>Pending</div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DriverLayout>
    );
}