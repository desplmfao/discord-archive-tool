import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";

import { authorization_token } from "../index";
import { fetch_attachments_from_message } from "./fetch_attachments_from_message";

import { sanitize } from "../global/sanitize"

import write_file from "../global/write_file"
import check_category from "./checks/category"
import check_channel_name from "./checks/channel_name"
import check_channel_name_and_id from "./checks/channel_name_and_id"

export async function fetch_messages_from_channel_id(channel: string[]) {
	try {
		if (!fssync.existsSync(path.join(process.cwd() + "/data/channels/"))) {
			fs.mkdir(path.join(process.cwd() + "/data/channels/"));
		}

		let parsed_messages: string[] = []

		const guild_channel_fetch = await fetch(
			`https://discord.com/api/v9/channels/${channel["id"]}`, // /messages?limit=100
			{
				method: "GET",
				headers: {
					authorization: authorization_token,
				},
			},
		);

		const parsed: string[] = JSON.parse(await guild_channel_fetch.text());

		const guild_channel_fetch_parent_name = await fetch(
			`https://discord.com/api/v9/channels/${parsed["parent_id"]}`,
			{
				method: "GET",
				headers: {
					authorization: authorization_token,
				},
			},
		);

		const parent_name =
			JSON.parse(await guild_channel_fetch_parent_name.text())["name"] ||
			"";

		await check_category(parent_name, channel);
		await check_channel_name(parent_name, channel);
		await check_channel_name_and_id(parent_name, channel);

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

			parsed_messages = JSON.parse(
				await guild_channel_fetch_messages.text(),
			);

			write_file(
				path.join(
					process.cwd() + "/data/channels/",
					await sanitize(parent_name),
					"/",
					await sanitize(channel["name"]),
					"/",
					await sanitize(channel["id"]),
					"messages.json",
				),
				JSON.stringify(parsed_messages, null, 4),
			);
		}
		
		return {
			parent_name: parent_name, 
			parsed_messages: parsed_messages, 
			channel: channel	
		}
	} catch (error) {
		console.error(error);
	}
}