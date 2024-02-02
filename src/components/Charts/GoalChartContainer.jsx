import React, { useState, useEffect } from "react";
import { Typography, Grid, CircularProgress } from "@mui/material";
import GoalSelect from "../GoalSelect";
import GoalChart from "./GoalChart";
import getApiUrl from "../../helpers/apiConfig";

const apiUrl = getApiUrl();

const GoalChartContainer = () => {
  const [selectedGoal, setSelectedGoal] = useState();
  const [progress, setProgress] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onChangeGoal = async (aGoal) => {
    setSelectedGoal(aGoal);
  };

  const getProgressForGoal = async () => {
    setIsLoading(true);
    if(selectedGoal.type == "calories burn")
    {
      var response = await fetch(
        apiUrl +
        "/api/exerciseDone/user/" +
        localStorage.getItem("userId") +
        "/startDate/" +
        selectedGoal.startDate +
        "/endDate/" +
        selectedGoal.endDate,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
    }
    else{
    var response = await fetch(
      apiUrl +
      "/api/meals/user/" +
      localStorage.getItem("userId") +
      "/startDate/" +
      selectedGoal.startDate +
      "/endDate/" +
      selectedGoal.endDate+
      "/type/" +
      selectedGoal.type,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
  }
    const data = await response.json();
    setProgress(data.totalConsumido);
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedGoal) {
      getProgressForGoal();
    }
  }, [selectedGoal]);

  return (
    <div className="col-lg-4 col-md-6">
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="1%"
        style={{ color: "black", width: "100%" }}
      >
        ACTIVE GOALS
      </Typography>
      <Grid container alignItems="center" style={{ width: "100%" }}>
        <Grid item xs={12}>
          <GoalSelect onChangeGoal={onChangeGoal} />
        </Grid>
      </Grid>

      {isLoading ? (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <CircularProgress size={80} thickness={3} />
        </div>
      ) : selectedGoal ? (
        <Grid
          container
          alignItems="center"
          style={{ width: "100%", maxWidth: 600 }}
          textAlign="center"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <GoalChart goal={selectedGoal.objetive} progress={progress} />
          </div>
          <Typography
            style={{
              color: "black",
              fontSize: "18px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {progress > selectedGoal.objetive
              ? <>
                You exceeded by
                <span style={{ fontWeight: 'bold' }}> {progress - selectedGoal.objetive} </span>
                {selectedGoal.type}
              </>
              : <>
                You are missing
                <span style={{ fontWeight: 'bold' }}> {selectedGoal.objetive - progress} </span>
                {selectedGoal.type}
              </>
            }
          </Typography>
          {progress < selectedGoal.objetive && (
            <Typography
              style={{
                color: "black",
                fontSize: "18px",
                width: "100%",
                textAlign: "center",
              }}
            >
              You have time until: <span style={{ fontWeight: 'bold' }}>{selectedGoal.endDate.split("T")[0]}</span>
            </Typography>
          )}
        </Grid>
      ) : (
        <p
          style={{
            color: "black",
            fontSize: "18px",
            textAlign: "center",
            marginTop: "10%",
            fontWeight: "bold",
          }}
        >
          You dont have active goals
        </p>
      )}
    </div>
  );
};

export default GoalChartContainer;
