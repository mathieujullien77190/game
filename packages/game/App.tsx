import { registerRootComponent } from "expo"
import { StatusBar } from "expo-status-bar"
import { GameApp } from "./src/GameApp"
import { GlobalStyle } from "./src/GlobalStyle"

const App = () => (
  <>
    <GlobalStyle />
    <StatusBar style="dark" />
    <GameApp />
  </>
)

registerRootComponent(App)
