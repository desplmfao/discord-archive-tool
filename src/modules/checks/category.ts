import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";

import { sanitize } from "../../global/sanitize";

export default async (parent_name: string, channel: string[]) => {
    if (
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


