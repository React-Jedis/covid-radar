import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import "moment/locale/es"

const Style = styled.header`
  background: ${props => props.theme.palette.baseColors.color};
  color: ${props => props.theme.palette.baseColors.background};
  h1 {
    margin: 0;
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
        <span>☣</span>
        <span>Covid Radar</span>
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
