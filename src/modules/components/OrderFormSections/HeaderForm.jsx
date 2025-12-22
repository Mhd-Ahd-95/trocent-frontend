import React from 'react'
import { Button, colors, Grid, CircularProgress, useTheme } from '@mui/material'
import { DrawerForm, Modal, Confirmation } from '..'
import { useFormContext } from 'react-hook-form'
import {
    RotateLeftOutlined,
    HighlightOffOutlined,
    ContentCopyOutlined,
    HistoryOutlined
} from '@mui/icons-material'
import { useOrderMutations } from '../../hooks/useOrders'
import global from '../../global'
import { useNavigate } from 'react-router-dom'

function HeaderForm(props) {

    const { orderStatus, setOrderStatus, order_id } = props
    const { getValues, setValue, formState } = useFormContext()
    const navigate = useNavigate()
    const [openDrawer, setOpenDrawer] = React.useState(false)
    const [updating, setUpdating] = React.useState({ action: '', loading: false })
    const authedUser = global.auth.user
    const [orderUpdates, setOrderUpdates] = React.useState(getValues('order_updates'))
    const [openModal, setOpenModal] = React.useState(false)

    const { patchStatus, duplicateOrder } = useOrderMutations()

    const handleStatusChange = async (sts) => {
        try {
            setUpdating({ action: sts, loading: true })
            const updated = await patchStatus.mutateAsync({ id: order_id, uid: authedUser.id, sts: sts })
            requestAnimationFrame(() => {
                if (updated && updated.length > 0) {
                    setOrderStatus(sts === 'Canceled')
                    setValue('order_status', sts)
                    setOrderUpdates(updated)
                }
            })
        } catch (error) {
            //
        } finally {
            setUpdating({ action: '', loading: false })
        }
    }

    const duplicate = async () => {
        try {
            setUpdating({ action: 'duplicate', loading: true })
            await duplicateOrder.mutateAsync({
                id: order_id,
                user_id: authedUser.id
            })
            navigate('/orders')
        } catch (err) {
            //
        } finally {
            setUpdating({ action: '', loading: false })
        }
    }

    const format_order_updates = (orderUpdate) => {

        const section = orderUpdate.section
        const action = orderUpdate.action
        const value = orderUpdate.value

        switch (section) {
            case 'order_status':
                if (action === 'created')
                    return 'Order created with status ' + value
                return 'Order updated with status ' + value
            case 'client_info':
                return 'Section updated: Client Information'
            case 'basic_info':
                return 'Section updated: Basic Information'
            case 'references':
                return 'Section updated: References'
            case 'shipper_details':
                return 'Section updated: Shipper Details'
            case 'receiver_details':
                return 'Section updated: Receiver Details'
            case 'extra_stop':
                return 'Section updated: Extra Stop'
            case 'pickup_details':
                return 'Section updated: Pickup Details'
            case 'interliner_carrier':
                return 'Section updated: Interliner Carrier'
            case 'deliver_details':
                return 'Section updated: Delivery Details'
            case 'freights':
                return 'Section updated: Freights'
            case 'freight_charges':
                return 'Section updated: Freight Charges'
            case 'waiting_time':
                return 'Section updated: Waiting Time & Billing'
            case 'duplicated':
                return value
            default:
                return ''
        }
    }

    const theme = useTheme()

    return (
        <>
            <Grid container spacing={2} justifyContent={'flex-end'}>
                <Grid size='auto'>
                    <Button
                        variant='outlined'
                        onClick={() => setOpenDrawer(true)}
                        color='secondary'
                        sx={{ textTransform: 'capitalize' }}
                        startIcon={<HistoryOutlined />}
                        disabled={updating.loading}
                    >
                        Order Updates
                    </Button>
                </Grid>
                {orderStatus ? (
                    <Grid size='auto'>
                        <Button
                            variant='outlined'
                            color='secondary'
                            sx={{ textTransform: 'capitalize' }}
                            startIcon={<RotateLeftOutlined />}
                            disabled={updating.loading}
                            onClick={(e) => setOpenModal(2)}
                        >
                            {updating.action === 'Entered' && updating.loading && <CircularProgress style={{ marginRight: "10px" }} size={20} />}
                            {updating.action === 'Entered' && updating.loading ? 'Updating' : 'Restore'}
                        </Button>
                    </Grid>
                ) : (
                    <>
                        <Grid size='auto'>
                            <Button
                                variant='outlined'
                                color='error'
                                startIcon={<HighlightOffOutlined />}
                                sx={{ textTransform: 'capitalize' }}
                                disabled={updating.loading}
                                onClick={(e) => setOpenModal(1)}
                            >
                                {updating.action === 'Canceled' && updating.loading && <CircularProgress style={{ marginRight: "10px" }} size={20} />}
                                {updating.action === 'Canceled' && updating.loading ? 'Updating' : 'Cancel'}
                            </Button>
                        </Grid>
                        <Grid size='auto'>
                            <Button
                                variant='outlined'
                                color='info'
                                disabled={updating.loading}
                                startIcon={<ContentCopyOutlined />}
                                onClick={(e) => {
                                    e.preventDefault()
                                    duplicate()
                                }}
                                sx={{ textTransform: 'capitalize' }}
                            >
                                {updating.action === 'duplicate' && updating.loading && <CircularProgress style={{ marginRight: "10px" }} size={20} />}
                                {updating.action === 'duplicate' && updating.loading ? 'Processing' : 'Duplicate'}
                            </Button>
                        </Grid>
                    </>
                )}
                {props.editMode &&
                    <Grid size='auto'>
                        <Button
                            type='submit'
                            variant='outlined'
                            color='primary'
                            id='save-order-action'
                            disabled={formState?.isSubmitting || orderStatus}
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {formState?.isSubmitting && updating.action === '' && <CircularProgress style={{ marginRight: "10px" }} size={20} />}
                            Update Order
                        </Button>
                    </Grid>
                }
                {openDrawer && (
                    <DrawerForm title='Order Updates' setOpen={setOpenDrawer} open={openDrawer}>
                        <div style={{ flexGrow: 1, overflow: 'auto', padding: 15 }}>
                            {orderUpdates?.map((ou, index) => (
                                <div key={index} style={{ display: "flex", marginBottom: 16 }}>
                                    <div style={{
                                        width: "100%",
                                        background: colors.grey[100],
                                        padding: 12,
                                        borderRadius: 8,
                                        borderLeft: `4px solid ${theme.palette.primary.main}`
                                    }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                                            {format_order_updates(ou)}
                                        </div>
                                        <div style={{ fontSize: 12, color: colors.grey[600] }}>
                                            By <b>{ou.username}</b> — {new Date(ou.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </DrawerForm>
                )}

            </Grid>
            <Modal open={openModal === 1} handleClose={() => setOpenModal(false)}>
                <Confirmation
                    noIcon
                    title='Cancel Order Confirmation'
                    subtitle='Please confirm if you want to cancel this order.'
                    handleSubmit={() => handleStatusChange('Canceled')}
                    handleClose={() => setOpenModal(false)}
                />
            </Modal>

            <Modal open={openModal === 2} handleClose={() => setOpenModal(false)}>
                <Confirmation
                    noIcon
                    title='Restore Order Confirmation'
                    subtitle='Please confirm if you want to restore this order.'
                    handleSubmit={() => handleStatusChange('Entered')}
                    handleClose={() => setOpenModal(false)}
                />
            </Modal>
        </>
    )
}

export default React.memo(HeaderForm)
