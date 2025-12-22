import React from "react";
import { Box, FormControl, FormLabel, Grid, Radio, RadioGroup } from '@mui/material'
import { AccordionComponent, CustomFormControlLabel, UploadLogo } from '../../components'
import { Controller, useFormContext } from "react-hook-form";

function Others(props) {

    const { customerId } = props

    const { control, getValues } = useFormContext()

    return <AccordionComponent
        title='Other'
        minHeight={205}
        bordered={'true'}
        subtitle='Set language, invoicing frequency, rush charges, and custom logo'
        content={
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Language</FormLabel>
                        <Controller
                            name="language"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <RadioGroup
                                        {...field}
                                        aria-labelledby="language-label"
                                    >
                                        <CustomFormControlLabel
                                            value="en"
                                            control={<Radio />}
                                            label="English"
                                        />
                                        <CustomFormControlLabel
                                            value="fr"
                                            control={<Radio />}
                                            label="French"
                                        />
                                    </RadioGroup>
                                </>
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Invoicing</FormLabel>
                        <Controller
                            name="invoicing"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <RadioGroup
                                        {...field}
                                        aria-labelledby="invoicing-label"
                                    >
                                        <CustomFormControlLabel
                                            value="daily"
                                            control={<Radio />}
                                            label="Daily"
                                        />
                                        <CustomFormControlLabel
                                            value="weekly"
                                            control={<Radio />}
                                            label="Weekly"
                                        />
                                        <CustomFormControlLabel
                                            value="monthly"
                                            control={<Radio />}
                                            label="Monthly"
                                        />
                                    </RadioGroup>
                                </>
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Controller
                                name={`logo`}
                                control={control}
                                render={({ field }) => (
                                    <UploadLogo
                                        editMode={props.editMode}
                                        field={field}
                                        control={control}
                                        logo_path={getValues('logo_path')}
                                        customerId={customerId}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        }
    />
}

export default React.memo(Others)