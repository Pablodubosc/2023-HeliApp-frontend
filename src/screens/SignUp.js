import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useSnackbar } from "notistack";
import getApiUrl from "../helpers/apiConfig";
import VisibilityIcon from "@mui/icons-material/Visibility";

const apiUrl = getApiUrl();

const defaultTheme = createTheme();

const SignUp = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = React.useState(false);
  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    sex: "",
    height: "",
    weight: "",
    allergies:[{ name: ""}],
  });

  const handleSexChange = (event) => {
    setUser({ ...user, sex: event.target.value });
  };

  const handleWeightInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setUser({ ...user, weight: e.target.value });
    } else {
      setUser({ ...user, weight: "" });
    }
  };

  const handleHeightInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setUser({ ...user, height: e.target.value });
    } else {
      setUser({ ...user, height: "" });
    }
  };

  const handleAgeInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setUser({ ...user, age: e.target.value });
    } else {
      setUser({ ...user, age: "" });
    }
  };

  const handleRegister = () => {
    if (
      user.firstName === "" ||
      user.lastName === "" ||
      user.email === "" ||
      user.password === "" ||
      user.sex === "" ||
      user.age === "" ||
      user.height === "" ||
      user.weight === "" 
    ) {
      enqueueSnackbar("Some fields are empty.", { variant: "error" });
      return;
    }
    fetch(apiUrl + "/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then(function (response) {
      if (response.status === 200) {
        enqueueSnackbar("Registered successfully.", { variant: "success" });
        window.location.replace("/");
      } else {
        enqueueSnackbar("Something went wrong.", { variant: "error" });
      }
    });
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Sign up
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: { color: "black" },
                  }}
                  autoFocus
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: { color: "black" },
                  }}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: { color: "black" },
                  }}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: { color: "black" },
                    endAdornment: (
                      <VisibilityIcon
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      />
                    ),
                  }}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  name="age"
                  type="number"
                  value={user.age}
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: { color: "black" },
                    inputProps: { min: 1 },
                  }}
                  onChange={(e) => handleAgeInputChange(e)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <FormLabel style={{ color: "black" }}>Sex</FormLabel>
                  <RadioGroup
                    row
                    aria-label="sex"
                    name="sex"
                    value={user.sex}
                    onChange={handleSexChange}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio style={{ color: "black" }} />}
                      label="Male"
                      style={{ color: "black" }}
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio style={{ color: "black" }} />}
                      label="Female"
                      style={{ color: "black" }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="height"
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={user.height}
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: {
                      color: "black",
                    },
                    inputProps: { min: 1 },
                  }}
                  onChange={(e) => handleHeightInputChange(e)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="weight"
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={user.weight}
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: {
                      color: "black",
                    },
                    inputProps: { min: 1 },
                  }}
                  onChange={(e) => handleWeightInputChange(e)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" align="center" color="textSecondary">
                IMPORTANT: Manage food allergies within the app <span role="img" aria-label="settings" style={{ filter: 'brightness(0.4)' }}>(⚙️)</span> for a smoother experience!
              </Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#373D20",
                "&:hover": { backgroundColor: "#373D20" },
                fontWeight: "bold",
              }}
              onClick={handleRegister}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/" variant="body2" sx={{ color: "black" }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
