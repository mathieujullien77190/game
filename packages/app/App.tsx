import { View } from "react-native"
import { WebView } from "react-native-webview"
import mapJson from "@drift/maps/map.json"
import { previewHtml } from "./src/previewHtml"

// Coquille RN : héberge une WebView qui fait tourner la preview de l'engine en canvas2d
// (cf. webview/main.ts, bundlé dans previewHtml). Le canvas2d dans le System WebView
// (Chromium, HW-accéléré) est nettement plus rapide que Skia sur mobile pour ce jeu.
// La map est injectée avant chargement du contenu → pas de rebuild du bundle web quand elle change.

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <WebView
        source={{ html: previewHtml }}
        originWhitelist={["*"]}
        injectedJavaScriptBeforeContentLoaded={`window.__DRIFT_MAP__ = ${JSON.stringify(mapJson)}; true;`}
        style={{ flex: 1, backgroundColor: "#f0f0f0" }}
        androidLayerType="hardware"
        javaScriptEnabled
        // le jeu redessine chaque frame ; pas de scroll/zoom/bounce
        scrollEnabled={false}
        overScrollMode="never"
        setBuiltInZoomControls={false}
      />
    </View>
  )
}
