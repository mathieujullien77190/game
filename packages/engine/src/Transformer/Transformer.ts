import { COLOR_TOKEN_RED } from "../constants"

let transformerCounter = 0

export const syncTransformerCounter = (ids: string[]) => {
  let max = 0
  for (const id of ids) {
    const m = id.match(/^transform(\d+)$/)
    if (m) max = Math.max(max, parseInt(m[1]))
  }
  transformerCounter = max
}

const generateTransformerId = () => `transform${++transformerCounter}`

export type TransformerType = "fade" | "rotate" | "color" | "shape"

export class Transformer {
  id: string
  linkId: string
  type: TransformerType
  amount: number
  color: string
  targetType: string
  screenId: string = "main"
  constructor(linkId: string, type: TransformerType = "color", id?: string, amount = 0.5, color: string = COLOR_TOKEN_RED, targetType = "square", screenId?: string) {
    this.id = id ?? generateTransformerId()
    this.linkId = linkId
    this.type = type
    this.amount = amount
    this.color = color
    this.targetType = targetType
    if (screenId) this.screenId = screenId
  }
}
