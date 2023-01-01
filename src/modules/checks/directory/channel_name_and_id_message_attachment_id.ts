import fs from "node:fs/promises";
import path from "node:path";

import * as global from "../../../global/index";

export default async (
	parent_name: string,
	message: string[],
	attachment: { 
        id: string; 
        name: string;
        root_id: string;
        root_name: string;
	}
) => {
    const sanitized_path = path.join(
        global.root,
        await global.sanitize(parent_name), "/",
		await global.sanitize(attachment["root_name"]), "/",
		await global.sanitize(attachment["root_id"]), "/",
		"attachments", "/",
		await global.sanitize(attachment["id"]),
    )

    if(!await global.fileExists(sanitized_path)) {
        await fs.mkdir(sanitized_path);
    }
}
