// Envoie la map au serveur dev (plugin tic-tac-tic-save-map) qui réécrit
// packages/maps/<name>. Auto, aucun geste utilisateur (dev only).
export const saveMap = (name: string, json: unknown): void => {
  void fetch(`/__save-map?name=${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json, null, 2),
  }).catch(() => {})
}
