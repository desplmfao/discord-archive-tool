import fs from "node:fs/promises";
import fssync from "node:fs";

export default async (path: fssync.PathLike | fs.FileHandle, input: any) => {
    await fs.writeFile(path, input);
}