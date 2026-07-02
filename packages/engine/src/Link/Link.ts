export type LinkEndpoint = { lineId: string; endpoint: "start" | "end" }

const makeLinkId = (line1: LinkEndpoint, line2: LinkEndpoint) =>
  `${line1.lineId}::${line1.endpoint}-${line2.lineId}::${line2.endpoint}`

export class Link {
  id: string
  line1: LinkEndpoint
  line2: LinkEndpoint
  activated: boolean

  constructor(line1: LinkEndpoint, line2: LinkEndpoint) {
    this.id = makeLinkId(line1, line2)
    this.line1 = line1
    this.line2 = line2
    this.activated = true
  }
}
