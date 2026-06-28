export type Props = {
  mapId: string
  onBack: () => void
  onWin: (time: number, stars: number, noCollision: boolean) => void
}
