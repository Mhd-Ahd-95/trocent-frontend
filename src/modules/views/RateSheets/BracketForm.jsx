import React from "react";
import { AccordionComponent, TextInput } from "../../components";
import { Controller, useWatch } from "react-hook-form";
import { Grid } from "@mui/material";

function BracketForm(props) {

    const { remove, control, index } = props

    const rate_bracket = useWatch({
        control,
        name: `brackets.${index}.rate_bracket`
    })


    const handleRemove = React.useCallback(() => remove(index), [index, remove])

    return (
        <AccordionComponent
            defaultExpanded
            handleDelete={handleRemove}
            key={index}
            title={rate_bracket || ''}
            content={
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Controller
                            name={`brackets.${index}.rate_bracket`}
                            control={control}
                            rules={{ required: 'Rate Bracket is a required field' }}
                            render={({ field, fieldState }) => (
                                <TextInput
                                    {...field}
                                    label='Rate Bracket*'
                                    variant='outlined'
                                    fullWidth
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Controller
                            name={`brackets.${index}.rate`}
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextInput
                                    {...field}
                                    label='Rate'
                                    variant='outlined'
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            }
            icons
            noClone
        />
    )

}

export default React.memo(BracketForm)