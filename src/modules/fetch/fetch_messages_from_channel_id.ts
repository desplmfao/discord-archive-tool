import path from "node:path";

import { authorization_token, user_agent } from "../../index";

import * as global from "../../global/index"
import * as checks from "../index"

export default async (
	channel: string[]
) => {
	try {
		let parsed_messages: string[] = []

		const guild_channel_fetch = await fetch(
			`${global.api_endpoint}/channels/${channel["id"]}`,
			{
				method: "GET",
				headers: {
					authorization: authorization_token,
					"user-agent": user_agent
				},
			},
		);

		const parsed: string[] = JSON.parse(await guild_channel_fetch.text())!;

		const guild_channel_fetch_parent_name = await fetch(
			`${global.api_endpoint}/channels/${parsed["parent_id"]}`,
			{
				method: "GET",
				headers: {
					authorization: authorization_token,
					"user-agent": user_agent
				},
			},
		);

		const parent_name = JSON.parse(await guild_channel_fetch_parent_name.text())["name"]!

		await checks.category(parent_name, channel);
		await checks.channel_name(parent_name, channel);
		await checks.channel_name_and_id(parent_name, channel);

		if (parsed["parent_id"] !== null) {
			const guild_channel_fetch_messages = await fetch(
				`${global.api_endpoint}/channels/${channel["id"]}/messages?limit=100`,
				{
					method: "GET",
					headers: {
						authorization: authorization_token,
						"user-agent": user_agent
					},
				},
			);

			parsed_messages = JSON.parse(
				await guild_channel_fetch_messages.text(),
			);

			global.write_file(
				path.join(
					global.root,
					await global.sanitize(parent_name), "/",
					await global.sanitize(channel["name"]), "/",
					await global.sanitize(channel["id"]),
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