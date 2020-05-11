import React, { useState, useEffect } from "react"
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

const PaceChartCard = ({ data }) => {
  const [paceData, setPaceData] = useState([])

  useEffect(() => {
    setPaceData(
      data.map(day => {
        return {
          x: new Date(day.date),
          y: day.value,
        }
      })
    )
  }, [])
  return (
    <Card>
      <Title>
        <h3>Evolución casos por minuto</h3>
      </Title>
      <PaceChart paceData={paceData} />
    </Card>
  )
}

export default PaceChartCard
