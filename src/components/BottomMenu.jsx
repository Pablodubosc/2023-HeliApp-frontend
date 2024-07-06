import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import LogoutIcon from "@mui/icons-material/Logout";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useNavigate, useLocation } from "react-router-dom";

export default function LabelBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(() => {
    // Inicializar el valor basado en la ruta actual
    switch (location.pathname) {
      case "/main":
        return "home";
      case "/meals":
        return "meals";
      case "/statistics":
        return "stats";
      case "/fitness":
        return "fitness";
      case "/myProfile":
        return "profile";
      case "/planifier":
        return "planifier";
      default:
        return "home";
    }
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);

    switch (newValue) {
      case "home":
        navigate("/main");
        break;
      case "stats":
        navigate("/statistics");
        break;
      case "profile":
        navigate("/myProfile");
        break;
      case "meals":
        navigate("/meals");
        break;
      case "fitness":
        navigate("/fitness");
        break;
      case "planifier":
        navigate("/planifier");
        break;
      case "logout":
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("viewAs");
        window.location.replace("/");
        break;
      default:
        break;
    }
  };

  return (
    <BottomNavigation
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        label="Home"
        value="home"
        icon={<HomeIcon />}
        sx={{
          minWidth: 0,
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0,
        }}
      />

      <BottomNavigationAction
        label="Stats"
        value="stats"
        icon={<BarChartIcon />}
        sx={{
          minWidth: 0,
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0,
        }}
      />
      <BottomNavigationAction
        label="Meals"
        value="meals"
        icon={<RestaurantIcon />}
        sx={{
          minWidth: 0,
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0,
        }}
      />
      <BottomNavigationAction
        label="Fitness"
        value="fitness"
        icon={<FitnessCenterIcon />}
        sx={{
          minWidth: 0,
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0,
        }}
      />
      <BottomNavigationAction
        label="Planifier"
        value="planifier"
        icon={<ContentPasteSearchIcon />}
        sx={{
          minWidth: 0,
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0,
        }}
      />
      <BottomNavigationAction
        label="Profile"
        value="profile"
        icon={<SettingsIcon />}
        sx={{
          minWidth: 0,
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0,
        }}
      />
      <BottomNavigationAction
        label="Logout"
        value="logout"
        icon={<LogoutIcon />}
        sx={{
          minWidth: 0,
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0,
        }}
      />
    </BottomNavigation>
  );
}
