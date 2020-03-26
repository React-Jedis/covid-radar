import React from "react"
import { Chart } from "react-charts"

const PaceChart = ({ paceData, porcentualIncrementPace }) => {
  const data = React.useMemo(
    () => [
      {
        label: "Casos por minuto",
        data: paceData,
      },
      {
        label: "Incremento porcentual",
        data: porcentualIncrementPace,
        type: "bar",
      },
    ],
    []
  )

  const series = React.useCallback(
    (s, i) => ({
      type: i % 2 === 0 ? "line" : "bar",
    }),
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
      }}
    >
      <Chart data={data} axes={axes} series={series} tooltip dark />
    </div>
  )
}

export default PaceChart
