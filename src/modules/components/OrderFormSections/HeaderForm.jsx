import React from 'react'
import { Button, colors, Grid } from '@mui/material'
import { DrawerForm } from '..'


function HeaderForm(props) {

    const [openDrawer, setOpenDrawer] = React.useState(false)

    return (
        <Grid container spacing={2} justifyContent={'flex-end'}>
            <Grid size='auto'>
                <Button
                    variant='outlined'
                    onClick={() => setOpenDrawer(true)}
                    color='primary'
                    sx={{ textTransform: 'capitalize' }}
                >
                    Order Updates
                </Button>
            </Grid>
            {openDrawer &&
                <DrawerForm title='Order Updates' setOpen={setOpenDrawer} open={openDrawer}>
                    <div style={{
                        margin: 15,
                        background: colors.grey[200],
                        fontSize: 14,
                        fontWeight: 600,
                        paddingBlock: 7,
                        paddingInline: 10,
                        borderRadius: 5,
                    }}>
                        Order created with status Entered
                    </div>
                </DrawerForm>
            }
        </Grid>
    )

}

export default React.memo(HeaderForm)