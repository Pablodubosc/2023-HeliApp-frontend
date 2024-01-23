import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import getApiUrl from '../../helpers/apiConfig';
import WaterGlassBarChart from "./WaterGlassBarChart";

const apiUrl = getApiUrl();

const WaterGlassBarChartContainer = ({flag}) => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const getWaterGlasses = async () => {
      const response = await fetch(
          apiUrl +
          "/api/waterGlass/countByDay/" +
          localStorage.getItem("userId"),
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
              },
          }
      );
      const data = await response.json();
      setData(data.result);
  }

  useEffect(() => {
      getWaterGlasses()
  }, [flag]);

  return (
    <div
      style={{
        textAlign: "center",
        color: "black",
        maxWidth: 300,
      }}
    >
      <Grid sx={{ maxHeight: "450px", minWidth: "310px", alignContent: 'center', textAlign: 'center' }}>
        <h2 style={{fontWeight: 'bold'}}>Water Glass History</h2>
        <div style={{ position: "relative", minHeight: 320, marginTop: "10%" }}>
          {loading ? (
            <CircularProgress />
          ) : data && data.length > 0 ? (
            <WaterGlassBarChart data={data} />
          ) : (
            <div style={{ fontSize: "18px", width: 320, marginTop: "10%" }}>
              No water glass information to show
            </div>
          )}
        </div>
      </Grid>
    </div>
  );
};

export default WaterGlassBarChartContainer;
