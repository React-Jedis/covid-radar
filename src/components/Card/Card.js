import React from "react"
import styled from "styled-components"

const Style = styled.div`
  border: 1px solid grey;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  color: ${props => props.theme.palette.baseColors.color};
  padding: 0.5rem 0.5rem 0 0.5rem;
  margin-bottom: 8px;
`

const Card = ({ children }) => <Style>{children}</Style>

export default Card
