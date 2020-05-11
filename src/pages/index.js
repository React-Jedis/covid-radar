import React, { useState, useEffect } from "react"
import moment from "moment"
import axios from "axios"
import styled from "styled-components"

import Layout from "../components/layout"
import SEO from "../components/seo"
import DataCard from "../components/DataCard"
import Spinner from "../components/Spinner"
import PaceChartCard from "../components/PaceChartCard"
import PrediccionCard from "../components/PrediccionCard"
import GeneralChartCard from "../components/GeneralChartCard"

const Legend = styled.span`
  padding: 3px;
  text-align: center;
  display: block;
  font-size: 12px;
  color: grey;
  .isciilink {
    color: ${props => props.theme.palette.baseColors.projected};
    text-decoration: none;
  }
`

const Wrapper = styled.div`
  > * {
    margin-bottom: 10px;
  }

  > *:first-of-type,
  > *:last-of-type {
    margin: 0;
  }
`

const IndexPage = () => {
  const [fecha, setFecha] = useState("")
  const [casos24h, setCasos24h] = useState(0)
  const [casosActivos, setCasosActivos] = useState(0)
  const [incrementCasosActivos, setIncrementCasosActivos] = useState(0)
  const [casos, setCasos] = useState(0)
  const [incrementCasos, setIncrementCasos] = useState(0)
  const [recuperados, setRecuperados] = useState(0)
  const [incrementRecuperados, setIncrementRecuperados] = useState(0)
  const [defunciones, setDefunciones] = useState(0)
  const [incrementDefunciones, setIncrementDefunciones] = useState(0)
  const [projectedCasos, setProjectedCasos] = useState(casos)
  const [firstMount, setFirstMount] = useState(true)
  const [loading, setLoading] = useState(true)
  const [APIData, setAPIData] = useState([])
  const [pace, setPace] = useState(0)
  moment.locale("es")

  const formatDataFromAPI = rawData => {
    const last = rawData.length - 1
    const yesterday = rawData.length - 2
    const casos24h = rawData[last].Confirmed - rawData[yesterday].Confirmed
    setCasos24h(casos24h)
    setFecha(rawData[last].Date)
    setCasos(rawData[last].Confirmed)
    setRecuperados(rawData[last].Recovered)
    setDefunciones(rawData[last].Deaths)
    setCasosActivos(rawData[last].Active)
    setIncrementCasos(casos24h)
    setIncrementRecuperados(
      rawData[last].Recovered - rawData[yesterday].Recovered
    )
    setIncrementDefunciones(rawData[last].Deaths - rawData[yesterday].Deaths)
    setIncrementCasosActivos(rawData[last].Active - rawData[yesterday].Active)

    setPace((casos24h / (24 * 60)).toFixed(2))
  }

  const getInfectedDataAPI = () => {
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
        formatDataFromAPI(data)
        setAPIData(data)
        setLoading(false)
      })
      .catch(error => console.log(error))
  }

  useEffect(() => {
    getInfectedDataAPI()
  }, [])

  return (
    <Layout>
      <SEO title="Home" />
      {loading ? (
        <Spinner />
      ) : (
        <Wrapper>
          <DataCard
            activeCasos={casosActivos}
            incrementActiveCasos={incrementCasosActivos}
            recuperados={recuperados}
            incrementRecuperados={incrementRecuperados}
            defunciones={defunciones}
            incrementDefunciones={incrementDefunciones}
            state="España"
            casos={casos}
            incrementCasos={incrementCasos}
            fecha={fecha}
            pace={pace}
          />
          <Legend>
            *Última actualización del{" "}
            <a
              className="isciilink"
              href="https://covid19.isciii.es"
              target="_blank"
            >
              isciii
            </a>{" "}
            {moment(fecha).format("DD/MM/YYYY")}
          </Legend>
          <GeneralChartCard />
        </Wrapper>
      )}
    </Layout>
  )
}

export default IndexPage
