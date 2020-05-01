import React, { useState, useEffect } from "react"
import axios from "axios"

import Card from "../Card/Card"
import GeneralChart from "./GeneralChart"
import styled from "styled-components"

const Title = styled.div`
  padding: 10px;
  color: ${props => props.theme.palette.baseColors.cardTitle};
`
const formatToChartData = (fecha, value) => {
  return { x: new Date(fecha._seconds * 1000), y: value }
}

const GeneralChartCard = () => {
  const [realData, setRealData] = useState(null)

  const formatRawData = rawData => {
    const casos = []
    const recuperados = []
    const fallecidos = []

    rawData.forEach(data => {
      casos.push(formatToChartData(data.fecha, data.casos.increment))
      recuperados.push(
        formatToChartData(data.fecha, data.recuperados.increment)
      )
      fallecidos.push(formatToChartData(data.fecha, data.fallecidos.increment))
    })

    setRealData({ casos, recuperados, fallecidos })
  }

  useEffect(() => {
    axios
      .get(
        "https://europe-west2-covid-radar.cloudfunctions.net/getInfectedData?action=stats&country=historical"
      )
      .then(response => response.data)
      .then(async data => {
        formatRawData(data.serie)
      })
      .catch(error => console.log(error))
  }, [])

  return realData ? (
    <Card>
      <Title>
        <h3>Evolución de incrementos</h3>
      </Title>
      <GeneralChart dataObj={realData} />
    </Card>
  ) : (
    <div />
  )
}

export default GeneralChartCard
