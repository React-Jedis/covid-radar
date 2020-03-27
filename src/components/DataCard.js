import React from "react"
import styled from "styled-components"
import moment from "moment"
import Card from "../components/Card/Card"

const InfoData = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      "title . date"
      "projected projected pace"
      "casos recuperados defunciones"
      ;
    h3, h1 {
      margin: 0;
    }
    span.description {
      font-size: 12px;
    }
    span.data {
      font-size: 20px;
    }
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem 0;
    }
    .recuperados {
      background-color: ${props => props.theme.palette.baseColors.recovered};
      color: white;
    }
    .projected {
      color: ${props => props.theme.palette.baseColors.projected};
      margin: 10px
    }
    .pace {
      border-radius: 50%;
      margin: 10px;
      background-color:  ${props => props.theme.palette.baseColors.projected};
      color: white;
      
    }
    .casos {
      background-color: ${props => props.theme.palette.baseColors.cases};
      color: white;
    }
    .defunciones {
      background-color: ${props => props.theme.palette.baseColors.deaths};
      color: white;
    }
    .title {
      color: white;
      font-size: 25px;
    }
    .date {
      color: ${props => props.theme.palette.baseColors.cardTitle};
      font-size: 15px;
    }
    .casos-desc {
      opacity: 0.7
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
  .date {
    grid-area: date;
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
    <InfoData>
      <div className="title">
        <span>{state}</span>
      </div>
      <div className="date">
        <span>{moment().format("DD/MM/YYYY")}</span>
      </div>
      <div className="pace">
        <span className="data">
          {pace.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
        <span className="description casos-desc">casos / min.</span>
      </div>
      <div className="casos">
        <span className="data">{casos.toLocaleString()}*</span>
        <span className="description">casos</span>
      </div>
      <div className="projected">
        <span className="data" style={{ fontSize: "35px" }}>
          {parseInt(projectedCasos).toLocaleString()}
        </span>
        <span className="description">Estimación de casos hora actual</span>
      </div>
      <div className="recuperados">
        <span className="data">{recuperados.toLocaleString()}</span>
        <span className="description">recuperados</span>
      </div>
      <div className="defunciones">
        <span className="data">{defunciones.toLocaleString()}</span>
        <span className="description">defunciones</span>
      </div>
    </InfoData>
  </Card>
)

export default DataCard
