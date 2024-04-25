import React, { useState, useEffect } from "react";
import Drawer from "../components/Drawer";
import { useTheme } from "@mui/material/styles";
import LabelBottomNavigation from "../components/BottomMenu";
import PieChartContainer from "../components/Charts/PieChartContainer";
import LineChartContainer from "../components/Charts/LineChartContainer";
import WaterGlassBarChartContainer from "../components/Charts/WaterGlassBarChartContainer";
import { Col, Row } from "react-bootstrap";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import Confetti from "react-confetti";
import getApiUrl from "../helpers/apiConfig";
import { useSnackbar } from "notistack";
import IntermittentFastingForm from "../components/Forms/IntermittentFastingForm";
import ViewingMessage from "../components/ViewingMessage";

const apiUrl = getApiUrl();

const Statistics = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flagToRerender, setFlagToRerender] = useState(false);
  const [openIntermittentFastingModal, setOpenIntermittentFastingModal] =
    useState(false);

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

  const handleCreateWaterGlass = () => {
    fetch(apiUrl + "/api/waterGlass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        date: new Date(),
        userId: localStorage.getItem("userId"),
      }),
    }).then(function (response) {
      if (response.status === 200) {
        enqueueSnackbar("The water glass was add successfully.", {
          variant: "success",
        });
        setFlagToRerender(!flagToRerender);
      } else {
        enqueueSnackbar("An error occurred while adding the water glss.", {
          variant: "error",
        });
      }
    });
  };

  const handleWaterGlassClick = () => {
    setShowConfetti(true);
    handleCreateWaterGlass();
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const handleIntermittentFasting = () => {
    setOpenIntermittentFastingModal(true);
  };

  const closeModal = () => {
    setOpenIntermittentFastingModal(false);
  };

  const actions = [
    { icon: <LocalDrinkIcon />, name: "Water", onClick: handleWaterGlassClick },
    {
      icon: <NotificationsActiveIcon />,
      name: "Intermittent Fasting",
      onClick: handleIntermittentFasting,
    },
  ];

  return (
    <div className="container">
      {isMobile ? (
        <LabelBottomNavigation />
      ) : (
        <Drawer user={localStorage.getItem("username")} />
      )}
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "fixed", bottom: "70px", right: "25px" }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      <Row>
        <Col
          xs={12}
          md={4}
          className="d-flex align-items-start justify-content-center p-0"
          style={{ minHeight: "500px" }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <PieChartContainer />
          </div>
        </Col>
        <Col
          xs={12}
          md={4}
          className="d-flex align-items-start justify-content-center p-0"
          style={{ minHeight: "600px" }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <LineChartContainer />
          </div>
        </Col>
        <Col
          xs={12}
          md={4}
          className="d-flex align-items-start justify-content-center p-0"
          style={{ minHeight: "550px" }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <WaterGlassBarChartContainer flag={flagToRerender} />
          </div>
        </Col>
      </Row>

      <IntermittentFastingForm
        openIntermittentFastingModal={openIntermittentFastingModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default Statistics;
