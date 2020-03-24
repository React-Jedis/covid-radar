import React, { useState, useEffect } from "react"
import moment from "moment"
import axios from "axios"

import Layout from "../components/layout"
import SEO from "../components/seo"
import DataCard from "../components/DataCard"

/*https://covid19.isciii.es/resources/data.csv
https://covid19.isciii.es/resources/ccaa.csv*/

const IndexPage = () => {
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [casos24h, setCasos24h] = useState(0)
  const [casos, setCasos] = useState(0)
  const [recuperados, setRecuperados] = useState(0)
  const [defunciones, setDefunciones] = useState(0)
  const [projectedCasos, setProjectedCasos] = useState(casos)
  const [firstMount, setFirstMount] = useState(true)
  moment.locale("es")

  const getInfectedData = () =>
    axios
      .get("https://covid-radar.firebaseio.com/stats.json")
      .then(response => response.data)
      .then(async data => {
        if (data) {
          setCasos24h(data.Casos24h)
          setFecha(data.Fecha)
          setHora(data.Hora)
          setCasos(data.Casos)
          setRecuperados(data.Recuperados)
          setDefunciones(data.Defunciones)
        }
      })
      .catch(response => console.error("Response erro", response))

  useEffect(() => {
    getInfectedData()
    const interval = setInterval(getInfectedData, 1000 * 60 * 30)
    return () => clearInterval(interval)
  }, [])

  const calculateProjectedCasos = () => {
    const theDate = moment(fecha, "LL")
    const splitedHour = hora.split(":")
    theDate.add(splitedHour[0], "hours")
    theDate.add(splitedHour[1], "minutes")

    const offset = theDate.isValid()
      ? moment.duration(moment().diff(theDate))
      : moment.duration(1000)
    setProjectedCasos(casos + (casos24h / (24 * 60 * 60)) * offset.asSeconds())
  }

  const getPace = () => casos24h / (24 * 60)

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
      <DataCard
        projectedCasos={projectedCasos}
        recuperados={recuperados}
        defunciones={defunciones}
        state="Spain"
        casos={casos}
        fecha={fecha}
        hora={hora}
        pace={getPace()}
      ></DataCard>
    </Layout>
  )
}

export default IndexPage
