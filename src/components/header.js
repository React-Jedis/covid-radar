import axios from "axios"
import PropTypes from "prop-types"
import React, { useContext, useState, useEffect } from "react"
import ThemeContext from "../context/ThemeContext"
import moment from "moment"
import "moment/locale/es"

const getIsciiiData = () =>
  axios
    .get("https://covid19.isciii.es/resources/data.csv")
    .then(response => console.log(response))

const Header = ({ siteTitle }) => {
  const [casos, setCasos] = useState(0)
  const [recuperados, setRecuperados] = useState(0)
  const [casos24h, setCasos24h] = useState(0)
  const [fecha, setFecha] = useState(0)
  const { palette } = useContext(ThemeContext)
  const baseColors = palette.baseColors
  const getInfectedData = () =>
    axios
      .get("https://covid-radar.firebaseio.com/stats.json")
      .then(response => response.data)
      .then(async data => {
        if (
          !data ||
          !data.lastUpdate ||
          data.lastUpdate > moment().add(1, "hours")
        ) {
          //await getIsciiiData()
        } else {
          setCasos24h(data.Casos24h)
          setCasos(data.Casos)
          setRecuperados(data.Recuperados)
          setFecha(data.Fecha)
        }
      })
      .catch(response => console.error("Response erro", response))

  useEffect(() => {
    getInfectedData()
  }, [])

  const calculateProjectedCases = () => {
    moment.locale("es")
    const theDate = moment(fecha, "DD [de] MMM [de] YYYY")
    debugger
    setCasos(casos + casos24h / (24 * 60 * 60 * 60))
  }

  useEffect(() => {
    setTimeout(calculateProjectedCases, 1000)
  }, [casos])

  return (
    <header
      style={{
        background: baseColors.color,
        marginBottom: `1.45rem`,
      }}
    >
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
        }}
      >
        <h1 style={{ margin: 0, color: baseColors.background }}>
          Casos: {new Intl.NumberFormat().format(parseInt(casos))}
        </h1>
        <h1 style={{ margin: 0, color: "green" }}>
          Recuperados: {recuperados}
        </h1>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
