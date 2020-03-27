import React from "react"
import Card from "./Card/Card"
import styled from "styled-components"

const PredictionData = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  color: ${props => props.theme.palette.baseColors.cardTitle};
  .text {
    margin-right: 30px;
    font-size: 12px;
    line-height: 19px;
  }
  .number {
    font-size: 30px;
  }
`

const PrediccionCard = ({ prediccion }) => (
  <Card>
    <PredictionData>
      <span className="text">
        Predicción próxima acualización del Ministerio de sanidad (ISCII)
      </span>
      <span className="number">{prediccion.toLocaleString()}</span>
    </PredictionData>
  </Card>
)

export default PrediccionCard
