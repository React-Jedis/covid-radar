import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVirus } from "@fortawesome/free-solid-svg-icons"
import "moment/locale/es"

const Style = styled.header`
  background: ${props => props.theme.palette.baseColors.color};
  color: white;
  h1 {
    margin: 0;
    font-weight: 100;
    img {
      margin: 0;
    }
  }
  padding: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  h1 > span:last-of-type {
    margin-left: 8px;
  }
`

const Header = () => {
  return (
    <Style>
      <h1>
        <FontAwesomeIcon icon={faVirus} />
        <span>covid-radar</span>
      </h1>
    </Style>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
