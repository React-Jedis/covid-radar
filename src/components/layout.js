/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { theme } from "../config/theme"
import { ThemeProvider } from "styled-components"

import Header from "./header"
import SocialMedia from '../components/SocialMedia'
import "./layout.css"

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
          display: "grid",
          gridTemplateRows: "minmax(calc(100vh - 160px), 1fr) auto",
        }}
      >
        <main>{children}</main>
        <footer
          style={{
            fontSize: "11px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gridRowStart: "2",
            gridRowEnd: "3",
          }}
        >
          <SocialMedia />
          <span style={{ color: "#40c6a2" }}>
            © {new Date().getFullYear()}, <a>covid-radar.xyz</a>
          </span>
        </footer>
      </div>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
