import React, { useState, useEffect } from "react"
import moment from "moment"
import axios from "axios"

import Layout from "../components/layout"
import SEO from "../components/seo"
import DataCard from "../components/DataCard"
import Spinner from "../components/Spinner"
import PaceChartCard from "../components/PaceChartCard"

/*https://covid19.isciii.es/resources/data.csv
https://covid19.isciii.es/resources/ccaa.csv*/

const IndexPage = () => {
  const [fecha, setFecha] = useState("")
  const [casos24h, setCasos24h] = useState(0)
  const [casos, setCasos] = useState(0)
  const [paceData, setPaceData] = useState([])
  const [recuperados, setRecuperados] = useState(0)
  const [defunciones, setDefunciones] = useState(0)
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
          setLoading(false)
        }
      })
      .catch(response => console.error("Response error", response))

  useEffect(() => {
    getInfectedData()
    const interval = setInterval(getInfectedData, 1000 * 60 * 30)
    return () => clearInterval(interval)
  }, [])

  const calculateProjectedCasos = () => {
    const theDate = moment(fecha, "DD-MM-YYYY HH:mm:ss")
    const offset = theDate.isValid()
      ? moment.duration(moment().diff(theDate))
      : moment.duration(1000)
    setProjectedCasos(casos + (casos24h / (24 * 60 * 60)) * offset.asSeconds())
  }

  const getPace = () => paceData[paceData.length - 1].value

  useEffect(() => {
    let theTimeout
    if (casos !== 0) {
      if (firstMount) {
        calculateProjectedCasos()
        setFirstMount(false)
      } else {
        theTimeout = setTimeout(calculateProjectedCasos, 5000)
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
        <>
          <DataCard
            projectedCasos={projectedCasos}
            recuperados={recuperados}
            defunciones={defunciones}
            state="Spain"
            casos={casos}
            fecha={fecha}
            pace={getPace()}
          />
          <PaceChartCard paceData={paceData} />
        </>
      )}
    </Layout>
  )
}

export default IndexPage
