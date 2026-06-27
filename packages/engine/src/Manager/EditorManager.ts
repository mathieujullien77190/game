import type { Point } from "../types"
import { LineEditor } from "../Line/LineEditor"
import { Link } from "../Link/Link"
import { Manager } from "./Manager"

const pointsEqual = (a: Point, b: Point) => a.x === b.x && a.y === b.y

export class EditorManager extends Manager<LineEditor> {
  data = {
    lines: {} as Record<string, LineEditor>,
    links: {} as Record<string, Link>,
  }

  addLine = (line: LineEditor) => {
    for (const existing of Object.values(this.data.lines)) {
      if (existing.screenId !== line.screenId) continue
      for (const ep1 of ["start", "end"] as const) {
        for (const ep2 of ["start", "end"] as const) {
          if (pointsEqual(existing[ep1], line[ep2])) {
            const link = new Link(
              { lineId: existing.id, endpoint: ep1 },
              { lineId: line.id, endpoint: ep2 }
            )
            this.data.links[link.id] = link
          }
        }
      }
    }
    this.data.lines[line.id] = line
  }

  removeLine = (id: string) => {
    delete this.data.lines[id]
    for (const linkId of Object.keys(this.data.links)) {
      const link = this.data.links[linkId]
      if (link.line1.lineId === id || link.line2.lineId === id) {
        delete this.data.links[linkId]
      }
    }
  }

  refreshLinksForEndpoint = (lineId: string, endpoint: "start" | "end") => {
    for (const linkId of Object.keys(this.data.links)) {
      const link = this.data.links[linkId]
      if (
        (link.line1.lineId === lineId && link.line1.endpoint === endpoint) ||
        (link.line2.lineId === lineId && link.line2.endpoint === endpoint)
      ) {
        delete this.data.links[linkId]
      }
    }
    const movedLine = this.data.lines[lineId]
    if (!movedLine) return
    const movedPoint = movedLine[endpoint]
    for (const other of Object.values(this.data.lines)) {
      if (other.id === lineId) continue
      if (other.screenId !== movedLine.screenId) continue
      for (const ep of ["start", "end"] as const) {
        if (pointsEqual(movedPoint, other[ep])) {
          const link = new Link(
            { lineId, endpoint },
            { lineId: other.id, endpoint: ep }
          )
          this.data.links[link.id] = link
        }
      }
    }
  }
}
