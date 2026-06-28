export const BASE_SEC_SPEED = 6
export const SPEED_MULTIPLIERS = [10, 200, 25, 150, 50, 300]
export const PHASE_DURATION = 30

export const LOGO_DEFAULT_SIZE = 30
export const LOGO_VIEW = 200
export const LOGO_CX = 100
export const LOGO_CY = 100

// drawn angle of each hand tip from 12 o'clock (clockwise °)
export const DRAWN_HOUR = Math.atan2(130 - LOGO_CX, -(67 - LOGO_CY)) * (180 / Math.PI)
export const DRAWN_MIN = 0
export const DRAWN_SEC = Math.atan2(55 - LOGO_CX, -(148 - LOGO_CY)) * (180 / Math.PI)
