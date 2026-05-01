import React from 'react';
import { LocalShipping, Home, Menu } from '@mui/icons-material';
import useStyles from './DriverLayout.Styles'
import { Grid } from '@mui/material';
import { Appbar } from '../../components'
import { useNavigate } from 'react-router-dom';

export default function DriverLayout(props) {

    const { classes, cx } = useStyles();
    const active = props.active || 'Home'
    const tid = props.tripId

    const navItems = [
        { url: '/driver-dashboard', icon: <Home sx={{ fontSize: 22 }} />, label: 'Home' },
        { url: `/driver-deliveries/${tid}`, icon: <LocalShipping sx={{ fontSize: 22 }} />, label: 'Deliveries' },
        { url: '/driver-dashboard', icon: <Menu sx={{ fontSize: 22 }} />, label: 'Menu' },
    ];

    const navigate = useNavigate()

    return (
        <div className={classes.root}>
            <div className={classes.bgMesh} />
            <div className={classes.appWrapper}>
                <Appbar />
                <Grid container className={classes.content}>
                    <Grid size={12}>
                        {props.children}
                    </Grid>
                </Grid>
                <nav className={classes.bottomNav}>
                    {navItems.map((item) => {
                        const isActive = active === item.label;
                        return (
                            <div
                                key={item.label}
                                className={cx(classes.navItem, isActive && classes.navItemActive)}
                                onClick={() => navigate(item.url)}
                            >
                                <span className={cx(classes.navIcon, isActive && classes.navIconActive)}>
                                    {item.icon}
                                </span>
                                <span className={cx(classes.navLabel, isActive && classes.navLabelActive)}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </nav>

            </div>
        </div>
    );
}