import "dotenv/config";

import { fetch_messages_from_channel_id } from "./modules/fetch_messages_from_channel_id";
import { fetch_attachments_from_message } from "./modules/fetch_attachments_from_message";

export const authorization_token =
	process.env.AUTHORIZATION_TOKEN?.toString() || "";

async function main(guild_id: number | string) {
	let done: any[] = [];

	const guild_channels = await fetch(
		`https://discord.com/api/v9/guilds/${guild_id}/channels?channel_limit=500`,
		{
			method: "GET",
			headers: {
				authorization: authorization_token,
			},
		},
	);

	function sleep(ms: number | undefined) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	await JSON.parse(await guild_channels.text()).forEach(async function (
		channel: string[],
		index: number,
	) {
		await sleep(250 * (index + 1));

		const stuff = (await fetch_messages_from_channel_id(channel)) || {
			parent_name: "",
			parsed_messages: [],
			channel,
		};

		await sleep(250 * (index + 1));

		if (process.env.GET_ATTACHMENTS && !null) {
			done.push(channel);
			await fetch_attachments_from_message(
				stuff?.parent_name,
				stuff?.parsed_messages,
				stuff?.channel,
			);
		}
	});
}

main(process.env.SERVER_ID?.toString() || "");
