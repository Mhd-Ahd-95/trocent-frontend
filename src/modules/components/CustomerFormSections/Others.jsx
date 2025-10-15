import React from "react";
import { FormControl, FormLabel, Grid, Radio, RadioGroup } from '@mui/material'
import { AccordionComponent, CustomFormControlLabel, UploadLogo } from '../../components'
import { Controller } from "react-hook-form";


function Others(props) {

    const { watch, control, setValue } = props

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
                    <Controller
                        name={`file`}
                        control={control}
                        render={({ field }) => (
                            <UploadLogo
                                editMode={props.editMode}
                                field={field}
                                logoFile={{ filename: watch('filename'), filesize: watch('filesize'), logo_path: watch('logo_path'), id: watch('id') }}
                                setValue={setValue}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        }
    />
}

export default React.memo(Others)