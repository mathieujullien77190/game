import { Line } from "../Line/Line"

export class Manager<T extends Line = Line> {
  data: { lines: Record<string, T> } = { lines: {} as Record<string, T> }

  addLine = (line: T) => {
    this.data.lines[line.id] = line
  }

  removeLine = (id: string) => {
    delete this.data.lines[id]
  }
}
