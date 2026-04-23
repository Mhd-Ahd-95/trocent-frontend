import React from 'react';
import { Avatar, } from '@mui/material';
import useStyles from './Appbar.styles'


export default function Appbar() {

    const { classes } = useStyles();

    return (
        <div className={classes.topBar}>
            <div className={classes.logoMark}>
                Trocent
            </div>
            <div>
                <Avatar
                    className={classes.avatarRing}
                // onClick={handleClick}
                >
                    DA
                </Avatar>
            </div>
        </div>
    );
}