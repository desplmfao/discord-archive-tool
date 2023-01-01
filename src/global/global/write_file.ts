import fs from "node:fs/promises";

export default async (path: string, input: any) => {
    await fs.writeFile(path, input);
}