import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";

import { sanitize } from "../../global/sanitize";

export default async (parent_name: string | undefined, channel: string[]) => {
    if (
        parent_name !== undefined &&
        !fssync.existsSync(
            path.join(
                process.cwd() +
                    "/data/channels/",
                    await sanitize(parent_name),
                    "/",
                    await sanitize(channel["name"]),
                    "/",
                    await sanitize(channel["id"]),
            ),
        )
    ) {
        fs.mkdir(
            path.join(
                process.cwd() +
                    "/data/channels/",
                    await sanitize(parent_name),
                    "/",
                    await sanitize(channel["name"]),
                    "/",
                    await sanitize(channel["id"]),
            ),
        );
    }
}