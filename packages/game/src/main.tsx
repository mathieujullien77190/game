import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { GameApp } from "./GameApp"
import { GlobalStyle } from "./GlobalStyle"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <GameApp />
  </StrictMode>
)
