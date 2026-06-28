let helpCounter = 1

export const syncHelpCounter = (ids: string[]) => {
  const nums = ids.map((id) => parseInt(id.replace("h", ""), 10)).filter((n) => !isNaN(n))
  if (nums.length > 0) helpCounter = Math.max(...nums) + 1
}

export type HelpArrow = "none" | "left" | "right" | "top" | "bottom"

export class Help {
  id: string
  x: number
  y: number
  text: string
  arrow: HelpArrow
  screenId: string

  constructor(x: number, y: number, text = "", arrow: HelpArrow = "none", screenId = "main", id?: string) {
    this.id = id ?? `h${helpCounter++}`
    this.x = x
    this.y = y
    this.text = text
    this.arrow = arrow
    this.screenId = screenId
  }
}
