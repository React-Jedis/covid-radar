import React from "react"
import moment from "moment"
import Card from "./Card/Card"
import PaceChart from "./PaceChart/PaceChart"
import styled from "styled-components"

const Title = styled.div`
  padding: 10px;
  color: ${props => props.theme.palette.baseColors.cardTitle};
`

const formatToChartPaceData = theData =>
  theData.map(pace => {
    return { x: moment(pace.fecha, "DD-MM-YYYY HH:mm:ss"), y: pace.value }
  })

const PaceChartCard = ({ paceData }) => (
  <Card>
    <Title>
      <h3>Evolución casos por minuto</h3>
    </Title>
    <PaceChart paceData={formatToChartPaceData(paceData)} />
  </Card>
)

export default PaceChartCard
