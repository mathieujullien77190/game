import { createIdCounter } from "../idCounter"

const transformerIds = createIdCounter("transform")

export const syncTransformerCounter = (ids: string[]) => transformerIds.sync(ids)

export type TransformerType = "fade" | "rotate" | "color" | "shape"

export class Transformer {
  id: string
  linkId: string
  type: TransformerType
  amount: number
  color: string
  targetType: string
  screenId: string = "main"
  constructor(linkId: string, type: TransformerType = "color", id?: string, amount = 0.5, color = "#e53935", targetType = "square", screenId?: string) {
    this.id = id ?? transformerIds.next()
    this.linkId = linkId
    this.type = type
    this.amount = amount
    this.color = color
    this.targetType = targetType
    if (screenId) this.screenId = screenId
  }
}
