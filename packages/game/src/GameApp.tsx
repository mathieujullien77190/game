import { useState } from "react"
import { useProgressStore } from "progressStore"
import { getNextMap } from "maps"
import { useDevStore } from "devStore"
import DebugOverlay from "components/DebugOverlay"
import Accueil from "screens/Accueil"
import Menu from "screens/Menu"
import Cartes from "screens/Cartes"
import Jeu from "screens/Jeu"
import Victoire from "screens/Victoire"
import HautsFaits from "screens/HautsFaits"
import Options from "screens/Options"
import APropos from "screens/APropos"

type Screen =
  | { id: "accueil" }
  | { id: "menu" }
  | { id: "cartes" }
  | { id: "jeu"; mapId: string }
  | { id: "victoire"; mapId: string; time: number; stars: number; noCollision: boolean }
  | { id: "hauts-faits" }
  | { id: "options" }
  | { id: "a-propos" }

const renderScreen = (
  screen: Screen,
  goAccueil: () => void,
  goCartes: () => void,
  goMenu: () => void,
  goJeu: (mapId: string) => void,
  setScreen: (s: Screen) => void,
  lastPlayedMapId: string | null,
) => {
  const s = screen

  if (s.id === "accueil")
    return (
      <Accueil
        onJouer={() => (lastPlayedMapId ? goJeu(lastPlayedMapId) : goCartes())}
        onMenu={goMenu}
      />
    )

  if (s.id === "menu")
    return (
      <Menu
        onBack={goAccueil}
        onCartes={goCartes}
        onHautsFaits={() => setScreen({ id: "hauts-faits" })}
        onOptions={() => setScreen({ id: "options" })}
        onAPropos={() => setScreen({ id: "a-propos" })}
      />
    )

  if (s.id === "cartes") return <Cartes onBack={goAccueil} onSelect={goJeu} />

  if (s.id === "jeu")
    return (
      <Jeu
        mapId={s.mapId}
        onBack={goCartes}
        onWin={(time, stars, noCollision) =>
          setScreen({ id: "victoire", mapId: s.mapId, time, stars, noCollision })
        }
      />
    )

  if (s.id === "victoire")
    return (
      <Victoire
        mapId={s.mapId}
        time={s.time}
        stars={s.stars}
        noCollision={s.noCollision}
        onRejouer={() => goJeu(s.mapId)}
        onSuivant={() => {
          const next = getNextMap(s.mapId)
          if (next) goJeu(next.id)
          else goCartes()
        }}
        onCartes={goCartes}
      />
    )

  if (s.id === "hauts-faits") return <HautsFaits onBack={goMenu} />

  if (s.id === "options") return <Options onBack={goMenu} />

  if (s.id === "a-propos") return <APropos onBack={goMenu} />

  return null
}

export const GameApp = () => {
  const [screen, setScreen] = useState<Screen>({ id: "accueil" })
  const lastPlayedMapId = useProgressStore((s) => s.lastPlayedMapId)
  const devMode = useDevStore((s) => s.devMode)

  const goAccueil = () => setScreen({ id: "accueil" })
  const goCartes = () => setScreen({ id: "cartes" })
  const goMenu = () => setScreen({ id: "menu" })
  const goJeu = (mapId: string) => setScreen({ id: "jeu", mapId })

  return (
    <>
      {renderScreen(screen, goAccueil, goCartes, goMenu, goJeu, setScreen, lastPlayedMapId)}
      {devMode && <DebugOverlay />}
    </>
  )
}
