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
  const [incrementCasos24h, setIncrementCasos24h] = useState(0)
  const [casos, setCasos] = useState(0)
  const [incrementCasos, setIncrementCasos] = useState(0)
  const [paceData, setPaceData] = useState([])
  const [recuperados, setRecuperados] = useState(0)
  const [incrementRecuperados, setIncrementRecuperados] = useState(0)
  const [defunciones, setDefunciones] = useState(0)
  const [incrementDefunciones, setIncrementDefunciones] = useState(0)
  const [projectedCasos, setProjectedCasos] = useState(casos)
  const [firstMount, setFirstMount] = useState(true)
  const [loading, setLoading] = useState(true)
  moment.locale("es")

  const getInfectedData = () =>
    axios
      .get(
        "https://europe-west2-covid-radar.cloudfunctions.net/getInfectedData?action=stats&country=spain"
      )
      .then(response => response.data)
      .then(async data => {
        if (data) {
          setCasos24h(data.casos24h)
          setFecha(data.fecha)
          setCasos(data.casos)
          setRecuperados(data.recuperados)
          setDefunciones(data.fallecidos)
          setPaceData(data.pace)

          getHistoricalData(
            data.casos24h,
            data.casos,
            data.recuperados,
            data.fallecidos
          )
          setLoading(false)
        }
      })
      .catch(response => console.error("Response error", response))

  const getHistoricalData = (
    currentCasos24h,
    currentCasos,
    currentRecuperados,
    currentFallecidos
  ) => {
    axios
      .get("https://europe-west2-covid-radar.cloudfunctions.net/getHistorical")
      .then(response => response.data)
      .then(async data => {
        if (data && data.serie) {
          const { casos, casos24h, fallecidos, recuperados } = data.serie[
            data.serie.length - (data.serie.length > 1 ? 2 : 1)
          ]

          console.log("[serie]", casos, casos24h, fallecidos, recuperados)

          setIncrementCasos24h(currentCasos24h - casos24h)
          setIncrementCasos(currentCasos - casos)
          setIncrementRecuperados(currentRecuperados - recuperados)
          setIncrementDefunciones(currentFallecidos - fallecidos)
        }
      })
      .catch(error => console.log(error))
  }

  useEffect(() => {
    getInfectedData()
    const interval = setInterval(getInfectedData, 1000 * 60 * 30)
    return () => clearInterval(interval)
  }, [])

  const calculateProjectedCasos = (
    theDate,
    currentDate,
    theCasos,
    theCasos24h
  ) => {
    const offset = theDate.isValid()
      ? moment.duration(currentDate.diff(theDate))
      : moment.duration(1000)

    const projectedCasos =
      theCasos + (theCasos24h / (24 * 60 * 60)) * offset.asSeconds()
    return projectedCasos
  }

  const calculatePrediction = (fecha, casos, casos24h) => {
    const theDate = moment(fecha, "DD-MM-YYYY HH:mm:ss")
    const calculate = moment(theDate.toDate()).add(1, "d")
    const projectedCasos = calculateProjectedCasos(
      theDate,
      calculate,
      casos,
      casos24h
    )
    return projectedCasos
  }

  const updateStateWithPojectedCasos = () => {
    const theDate = moment(fecha, "DD-MM-YYYY HH:mm:ss")
    const projectedCasos = calculateProjectedCasos(
      theDate,
      moment(),
      casos,
      casos24h
    )
    setProjectedCasos(projectedCasos)
  }

  const getPace = () => paceData[paceData.length - 1].value

  useEffect(() => {
    let theTimeout
    if (casos !== 0) {
      if (firstMount) {
        updateStateWithPojectedCasos()
        setFirstMount(false)
      } else {
        theTimeout = setTimeout(updateStateWithPojectedCasos, 5000)
      }
    }
    return () => {
      clearTimeout(theTimeout)
    }
  }, [casos, projectedCasos, firstMount])

  return (
    <Layout>
      <SEO title="Home" />
      {loading ? (
        <Spinner />
      ) : (
        <Wrapper>
          <DataCard
            projectedCasos={projectedCasos}
            recuperados={recuperados}
            incrementRecuperados={incrementRecuperados}
            defunciones={defunciones}
            incrementDefunciones={incrementDefunciones}
            state="España"
            casos={casos}
            incrementCasos={incrementCasos}
            fecha={fecha}
            pace={getPace()}
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
            {fecha}
          </Legend>
          <PrediccionCard
            prediccion={calculatePrediction(fecha, casos, casos24h)}
          />
          <PaceChartCard paceData={paceData} />
        </Wrapper>
      )}
    </Layout>
  )
}

export default IndexPage
