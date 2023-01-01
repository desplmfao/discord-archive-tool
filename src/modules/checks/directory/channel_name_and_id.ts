import fs from "node:fs/promises";
import path from "node:path";

import * as global from "../../../global/index";

export default async (
	parent_name: string,
    channel: string[],
) => {
    const sanitized_path = path.join(
        global.root,
        await global.sanitize(parent_name), "/",
		await global.sanitize(channel["name"]), "/",
		await global.sanitize(channel["id"])
    )

    if(!await global.fileExists(sanitized_path)) {
        await fs.mkdir(sanitized_path);
    }
}