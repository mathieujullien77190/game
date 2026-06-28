import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import LevelEditor from "components/LevelEditor"
import { GlobalStyle } from "./GlobalStyle"
import { DebugOverlay } from "./components/DebugOverlay/DebugOverlay"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <LevelEditor />
    <DebugOverlay />
  </StrictMode>
)
