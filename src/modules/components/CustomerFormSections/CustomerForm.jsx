import React from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { WizardCard, StyledButton, SubmitButton, Modal } from "../../components";
import BasicInfo from "./BasicInfo";
import EmailsAndNotifications from "./EmailsAndNotifications";
import PaymentInfo from "./PaymentInfo";
import Flags from "./Flags";
import Others from "./Others";
import FuelSurcharge from './FuelSurcharge'
import CustomAccessorials from "./CustomAccessorials";
import CustomVehicleTypes from "./CustomVehicleTypes";
import RateSheetCustomerTable from "./RateSheetCustomerTable";
import RateSheetModal from "./RateSheetModal";

export default function CustomerForm(props) {

    const { initialValues, submit, editMode } = props
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()
    const [openModal, setOpenModal] = React.useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
        reset,
        getValues
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
            logo: '',
            ...initialValues
        }
    })

    const onSubmit = async (data, e) => {
        e.preventDefault()
        setLoading(true)
        const action = e?.nativeEvent?.submitter?.id;

        try {
            await submit(data);
            if (action === 'apply-customer-action') {
                navigate('/customers', { state: { fromEditOrCreate: true } });
            } else {
                reset()
            }
        } catch (error) {
            // console.error(error);
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
        <Grid container spacing={3}>
            <Grid size={12}>
                <Grid container component={'form'} onSubmit={handleSubmit(onSubmit, onError)} spacing={2}>
                    <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                        <WizardCard title='Basic Information' minHeight={400}>
                            <BasicInfo
                                register={register}
                                errors={errors}
                                control={control}
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
                                control={control}
                            />
                        </WizardCard>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                        <Others
                            getValues={getValues}
                            customerId={props.customer_id}
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
                                control={control}
                            />
                        </WizardCard>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                        <CustomAccessorials
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            getValues={getValues}
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
            </Grid>
            <Grid size={12}>
                {editMode && props.customer_id &&
                    <Grid size={12} pt={3}>
                        <Grid container>
                            <Grid size={12}>
                                <RateSheetCustomerTable
                                    customer_id={props.customer_id}
                                    setOpenModal={setOpenModal}
                                    openModal={openModal}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                }
            </Grid>
            <Modal open={openModal} handleClose={() => setOpenModal(false)} size='large'>
                <RateSheetModal
                    customer_id={props.customer_id}
                    handleClose={() => setOpenModal(false)}
                />
            </Modal>
        </Grid>
    )

}