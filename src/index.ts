import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";

import "dotenv/config";

const authorization_token = process.env.AUTHORIZATION_TOKEN?.toString() || "";

if (
	!fssync.existsSync(path.join(process.cwd() + "/data/channels/"))
) {
	fs.mkdir(path.join(process.cwd() + "/data/channels/"));
}

async function main(guild_id: number | string) {
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

	async function fetch_guild_channels(channel: string[]) {
		try {
			const guild_channel_fetch = await fetch(
				`https://discord.com/api/v9/channels/${channel["id"]}`, // /messages?limit=100
				{
					method: "GET",
					headers: {
						authorization: authorization_token,
					},
				},
			);

			const parsed: string[] = JSON.parse(
				await guild_channel_fetch.text(),
			);

			const guild_channel_fetch_parent_name = await fetch(
				`https://discord.com/api/v9/channels/${parsed["parent_id"]}`,
				{
					method: "GET",
					headers: {
						authorization: authorization_token,
					},
				},
			);
                
			const parent_name = JSON.parse(
				await guild_channel_fetch_parent_name.text(),
			)["name"] || "";

			const parent_name_replaced = parent_name
				.replace("\\", "")
				.replace("/", "");

			console.log(parent_name_replaced);

			if (
				parent_name !== undefined &&
				!fssync.existsSync(
					path.join(
						process.cwd() +
							"/data/channels/" +
							parent_name_replaced,
					),
				)
			) {
				fs.mkdir(
					path.join(
						process.cwd() +
							"/data/channels/" +
							parent_name_replaced,
					),
				);
			}

			if (parsed["parent_id"] !== null) {
				const guild_channel_fetch_messages = await fetch(
					`https://discord.com/api/v9/channels/${channel["id"]}/messages?limit=100`,
					{
						method: "GET",
						headers: {
							authorization: authorization_token,
						},
					},
				);
				const parsed_messages = JSON.parse(
					await guild_channel_fetch_messages.text(),
				);
				console.log(parsed_messages);
				await fs.writeFile(
					path.join(
						process.cwd() +
							"/data/channels/" +
							parent_name_replaced +
							"/" +
							channel["name"] +
							".json",
					),
					JSON.stringify(parsed_messages, null, 4),
				);
			}
		} catch (error) {
			console.error(error);
		}
	}

	//console.log(JSON.stringify(await (guild_channels).json(), null, 4))

	await JSON.parse(await guild_channels.text()).forEach(async function (
		channel: string[],
		index: number,
	) {
		await sleep(250 * (index + 1));
		await fetch_guild_channels(channel);
	});
}

main(process.env.SERVER_ID?.toString() || "");
