import React from "react";
import { AuthLayout } from "../../layouts";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControlLabel,
  IconButton,
  InputAdornment,
  Grid,
  colors,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { StyledCheckBox, SubmitButton } from "../../components";


export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const usernameRef = React.useRef();
  const passwordRef = React.useRef();

  return (
    <AuthLayout title="Sign in">
      <Grid
        container
        component={"form"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        spacing={2}
      >
        <Grid size={12}>
          <TextField
            label="Username or Email"
            variant="outlined"
            required
            fullWidth
            inputRef={usernameRef}
            type="text"
            sx={{
              "& .MuiInputBase-root": {
                height: 45,
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "14px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "13px",
              },
              "& .MuiInputLabel-shrink": {
                fontSize: "14px",
              },
            }}
          />
        </Grid>
        <Grid size={12}>
          <FormControl
            variant="outlined"
            fullWidth
            required
            sx={{
              "& .MuiInputBase-root": {
                height: 45,
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "14px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "13px",
              },
              "& .MuiInputLabel-shrink": {
                fontSize: "14px",
              },
            }}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              fullWidth
              required
              inputRef={passwordRef}
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </Grid>

        <Grid size={12} component={Box} pt={1} pl={0.5}>
          <FormControlLabel
            control={<StyledCheckBox />}
            label={
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "15px",
                  color: colors.grey[800],
                }}
              >
                Remember me
              </Typography>
            }
          />
        </Grid>
        <Grid size={12} component={Box} pt={1}>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            textTransform="capitalize"
          >
            Sign In
          </SubmitButton>
        </Grid>
      </Grid>
    </AuthLayout>
  );
}
