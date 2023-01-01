import fs from "node:fs/promises"

import sanitize from "./global/sanitize"
import write_file from "./global/write_file"

export { sanitize }
export { write_file }

export const root = process.cwd() + "/data/channels/"
export const api_endpoint = "https://discord.com/api/v9"

export function sleep(ms: number | undefined | null) {
    return new Promise((resolve) => setTimeout(resolve, ms || 250));
}

export const fileExists = async (path: string) => !!(await fs.stat(path).catch(e => false));
