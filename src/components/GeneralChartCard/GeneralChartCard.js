import React, { useState, useEffect } from "react"
import axios from "axios"
import moment from "moment"

import Card from "../Card/Card"
import GeneralChart from "./GeneralChart"
import styled from "styled-components"

const Title = styled.div`
  padding: 10px;
  color: ${props => props.theme.palette.baseColors.cardTitle};
`
const formatToChartData = (fecha, value) => {
  return { x: new Date(fecha), y: value }
}

const GeneralChartCard = () => {
  const [realData, setRealData] = useState(null)

  const formatRawData = rawData => {
    const casos = []
    const recuperados = []
    const fallecidos = []
    const activos = []

    rawData.forEach((data, index) => {
      let casosIncrement =
        data.Confirmed - rawData[index > 0 ? index - 1 : 0].Confirmed
      const recuperadosIncrement =
        data.Recovered - rawData[index > 0 ? index - 1 : 0].Recovered
      const fallecidosIncrement =
        data.Deaths - rawData[index > 0 ? index - 1 : 0].Deaths
      let activosIncrement =
        data.Active - rawData[index > 0 ? index - 1 : 0].Active

      if (data.Date === "2020-04-24T00:00:00Z") {
        casosIncrement = "0"
        activosIncrement = "0"
      }

      casos.push(formatToChartData(data.Date, casosIncrement))
      recuperados.push(formatToChartData(data.Date, recuperadosIncrement))
      fallecidos.push(formatToChartData(data.Date, fallecidosIncrement))
      activos.push(formatToChartData(data.Date, activosIncrement))
    })

    setRealData({ casos, recuperados, fallecidos, activos })
  }

  useEffect(() => {
    axios
      .get(
        `https://api.covid19api.com/country/spain?from=2020-02-24T00:00:00Z&to=${moment(
          new Date()
        )
          .add(-1, "days")
          .toISOString()}`
      )
      .then(response => response.data)
      .then(async data => {
        console.log(
          moment(new Date())
            .add(-1, "days")
            .toISOString()
        )
        formatRawData(data)
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
