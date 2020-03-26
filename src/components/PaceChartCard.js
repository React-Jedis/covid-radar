import React from "react"
import moment from "moment"
import Card from "./Card/Card"
import PaceChart from "./PaceChart/PaceChart"

const formatToChartPaceData = theData =>
  theData.map(pace => {
    return { x: moment(pace.fecha, "DD-MM-YYYY HH:mm:ss"), y: pace.value }
  })

const PaceChartCard = ({ paceData }) => (
  <Card>
    <PaceChart paceData={formatToChartPaceData(paceData)} />
  </Card>
)

export default PaceChartCard
