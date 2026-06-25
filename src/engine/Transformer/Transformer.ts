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

export type TransformerMode = "color" | "shape"

export class Transformer {
  id: string
  linkId: string
  mode: TransformerMode
  color: string
  targetType: string
  constructor(linkId: string, mode: TransformerMode = "shape", color: string = "#e53935", targetType: string = "square", id?: string) {
    this.id = id ?? generateTransformerId()
    this.linkId = linkId
    this.mode = mode
    this.color = color
    this.targetType = targetType
  }
}
