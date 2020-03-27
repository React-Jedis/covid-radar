import React from "react"
import { Chart } from "react-charts"

const PaceChart = ({ paceData, porcentualIncrementPace }) => {
  const data = React.useMemo(
    () => [
      {
        label: "Casos por minuto",
        data: paceData,
      },
    ],
    []
  )
  const axes = React.useMemo(
    () => [
      { primary: true, type: "time", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  )

  return (
    <div
      style={{
        width: "100%",
        height: "200px",
        padding: "10px",
      }}
    >
      <Chart data={data} axes={axes} tooltip dark />
    </div>
  )
}

export default PaceChart
