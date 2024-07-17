import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useSnackbar } from "notistack";
import carousel1 from "../images/carousel1.jpg";
import carousel2 from "../images/carousel2.jpg";
import carousel3 from "../images/carousel3.jpg";
import carousel4 from "../images/carousel4.jpg";
import Slideshow from "../components/Slideshow";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import getApiUrl from "../helpers/apiConfig";
import getUrl from "../helpers/urlConfig";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../styles/Login.css";
const apiUrl = getApiUrl();
const url = getUrl();

const Login = () => {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [recoveryEmail, setRecoveryEmail] = React.useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= theme.breakpoints.values.sm);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  const { enqueueSnackbar } = useSnackbar();

  const images = [carousel1, carousel2, carousel3, carousel4];

  const handleRecoverClick = async () => {
    if (recoveryEmail === "") {
      enqueueSnackbar(
        "Please enter your email address to reset your password.",
        {
          variant: "error",
        }
      );
      return;
    } else {
      try {
        const response = await fetch(
          apiUrl + "/api/auth/users/email/" + recoveryEmail,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.data == null) {
          enqueueSnackbar("Incorrect email.", {
            variant: "error",
          });
          return;
        }
        //SOLO DEBERIA TRAER EL MAIL
        const userId = data.data._id;
        const userName = data.data.firstName + " " + data.data.lastName;
        setIsLoading(true);
        const response1 = await fetch(apiUrl + "/api/notifications/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          //ACA SOLO MANDO EL MAIL
          body: JSON.stringify({
            email: recoveryEmail,
            userName: userName,
            userId: userId,
            url: url,
          }),
        });
        setIsLoading(false);
        if (response1.status === 200) {
          enqueueSnackbar(
            "An email with the link to recover your password has been sent.",
            { variant: "success" }
          );
          setRecoveryEmail("");
          closeModal();
        } else {
          enqueueSnackbar("There was an issue with sending the email.", {
            variant: "error",
          });
        }
      } catch (error) {
        enqueueSnackbar("There was an issue with sending the email.", {
          variant: "error",
        });
      }
    }
  };

  const handleLogin = () => {
    if (user.email === "" || user.password === "") {
      enqueueSnackbar("Email or password is empty.", { variant: "error" });
      return;
    } else {
      setIsLoading(true);
      fetch(apiUrl + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            enqueueSnackbar("Successful login.", { variant: "success" });
            localStorage.setItem("token", data.token);
            localStorage.setItem(
              "username",
              data.user.firstName + " " + data.user.lastName
            );
            localStorage.setItem("userMail", data.user.email);

            window.location.replace("/main");
            setIsLoading(false);
          } else {
            setIsLoading(false);
            enqueueSnackbar("Wrong Email or Password.", { variant: "error" });
          }
        });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      {!isMobile && <Slideshow images={images} interval={2000} />}
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        style={{ backgroundColor: "#CAD2C5" }}
        elevation={6}
        square="true"
      >
        <div
          style={{
            justifyContent: "center",
            textAlign: "center",
            color: "black",
            marginTop: "10%",
          }}
        >
          <Typography variant="h3" fontWeight="bold" align="center">
            HELIAPP
          </Typography>
        </div>
        <Box
          sx={{
            my: 8,
            mx: 4,
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
            Sign in
          </Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              InputLabelProps={{
                style: { color: "black" },
              }}
              InputProps={{
                style: { color: "color", min: 0 },
              }}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleLogin();
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
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
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleLogin();
                }
              }}
            />
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
              onClick={() => handleLogin()}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            <Grid container justifyContent="center">
              <Grid container>
                <Grid item xs>
                  <span
                    onClick={openModal}
                    style={{
                      color: "black",
                      textDecoration: "underline",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Forgot password?
                  </span>
                </Grid>
                <Grid item style={{ justifyContent: "center" }}>
                  <Link
                    href="/SignUp"
                    variant="body2"
                    sx={{ color: "black", textDecorationColor: "black" }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 300,
            bgcolor: "#CAD2C5",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderColor: "black",
            borderStyle: "solid",
            borderRadius: "2%",
          }}
        >
          <IconButton
            aria-label="Close"
            onClick={closeModal}
            sx={{
              position: "absolute",
              top: "3%",
              right: "10px",
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>
          <h2 style={{ textAlign: "center" }}>Reset Password</h2>
          <p style={{ textAlign: "center" }}>
            Enter your email address to recover your password.
          </p>
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            id="email"
            autoComplete="email"
            InputLabelProps={{
              style: { color: "black" },
            }}
            InputProps={{
              style: { color: "black", min: 0 },
            }}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleRecoverClick();
              }
            }}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
              width: "100%",
            }}
            onClick={handleRecoverClick}
            disabled={isLoading}
          >
            Reset Password
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Login;