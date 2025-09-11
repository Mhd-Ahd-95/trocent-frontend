import React from "react";
import { Grid, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import { TextInput } from "./DefaultOrder";
import PropTypes from "prop-types";
import { useTheme, styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Appbar = styled(AppBar)(({ theme }) => ({
  borderRadius: 10,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  color: theme.palette.grey[600],
  backgroundColor: "#fff",
  borderColor: 0,
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  //   boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
  boxShadow: "none",
}));

const Fieldset = styled('fieldset')(({theme}) => ({
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: 4,
    paddingBlock: theme.spacing(3),
    '& .title': {
        fontSize: 13,
        fontWeight: 600,
        // paddingInline: 5
    }
}))

export function InterlineCarrierForm(props) {
  const { interline_type, register, label } = props;

  return (
    <Grid container spacing={2} mt={2}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label={label ? `${label} Interline*` : "Interline*"}
          variant="outlined"
          fullWidth
          {...register(
            interline_type
              ? `interline_carrier.${interline_type}.interline`
              : "interline_carrier.interline",
            {
              required: "Interline is a required field",
            }
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label="Email"
          variant="outlined"
          fullWidth
          {...register(
            interline_type
              ? `interline_carrier.${interline_type}.email`
              : "interline_carrier.email"
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label="Contact Name"
          variant="outlined"
          fullWidth
          {...register(
            interline_type
              ? `interline_carrier.${interline_type}.contact_name`
              : "interline_carrier.contact_name"
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label="Phone Number"
          variant="outlined"
          fullWidth
          {...register(
            interline_type
              ? `interline_carrier.${interline_type}.phone_number`
              : "interline_carrier.phone_number"
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <TextInput
          label="Address*"
          variant="outlined"
          fullWidth
          {...register(
            interline_type
              ? `interline_carrier.${interline_type}.address`
              : "interline_carrier.address"
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label="Suite"
          variant="outlined"
          fullWidth
          {...register(
            interline_type
              ? `interline_carrier.${interline_type}.suite`
              : "interline_carrier.suite"
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label="City"
          variant="outlined"
          fullWidth
          {...register(
            interline_type
              ? `interline_carrier.${interline_type}.city`
              : "interline_carrier.city"
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label="Province/State"
          variant="outlined"
          fullWidth
          {...register(
            interline_type
              ? `interline_carrier.${interline_type}.province`
              : "interline_carrier.province"
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <TextInput
          label="Postal code"
          variant="outlined"
          fullWidth
          {...register(
            interline_type
              ? `interline_carrier.${interline_type}.postal_code`
              : "interline_carrier.postal_code"
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <TextField
          label="Special Instructions"
          variant="outlined"
          {...register(
            interline_type
              ? `interline_carrier.${interline_type}.special_instructions`
              : "interline_carrier.special_instructions"
          )}
          multiline
          minRows={3}
          maxRows={3}
          fullWidth
          sx={{
            "& .MuiInputLabel-root": {
              fontSize: "13px",
            },
          }}
        />
      </Grid>
      <Grid size={12}>
        <Fieldset>
          <legend className='title'>{label ? label + " Charges" : "Charges"}</legend>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <FormControl
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    height: 45,
                  },
                  "& .MuiOutlinedInput-input": {
                    fontSize: "12px",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "12px",
                  },
                  "& .MuiInputLabel-shrink": {
                    fontSize: "12px",
                  },
                  '& .MuiInputAdornment-root': {
                      marginLeft: -1,
                  }
                }}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Total Charge Amount
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  type="number"
                  id="outlined-adornment-charge"
                  {...register(
                    interline_type
                      ? `interline_carrier.${interline_type}.charge_amount`
                      : "interline_carrier.charge_amount"
                  )}
                  endAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <TextInput
                label="Reference/Invoice #"
                variant="outlined"
                fullWidth
                {...register(
                  interline_type
                    ? `interline_carrier.${interline_type}.invoice`
                    : "interline_carrier.invoice"
                )}
              />
            </Grid>
          </Grid>
        </Fieldset>
      </Grid>
    </Grid>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      key={index}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {/* <Typography>{children}</Typography> */}
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export function TabInterlineForm(props) {
  const { labels, contents } = props;
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid
      container
      mt={2}
      sx={{ border: "1px solid " + theme.palette.grey[200], borderRadius: 2 }}
    >
      <Grid size={12}>
        <Box
          sx={{
            bgcolor: "transparent",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Appbar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="inherits"
              // centered
              textColor="primary"
              variant="scrollable"
              aria-label="full width tabs example"
            >
              {labels.map((label, index) => (
                <Tab
                  label={label}
                  key={index}
                  {...a11yProps(index)}
                  sx={{
                    fontSize: 14,
                    textTransform: "capitalize",
                    fontWeight: 600,
                  }}
                />
              ))}
            </Tabs>
          </Appbar>
        </Box>
      </Grid>
      <Grid size={12}>
        {contents.map((content, index) => (
          <TabPanel
            value={value}
            index={index}
            key={index}
            dir={theme.direction}
          >
            {content}
          </TabPanel>
        ))}
      </Grid>
    </Grid>
  );
}
