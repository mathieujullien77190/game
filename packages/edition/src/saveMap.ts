// Envoie la map au serveur dev (plugin drift-save-map) qui réécrit
// packages/maps/map.json. Auto, aucun geste utilisateur (dev only).
export const saveMap = (json: unknown): void => {
  void fetch("/__save-map", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json, null, 2),
  }).catch(() => {})
}
