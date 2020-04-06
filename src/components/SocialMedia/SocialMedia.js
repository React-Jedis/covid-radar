import React from "react"
import styled from "styled-components"

const SocialMedia = () => {
  return (
    <Wrapper>
      <SocialMediaIcon
        href={`whatsapp://send?text=${encodeURI(
          "Modelo predictivo de casos de infeción por el coronavirus conocido como covid-19. https://covid-radar.xyz"
        )}`}
        title="Comparte en Whatsapp"
        className="fa fa-whatsapp"
      />
      <SocialMediaIcon
        href="http://www.facebook.com/sharer.php?u=https://covid-radar.xyz.com"
        target="_blank"
        title="Comparte en Facebook"
        className="fa fa-facebook"
      />
      <SocialMediaIcon
        href={`https://twitter.com/share?url=https://covid-radar.xyz&amp;text=${encodeURI(
          "Modelo predictivo de casos de infeción por el coronavirus conocido como covid-19"
        )}&amp;hashtags=covid-radar`}
        target="_blank"
        title="Comparte en Twitter"
        className="fa fa-twitter"
      />
      <SocialMediaIcon
        href="http://www.linkedin.com/shareArticle?mini=true&amp;url=https://covid-radar.xyz"
        target="_blank"
        title="Comparte en Linkedin"
        className="fa fa-linkedin"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin: 0 auto;
`

const SocialMediaIcon = styled.a`
  &.fa {
    padding: 8px;
    font-size: 24px;
    width: 40px;
    text-align: center;
    text-decoration: none;
    margin: 5px 2px;
    border-radius: 50%;
  }

  &.fa:hover {
    opacity: 0.7;
  }

  /* Facebook */
  &.fa-facebook {
    background: #3b5998;
    color: white;
  }

  /* Twitter */
  &.fa-twitter {
    background: #55acee;
    color: white;
  }

  /* Whatsapp */
  &.fa-whatsapp {
    background: green;
    color: white;
  }

  &.fa-linkedin {
    background: #007bb5;
    color: white;
  }
`

export default SocialMedia
