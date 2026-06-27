import { CANVAS_W, CANVAS_H, GRID_MINOR, GRID_MAJOR } from "engine/constants"

export const SvgGrid = () => (
  <>
    <defs>
      <pattern id="ed-minor" width={GRID_MINOR} height={GRID_MINOR} patternUnits="userSpaceOnUse">
        <path d={`M${GRID_MINOR},0L0,0L0,${GRID_MINOR}`} fill="none" stroke="#f0f0f0" strokeWidth={1}/>
      </pattern>
      <pattern id="ed-major" width={GRID_MAJOR} height={GRID_MAJOR} patternUnits="userSpaceOnUse">
        <path d={`M${GRID_MAJOR},0L0,0L0,${GRID_MAJOR}`} fill="none" stroke="#e0e0e0" strokeWidth={1}/>
      </pattern>
    </defs>
    <rect width={CANVAS_W} height={CANVAS_H} fill="url(#ed-minor)"/>
    <rect width={CANVAS_W} height={CANVAS_H} fill="url(#ed-major)"/>
  </>
)
