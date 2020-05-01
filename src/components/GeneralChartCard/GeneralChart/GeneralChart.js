import React from "react"
import { Chart } from "react-charts"

const GeneralChart = ({ dataObj }) => {
  const data = React.useMemo(
    () => [
      {
        label: "Casos",
        data: dataObj.casos,
      },
      {
        label: "Recuperados",
        data: dataObj.recuperados,
      },
      {
        label: "Fallecidos",
        data: dataObj.fallecidos,
      },
    ],
    []
  )

  const colors = ["#ff8800", "#40c6a2", "#111111"]
  const getSeriesStyle = React.useCallback(
    series => ({
      color: colors[series.index],
    }),
    []
  )

  const series = React.useMemo(
    () => ({
      type: "line",
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
        height: "300px",
        padding: "10px",
      }}
    >
      <Chart
        data={data}
        axes={axes}
        series={series}
        getSeriesStyle={getSeriesStyle}
        tooltip
        dark
      />
    </div>
  )
}

export default GeneralChart
