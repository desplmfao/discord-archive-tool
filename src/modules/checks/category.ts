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
                    await sanitize(parent_name)
            ),
        )
    ) {
        fs.mkdir(
            path.join(
                process.cwd() +
                    "/data/channels/",
                    await sanitize(parent_name)
            ),
        );
    }
}