import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useContext } from "react"
import ThemeContext from "../context/ThemeContext"

const Header = ({ siteTitle }) => {
  const { palette } = useContext(ThemeContext)
  const baseColors = palette.baseColors
  return (
    <header
      style={{
        background: baseColors.background,
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
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: baseColors.color,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
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
