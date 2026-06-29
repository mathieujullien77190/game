import { createGlobalStyle } from "styled-components"

// Web only — ensures the full html/body/#root chain fills the viewport so the
// flex:1 app (and the game canvas) grows to use all available space.
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #root {
    display: flex;
    flex-direction: column;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`
