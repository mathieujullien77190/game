import type { Demand } from "../entities/Arrival/Arrival"

// Événements émis par la simulation (PreviewManager.tickSim / TokenPreview.transition) et
// consommés par le frontend (HUD, journal, détection victoire/échec) via `drainEvents()`.
// L'engine ne fait que les empiler : c'est au frontend de décider ce qui est une victoire.
export type SimEvent =
  | {
      type: "arrival"
      t: number
      arrivalId: string
      ok: boolean
      tokenColor: string
      tokenType: string
      // Demande attendue au moment de l'arrivée (undefined si l'arrivée était déjà complète).
      expected?: Demand
    }
  | { type: "collision"; t: number; colors: [string, string] }
