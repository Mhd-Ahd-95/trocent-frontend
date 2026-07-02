import React, { useState } from 'react';
import { LocalShipping, Home, Menu, Check, Language } from '@mui/icons-material';
import useStyles from './DriverLayout.Styles'
import { Grid, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, CircularProgress } from '@mui/material';
import { Appbar } from '../../components'
import { useNavigate } from 'react-router-dom';
import { useDriverMutation } from '../../../hooks/useDrivers';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'fr', label: 'French', native: 'Français' },
];

export default function DriverLayout(props) {

    const { classes, cx } = useStyles();
    const { t, i18n } = useTranslation();
    const active = props.active || 'Home'
    const tid = props.tripId
    const isNoAction = props.isNoAction

    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { url: '/driver-dashboard', icon: <Home sx={{ fontSize: 22 }} />, label: 'Home', text: t('nav.home') },
        { url: isNoAction ? `/driver-deliveries/${tid}/${'no-action'}` : `/driver-deliveries/${tid}`, icon: <LocalShipping sx={{ fontSize: 22 }} />, label: 'Deliveries', text: t('nav.deliveries') },
        { url: null, icon: <Menu sx={{ fontSize: 22 }} />, label: 'Menu', text: t('nav.menu') },
    ];

    const navigate = useNavigate()
    const authedUser = JSON.parse(localStorage.getItem('authedUser'))
    const driverId = authedUser?.driver_id
    const currentLang = authedUser?.language || 'en'

    const { updateDriverLanguage } = useDriverMutation()
    const isUpdating = updateDriverLanguage.isPending || updateDriverLanguage.isLoading

    const handleLanguageSelect = async (langCode) => {
        if (langCode === currentLang || isUpdating) return;

        await updateDriverLanguage.mutateAsync({ did: driverId, lang: langCode });

        const updatedUser = { ...authedUser, language: langCode };
        localStorage.setItem('authedUser', JSON.stringify(updatedUser));
        i18n.changeLanguage(langCode);
        setMenuOpen(false);
    };

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
                                onClick={() => {
                                    if (item.label === 'Deliveries') {
                                        if (props.clockedInRef?.current === false) return
                                    }
                                    if (item.label === 'Menu') {
                                        setMenuOpen(true);
                                        return;
                                    }
                                    navigate(item.url)
                                }}
                            >
                                <span className={cx(classes.navIcon, isActive && classes.navIconActive)}>
                                    {item.icon}
                                </span>
                                <span className={cx(classes.navLabel, isActive && classes.navLabelActive)}>
                                    {item.text}
                                </span>
                            </div>
                        );
                    })}
                </nav>

                <Drawer
                    anchor="bottom"
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    classes={{ paper: classes.menuSheet }}
                >
                    <div className={classes.sheetHandle} />

                    <div className={classes.sheetSection}>
                        <div className={classes.sheetSectionHeader}>
                            <Language sx={{ fontSize: 18 }} />
                            <Typography className={classes.sheetSectionTitle}>
                                {t('menu.language')}
                            </Typography>
                        </div>

                        <List disablePadding>
                            {LANGUAGES.map((lang) => {
                                const isSelected = currentLang === lang.code;
                                return (
                                    <ListItemButton
                                        key={lang.code}
                                        selected={isSelected}
                                        onClick={() => handleLanguageSelect(lang.code)}
                                        className={classes.langItem}
                                        disabled={isUpdating}
                                    >
                                        <ListItemText
                                            primary={lang.native}
                                            secondary={lang.label}
                                            primaryTypographyProps={{ className: classes.langPrimary }}
                                            secondaryTypographyProps={{ className: classes.langSecondary }}
                                        />
                                        <ListItemIcon className={classes.langCheck}>
                                            {isUpdating && !isSelected ? null :
                                                isUpdating && isSelected ? <CircularProgress size={18} /> :
                                                    isSelected ? <Check sx={{ fontSize: 20 }} /> : null}
                                        </ListItemIcon>
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </div>
                </Drawer>
            </div>
        </div>
    );
}