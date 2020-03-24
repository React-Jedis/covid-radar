import React from "react"
import styled from "styled-components"

const Card = styled.div`
    border: 1px solid grey;
    background-color:  rgba(255,255,255,.05);;
    border-radius: 4px;
    color: ${props => props.theme.palette.baseColors.color};
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      "title title title"
      "projected projected pace"
      "casos recuperados defunciones"
      "legend legend legend"
      ;
    grid-gap: 0.5rem;
    padding: 0.5rem 0.5rem 0 0.5rem;
    h3, h1 {
      margin: 0;
    }
    span {
      font-size: 12px;
    }
    > div {
      justify-self: stretch;
      align-self: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .recuperados {
      color: ${props => props.theme.palette.baseColors.recovered};
    }
    .projected {
      color: ${props => props.theme.palette.baseColors.projected};
      margin: 10px
    }
    .pace {
      border-radius: 2px;
      border: 1px solid grey;
      background-color: ${props => props.theme.palette.baseColors.color};
      color: ${props => props.theme.palette.baseColors.background};
      opacity: 0.8;
    }
    .casos {
      color: ${props => props.theme.palette.baseColors.cases};
    }
    .title {
      color: #cacaca;
    }
    .legend {
      font-size: 8px;
      color: grey;
      margin-right: 0.3rem;
      text-align: right;
      .isciilink {
        color: ${props => props.theme.palette.baseColors.projected};
        text-decoration: none;

      }
    }
  }
  .title {
    grid-area: title;
  }
  .casos {
    grid-area: casos;
  }
  .pace {
    grid-area: pace;
  }
  .projected {
    grid-area: projected;
  }
  .recuperados {
    grid-area: recuperados;
  }
  .defunciones {
    grid-area: defunciones;
  }
  .legend {
    grid-area: legend;
  }
`

const DataCard = ({
  casos,
  projectedCasos,
  recuperados,
  defunciones,
  state,
  fecha,
  hora,
  pace,
}) => (
  <Card>
    <span className="legend">
      *Última actualización del{" "}
      <a className="isciilink" href="https://covid19.isciii.es" target="_blank">
        isciii
      </a>{" "}
      {fecha} a las {hora}
    </span>
    <div className="title">
      <h1>{state}</h1>
    </div>
    <div className="pace">
      <h3>{pace.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
      <span>Casos/minuto</span>
    </div>
    <div className="casos">
      <h3>{casos.toLocaleString()}*</h3>
      <span>Casos</span>
    </div>
    <div className="projected">
      <h3 style={{ fontSize: "35px" }}>
        {parseInt(projectedCasos).toLocaleString()}
      </h3>
      <span>Estimación de casos hora actual</span>
    </div>
    <div className="recuperados">
      <h3>{recuperados.toLocaleString()}</h3>
      <span>Recuperados</span>
    </div>
    <div className="defunciones">
      <h3>{defunciones.toLocaleString()}</h3>
      <span>Defunciones</span>
    </div>
  </Card>
)

export default DataCard
