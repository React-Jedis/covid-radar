import React from "react"
import { Chart } from "react-charts"
import moment from "moment"

const PaceChart = ({ paceData }) => {
  const data = React.useMemo(
    () => [
      {
        label: "Casos por Minuto",
        data: [
          { x: moment(), y: 3.14 },
          { x: moment().add(1, "days"), y: 4.57 },
          { x: moment().add(2, "days"), y: 5.51 },
          { x: moment().add(3, "days"), y: 5.95 },
        ],
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
      }}
    >
      <Chart data={data} axes={axes} />
    </div>
  )
}

export default PaceChart
