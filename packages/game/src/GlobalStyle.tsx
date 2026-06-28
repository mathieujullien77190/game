import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    -webkit-tap-highlight-color: transparent;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    display: flex;
    justify-content: center;
    background: #0a0a0a;
  }

  #root {
    width: 100%;
    max-width: 430px;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`
