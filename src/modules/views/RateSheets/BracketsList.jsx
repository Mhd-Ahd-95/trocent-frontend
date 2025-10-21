import React from "react";
import { Grid, Button } from "@mui/material";
import BracketForm from "./BracketForm";
import { AccordionComponent } from "../../components";
import { useFieldArray } from "react-hook-form";
import { Add } from "@mui/icons-material";

const BracketsList = React.memo(({ control }) => {

    const { append, remove, fields } = useFieldArray({
        name: 'brackets',
        control
    })

    const handleAddBracket = React.useCallback(() => {
        append({
            rate_bracket: '',
            rate: '',
        })
    }, [append])

    return (
        <AccordionComponent
            defaultExpanded
            title='Rate Details'
            content={
                <Grid container spacing={2}>
                    {fields.map((field, index) => (
                        <Grid size={12} key={field.id || index}>
                            <BracketForm
                                key={field.id}
                                index={index}
                                field={field}
                                control={control}
                                remove={remove}
                            />
                        </Grid>
                    ))}
                    <Grid size={12} container justifyContent={'center'} alignItems={'center'}>
                        <Grid size='auto'>
                            <Button
                                startIcon={<Add />}
                                sx={{ textTransform: 'capitalize' }}
                                onClick={() => handleAddBracket()}
                            >
                                Add Bracket
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            }
        />
    );
});

export default BracketsList