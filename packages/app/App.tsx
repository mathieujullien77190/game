import { View } from "react-native"
import { WebView } from "react-native-webview"
import { LEVELS } from "@tic-tac-tic/maps/levels.gen.ts"
import { previewHtml } from "./src/previewHtml"

// Coquille RN : héberge une WebView qui fait tourner le jeu (engine + UI « Calque » en canvas2d/DOM,
// cf. webview/main.ts, bundlé dans previewHtml). Le canvas2d dans le System WebView
// (Chromium, HW-accéléré) est nettement plus rapide que Skia sur mobile pour ce jeu.
// Les niveaux = tous les maps/map*.json dans l'ordre, via l'index généré levels.gen.ts
// (cf. maps/mapFiles.mjs). Injectés avant chargement du contenu → pas de rebuild du bundle web
// quand une map change.

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f6f4ee" }}>
      <WebView
        source={{ html: previewHtml }}
        originWhitelist={["*"]}
        injectedJavaScriptBeforeContentLoaded={`window.__TICTACTIC_LEVELS__ = ${JSON.stringify(LEVELS)}; true;`}
        style={{ flex: 1, backgroundColor: "#f6f4ee" }}
        androidLayerType="hardware"
        javaScriptEnabled
        // progression + options du joueur (localStorage)
        domStorageEnabled
        // le jeu redessine chaque frame ; pas de scroll/zoom/bounce
        scrollEnabled={false}
        overScrollMode="never"
        setBuiltInZoomControls={false}
      />
    </View>
  )
}
