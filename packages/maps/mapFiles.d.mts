// Types de mapFiles.mjs (importé par les vite.config.ts de edition et app/webview).
export declare const MAPS_DIR: string
export declare const MAP_NAME_RE: RegExp
export declare const INDEX_FILE: string
export declare const isMapFile: (file: string) => boolean
export declare const listMapFiles: (dir?: string) => string[]
export declare const writeLevelsIndex: (dir?: string) => boolean
