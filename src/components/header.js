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
`

const Header = () => {
  return (
    <Style>
      <h1>☣Covid Radar</h1>
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
