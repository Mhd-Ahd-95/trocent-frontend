import React, { useState } from "react";
import { Autocomplete, CircularProgress } from "@mui/material";
import { Controller } from "react-hook-form";
import TextInput from "./TextInput";

export default function SearchableAndCreateInput({
    name,
    control,
    label,
    placeholder,
    options = [],
    fieldProp = "name",
    onSelect,
    loading = false,
    rules = {},
    above = false,
}) {
    const [inputValue, setInputValue] = useState("");

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <Autocomplete
                    freeSolo
                    selectOnFocus
                    clearOnBlur={false}
                    handleHomeEndKeys
                    loading={loading}
                    options={options}
                    getOptionLabel={(opt) =>
                        typeof opt === "string" ? opt : opt[fieldProp] || ""
                    }
                    value={field.value || ""}
                    inputValue={inputValue}
                    onInputChange={(e, val) => {
                        setInputValue(val);
                    }}
                    onChange={(e, val) => {
                        if (typeof val === "string") {
                            field.onChange(val);
                            onSelect && onSelect({ [fieldProp]: val });
                            return;
                        }

                        if (val && typeof val === "object") {
                            field.onChange(val[fieldProp] || "");
                            onSelect && onSelect(val);
                            return;
                        }

                        field.onChange("");
                        onSelect && onSelect({});
                    }}
                    slotProps={{
                        popper: { placement: above ? "top-start" : "bottom" },
                    }}
                    renderInput={(params) => (
                        <TextInput
                            {...params}
                            placeholder={placeholder || ''}
                            label={label || ''}
                            variant='outlined'
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loading ? (
                                                <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                },
                            }}
                        />
                    )}
                />
            )}
        />
    );
}
