import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";

export default function LineChartWithCustomFontSize({ data, type }) {
  const typeValidator = (type) => {if(type==="Calories Burn"){return "totalCaloriesBurn" } else{return "total"+type}}
  const caloriasArray = data.map((item) => item[typeValidator(type)]);
  const totalCalorias = caloriasArray.reduce((acc, curr) => acc + curr, 0);
  const promedioCalorias = totalCalorias / caloriasArray.length;

  const dataWithAverage = data.map((item) => ({
    date: item.date.split('T')[0],
    calories: item[typeValidator(type)],
    promedio: promedioCalorias,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      const filteredPayload = payload.filter((entry) => entry.dataKey !== "promedio");
  
      return (
        <div className="custom-tooltip" style={{
          background: '#f0f0f0', 
          border: '1px solid #333', 
          borderRadius: '5px', 
          padding:  '10px 10px 3px 10px',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)' ,
        }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#666'}}>Date: {label}</p> 
          {filteredPayload.map((entry) => (
            <p key={entry.dataKey} style={{ fontSize: '12px' , fontWeight: 'bold',}}>
              <span style={{ color: entry.color, marginRight: '5px' }}>{entry.name}:</span> {entry.value}
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };

  return (
    <div style={{ fontSize: 12 }}>
      <LineChart
        width={310}
        height={410}
        data={dataWithAverage}
        margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
      >
      <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          iconSize={25}
          layout="vertical"
          margin={{ top: 1000 }}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          label={{
            value: "Date",
            position: "bottom",
            fontSize: 14,
            fontWeight: "bold",
          }}
        />
        <YAxis
          label={{
            value: [type],
            angle: -90,
            position: "insideLeft",
            fontSize: 14,
            fontWeight: "bold",
            offset: 20,
            
          }}
        />
        <Legend verticalAlign="top" width={100} />
        <Line
          type="monotone"
          dataKey="calories"
          name={[type]}
          stroke="#936639"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="promedio"
          name={`${[type]} average (${promedioCalorias.toFixed(2)})`}
          stroke="#6a994e"
          dot={false}
          strokeWidth={2}
          strokeDasharray="3 3"
        />
      </LineChart>
    </div>
  );
}
