import React from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { WizardCard, StyledButton, SubmitButton } from "../../components";
import BasicInfo from "./BasicInfo";
import EmailsAndNotifications from "./EmailsAndNotifications";
import PaymentInfo from "./PaymentInfo";
import Flags from "./Flags";
import Others from "./Others";
import FuelSurcharge from './FuelSurcharge'
import CustomAccessorials from "./CustomAccessorials";
import CustomVehicleTypes from "./CustomVehicleTypes";

export default function CustomerForm(props) {

    const { initialValues, submit, editMode } = props
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch
    } = useForm({
        defaultValues: {
            account_number: '',
            name: '',
            address: '',
            suite: '',
            province: '',
            city: '',
            postal_code: '',
            account_contact: '',
            phone_number: '',
            fax_number: '',
            terms_of_payment: '',
            weight_pieces_rule: '',
            fuel_surcharge_rule: '',
            opening_date: null,
            last_invoice_date: null,
            last_payment_date: null,
            credit_limit: '',
            account_balance: '',
            language: '',
            invoicing: '',
            billing_emails: [],
            pod_emails: [],
            status_update_emails: [],
            notification_preferences: [],
            account_active: false,
            mandatory_reference_number: false,
            summary_invoice: false,
            tax_options: '',
            receive_status_update: false,
            include_pod_with_invoice: false,
            fuel_ltl: '',
            fuel_ftl: '',
            fuel_ltl_other: false,
            fuel_ftl_other: false,
            fuel_ltl_other_value: '',
            fuel_ftl_other_value: '',
            vehicle_types: [],
            accessorials: [],
            file: '',
            filename: '',
            filesize: '',
            ...initialValues
        }
    })

    const onSubmit = async (data, e) => {
        e.preventDefault()
        setLoading(true)
        const action = e?.nativeEvent?.submitter?.id;
        const formData = new FormData()

        const accessorials = data['accessorials']
        const vehicleTypes = data['vehicle_types']

        if (accessorials && accessorials.length > 0) {
            accessorials.forEach((access, index) => {
                Object.entries(access).forEach(([key, val]) => {
                    formData.append(`accessorials[${index}][${key}]`, val)
                })
            })
        }

        if (vehicleTypes && vehicleTypes.length > 0) {
            vehicleTypes.forEach((vtype, index) => {
                Object.entries(vtype).forEach(([key, val]) => {
                    formData.append(`vehicle_types[${index}][${key}]`, val)
                })
            })
        }

        for (let [key, value] of Object.entries(data)) {
            if (['accessorials', 'vehicle_types'].includes(key)) continue
            if (key === 'billing_emails' || key === 'pod_emails' || key === 'status_update_emails' || key === 'notification_preferences') {
                value.forEach((vl, idx) => {
                    formData.append(`${key}[${idx}]`, vl)
                })
            }
            else {
                formData.append(key, value)
            }
        }

        try {
            await submit(formData);
            if (action === 'apply-customer-action') {
                navigate('/customers', { state: { fromEditOrCreate: true } });
            }
            else {
                reset()
            }
            editMode && props.refetch()
        } catch (error) {
            // console.log(error);
            //
        } finally {
            setLoading(false);
        }
    }

    const onError = errors => {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
            const field = document.querySelector(`[name="${firstErrorField}"]`);
            if (field) {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field.focus({ preventScroll: true });
            }
        }
    };

    return (
        <Grid container component={'form'} onSubmit={handleSubmit(onSubmit, onError)} spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                <WizardCard title='Basic Information' minHeight={400}>
                    <BasicInfo
                        register={register}
                        errors={errors}
                        control={control}
                        watch={watch}
                        setValue={setValue}
                    />
                </WizardCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <WizardCard title='Emails & Notifications' minHeight={400}>
                    <EmailsAndNotifications
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                        control={control}
                    />
                </WizardCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                <WizardCard title='Payment Information' minHeight={400}>
                    <PaymentInfo
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                        control={control}
                    />
                </WizardCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <WizardCard title='Fuel Surcharge' minHeight={200}>
                    <FuelSurcharge
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                        control={control}
                    />
                </WizardCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                <Others
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    control={control}
                    editMode={editMode}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <WizardCard title='Flags' >
                    <Flags
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                        control={control}
                    />
                </WizardCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                <CustomAccessorials
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    control={control}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <CustomVehicleTypes
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    control={control}
                />
            </Grid>
            <Grid size={12}>
                <Grid container spacing={2} justifyContent={'flex-start'}>
                    <Grid size='auto'>
                        <SubmitButton
                            type='submit'
                            variant='contained'
                            color='primary'
                            size='small'
                            textTransform='capitalize'
                            id='apply-customer-action'
                            isLoading={loading}
                        >
                            {!editMode ? 'Create' : 'Save Changes'}
                        </SubmitButton>
                    </Grid>
                    {!editMode && (
                        <Grid size='auto'>
                            <SubmitButton
                                type='submit'
                                variant='outlined'
                                color='secondary'
                                size='small'
                                textTransform='capitalize'
                                id='save-customer-action'
                                isLoading={loading}
                            >
                                Save & Create Another
                            </SubmitButton>
                        </Grid>
                    )}
                    <Grid size='auto'>
                        <StyledButton
                            variant='outlined'
                            color='error'
                            size='small'
                            disabled={loading}
                            textTransform='capitalize'
                            onClick={() => reset()}
                        >
                            Reset
                        </StyledButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

    )

}