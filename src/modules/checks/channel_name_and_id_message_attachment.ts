import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";

import { sanitize } from "../../global/sanitize";

export default async (
	parent_name: string,
	message: string[],
	attachment: { 
        id: string; 
        name: string 
        root_id: string;
        root_name: string;
    },
) => {
	try {
		if (
			!fssync.existsSync(
				path.join(
					process.cwd() + "/data/channels/",
					await sanitize(parent_name),
					"/",
					await sanitize(attachment["root_name"]),
					"/",
					await sanitize(attachment["root_id"]),
					"/",
					"attachments",
				),
			)
		) {
			fs.mkdir(
				path.join(
					process.cwd() + "/data/channels/",
					await sanitize(parent_name),
					"/",
					await sanitize(attachment["root_name"]),
					"/",
					await sanitize(attachment["root_id"]),
					"/",
					"attachments",
				),
			);
		}
	}
	catch (err) {
		console.log(err)
	}
};
