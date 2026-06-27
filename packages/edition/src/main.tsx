import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import LevelEditor from "components/LevelEditor"
import { GlobalStyle } from "./GlobalStyle"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <LevelEditor />
  </StrictMode>
)
