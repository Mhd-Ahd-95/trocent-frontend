import React, { useState } from 'react';
import { LocalShipping, Home, Menu } from '@mui/icons-material';
import useStyles from './DriverLayout.Styles'
import { Grid } from '@mui/material';
import { Appbar } from '../../components'

export default function DriverLayout(props) {

    const { classes, cx } = useStyles();
    const [activeNav, setActiveNav] = useState('home');

    const navItems = [
        { id: 'home', icon: <Home sx={{ fontSize: 22 }} />, label: 'Home' },
        { id: 'deliveries', icon: <LocalShipping sx={{ fontSize: 22 }} />, label: 'Deliveries' },
        { id: 'menu', icon: <Menu sx={{ fontSize: 22 }} />, label: 'Menu' },
    ];

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
                        const isActive = activeNav === item.id;
                        return (
                            <div
                                key={item.id}
                                className={cx(classes.navItem, isActive && classes.navItemActive)}
                                onClick={() => setActiveNav(item.id)}
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