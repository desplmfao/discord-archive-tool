import "dotenv/config";

import * as global from "./global/index"
import * as modules from "./modules/index"

export const authorization_token = process.env.AUTHORIZATION_TOKEN?.toString() || "";
export const user_agent = process.env.USER_AGENT?.toString() || "";


async function main(guild_id: number | string) {
    const guild_channels = await fetch(
		`${global.api_endpoint}/guilds/${guild_id}/channels?channel_limit=500`,
		{
			method: "GET",
			headers: {
				authorization: authorization_token,
                "user-agent": user_agent
			},
		},
	);

	await JSON.parse(await guild_channels.text()).forEach(async function (
		channel: string[],
		index: number,
	) {
		await global.sleep(250 * (index + 1));

		const stuff = (await modules.fetch_messages_from_channel_id(channel));

		if (process.env.GET_ATTACHMENTS) {
            await global.sleep(2048 * (index + 1));

			await modules.fetch_attachments_from_message(
				stuff?.parent_name,
				stuff?.parsed_messages || [],
				stuff?.channel || [],
			);
		}
	});
}

main(process.env.SERVER_ID?.toString() || "");
