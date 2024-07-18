import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import { useSnackbar } from "notistack";
import getApiUrl from "../helpers/apiConfig";
import VisibilityIcon from "@mui/icons-material/Visibility";
const apiUrl = getApiUrl();

const ResetPassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRepeatedPassword, setShowRepeatedPassword] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const handleResetPassword = async () => {
    setIsLoading(true);
    if (password === repeatPassword) {
      const response = await fetch(apiUrl + "/api/auth/users/updatePassword/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          _id: userId,
          secretToken: token,
        }),
      });

      if (response.status === 200) {
        enqueueSnackbar("The password was changed successfully.", {
          variant: "success",
        });
        setIsValid(false);
        setToken("");
        setPassword("");
        setRepeatPassword("");
        window.location.replace("/");
      }
    } else {
      enqueueSnackbar("The passwords do not match.", { variant: "error" });
    }
    setIsLoading(false);
  };

  const validateToken = async () => {
    if (token === "") {
      enqueueSnackbar("You need to enter the token.", { variant: "error" });
    } else {
      const response = await fetch(
        apiUrl + "/api/notifications/validateToken/" + token,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.data != null) {
        enqueueSnackbar("The token was validated.", { variant: "success" });
        setUserId(data.data._id);
        setIsValid(true);
      } else {
        enqueueSnackbar("The token is incorrect.", { variant: "error" });
      }
    }
  };

  return (
    <div className="container">
      <h1>
        <code>Reset your Password</code>
      </h1>

      {!isValid && (
        <Grid>
          <TextField
            margin="normal"
            required
            fullWidth
            name="token"
            label="Token"
            type="text"
            id="token"
            InputLabelProps={{
              style: { color: "black" },
            }}
            InputProps={{
              style: { color: "black", min: 0 },
            }}
            onChange={(e) => setToken(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                validateToken();
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
            onClick={() => validateToken()}
          >
            Validate
          </Button>
        </Grid>
      )}

      {isValid && (
        <Grid>
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
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleResetPassword();
              }
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Repeat Password"
            type={showRepeatedPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            InputLabelProps={{
              style: { color: "black" },
            }}
            InputProps={{
              style: { color: "black" },
              endAdornment: (
                <VisibilityIcon
                  onClick={() => setShowRepeatedPassword(!showRepeatedPassword)}
                  style={{ cursor: "pointer" }}
                />
              ),
            }}
            onChange={(e) => setRepeatPassword(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleResetPassword();
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
            onClick={() => handleResetPassword()}
            disabled={isLoading}
          >
            Reset Password
          </Button>
        </Grid>
      )}
    </div>
  );
};

export default ResetPassword;