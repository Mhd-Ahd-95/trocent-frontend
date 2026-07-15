import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Grid, Typography, FormControl, Switch, InputAdornment, useTheme, CircularProgress, Box } from "@mui/material";
import { AttachMoney } from "@mui/icons-material";
import { useCustomerAccessorials } from '../../hooks/useCustomers'
import { SubmitButton, TextInput, CustomFormControlLabel, OrderEngine } from "../../components";
import globalVariables from "../../global";
import { unstable_batchedUpdates } from "react-dom";
import { useBillingMutation } from "../../hooks/useBillings";

function AccessorialCharges({ onClose, order }) {

    const customerId = order?.customer_id
    const orderAccessorials = order?.accessorials || []
    const pdtimes = [order.pickup_in, order.pickup_out, order.delivery_in, order.delivery_out]
    const waiting_time = [order.shipper_no_waiting_time, order.receiver_no_waiting_time]
    const freightRate = order.freight_rate

    const theme = useTheme()
    const { data = [], isLoading } = useCustomerAccessorials(customerId)
    const { formatAccessorial } = globalVariables.methods
    const { applyAccessorials } = useBillingMutation()

    const { control, handleSubmit, getValues, setValue } = useForm({ defaultValues: { customer_accessorials: [] } })
    const { fields: customerAccessorials, replace: replaceCustomerAccessorials } = useFieldArray({ control, name: 'customer_accessorials' })

    useEffect(() => {
        if (data.length === 0) return
        const merged = data
            .map(acc => {
                const found = orderAccessorials.find(oacc => Number(oacc.access_id) === Number(acc.access_id))
                return {
                    ...acc, is_included: !!found, charge_quantity: found ? found.charge_quantity : 0, charge_amount: found ? found.charge_amount : 0
                }
            })
            .sort((a, b) => a.access_name.localeCompare(b.access_name))
        replaceCustomerAccessorials(merged)
    }, [data, order])

    const handleChange = (checked, access, index) => {
        requestAnimationFrame(() => {
            if (index !== -1) {
                setValue(`customer_accessorials.${index}.is_included`, checked);
                if (checked) {
                    const amount = OrderEngine.accessorials_types(access.type, access, freightRate, 1, pdtimes, waiting_time)
                    setValue(`customer_accessorials.${index}.charge_quantity`, 1);
                    setValue(`customer_accessorials.${index}.charge_amount`, (Math.round(amount * 100) / 100))
                }
                else {
                    setValue(`customer_accessorials.${index}.charge_quantity`, 0);
                    setValue(`customer_accessorials.${index}.charge_amount`, 0)
                }
            }
        })
    }

    const handleQuantityChange = (value, access, index) => {
        unstable_batchedUpdates(() => {
            if (Number(value) >= 0) {
                if (Number(value) === 0) {
                    setValue(`customer_accessorials.${index}.is_included`, false);
                }
                const amount = OrderEngine.accessorials_types(access.type, access, freightRate, Number(value), pdtimes, waiting_time)
                setValue(`customer_accessorials.${index}.charge_quantity`, Number(value));
                setValue(`customer_accessorials.${index}.charge_amount`, (Math.round(amount * 100) / 100))
            }
        })
    }

    const onSubmit = async (formValues, e) => {
        e.preventDefault()
        const result = formValues.customer_accessorials
            .filter(row => row.is_included).map(row => ({ access_id: row.access_id, qty: row.charge_quantity, amount: row.charge_amount }))
        try {
            await applyAccessorials.mutateAsync({ id: order.order_id, payload: result })
            onClose && onClose()
        }
        catch (_) { }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexGrow: 1, overflow: 'auto', padding: '24px' }}>
                {customerAccessorials.length > 0 ? (
                    <Grid size={12} sx={{ py: 2, px: 3 }}>
                        <Grid container spacing={2}>
                            {customerAccessorials.map((access, index) => (
                                <Grid
                                    container
                                    spacing={2}
                                    key={access.id}
                                    sx={{ border: `1px solid ${theme.palette.grey[200]}`, py: 1.5, px: 2, borderRadius: 3 }}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    width={'100%'}
                                >
                                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                        <Typography variant='caption' sx={{ fontSize: 12, fontWeight: 400 }}>
                                            {formatAccessorial(access.access_name, access.amount, access.amount_type)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                                        <FormControl>
                                            <CustomFormControlLabel
                                                control={
                                                    <Controller
                                                        name={`customer_accessorials.${index}.is_included`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Switch
                                                                {...field}
                                                                checked={field.value || false}
                                                                onChange={e => handleChange(e.target.checked, access, index)}
                                                            />
                                                        )}
                                                    />
                                                }
                                                label=''
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 2 }} pl={2}>
                                        <Controller
                                            name={`customer_accessorials.${index}.charge_quantity`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextInput
                                                    {...field}
                                                    label='Qty'
                                                    variant='outlined'
                                                    fullWidth
                                                    disabled={!getValues(`customer_accessorials.${index}.is_included`)}
                                                    type='number'
                                                    inputProps={{ step: 'any' }}
                                                    value={field.value || ''}
                                                    onChange={e => handleQuantityChange(e.target.value, access, index)}
                                                    size='small'
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Controller
                                            name={`customer_accessorials.${index}.charge_amount`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextInput
                                                    {...field}
                                                    label='Amount'
                                                    variant='outlined'
                                                    fullWidth
                                                    disabled
                                                    size='small'
                                                    sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'black', fontWeight: 600, WebkitTextFillColor: 'black' } }}
                                                    slotProps={{ input: { endAdornment: (<InputAdornment position='end'><AttachMoney /></InputAdornment>) } }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ) : (
                    <Grid size={12} sx={{ py: 4, px: 3 }}>
                        {isLoading ?
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2" color="text.secondary">{'Loading accessorials...'}</Typography>
                            </Box>
                            :
                            <Typography variant='body2' color='textSecondary' textAlign='center'>
                                No accessorials available for this customer
                            </Typography>
                        }
                    </Grid>
                )}
            </div>
            <div style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '16px 24px', zIndex: 1 }}>
                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid size="auto">
                        <SubmitButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={applyAccessorials.isPending}
                            isLoading={applyAccessorials.isPending}
                            textTransform="capitalize"
                        >
                            Save Changes
                        </SubmitButton>
                    </Grid>
                </Grid>
            </div>
        </form>
    )
}

export default React.memo(AccessorialCharges)