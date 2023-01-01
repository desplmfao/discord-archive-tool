import path from "node:path";

import { authorization_token, user_agent } from "../../index";

import * as global from "../../global/index";
import * as checks from "../index";

export default async (
	parent_name: string,
	messages: string[],
	channel: string[],
) => {
	messages.forEach(async (message: any, index: number) => {
		await global.sleep(10000 * (index + 1));

		let names: object[] = [];

		const fetch_url = async (message_attachments_array: string[]) => {
			console.log(message_attachments_array["filename"])
			let url: string = ""

			if (message_attachments_array["size"] >= 8000000) {
				url = message_attachments_array["url"]
			}

			if (message_attachments_array["size"] <= 8000000) {
				url = message_attachments_array["proxy_url"]
			}

			return url
		}

		let messaged = message;
		let id = message["id"] || "";
		let url = await fetch_url(JSON.parse(JSON.stringify(message["attachments"]))[0])
		let array_url = url.toString().split("/");
		let name = array_url.toString().split(/[, ]+/).pop()?.toString() || "";

		names.push({
			channel: channel,
			messaged: message,
			id: id,
			url: url,
			array_url: array_url,
			name: name,
		});

		let done: string[] = [];

		await checks.channel_name_and_id_message_attachment_id(
			parent_name,
			messaged,
			{
				id: id,
				name: name,
				root_id: await channel["id"],
				root_name: await channel["name"],
			},
		);

		async function bruh(data: any) {	
			const arrayBuffer = (await (await fetch(await data.url, {
				method: "GET",
				headers: {
					authorization: authorization_token,
					"user-agent": user_agent
				},
			})).arrayBuffer());

			const buffer = Buffer.from(arrayBuffer);

			await global.write_file(
				path.join(
					global.root,
					await global.sanitize(parent_name), "/",
					await global.sanitize(await data.channel["name"]), "/",
					await global.sanitize(await data.channel["id"]), "/",
					"attachments", "/",
					await global.sanitize(data.id), "/",
					await global.sanitize(data.name),
				),
				buffer,
			);
		}

		await JSON.parse(JSON.stringify(names).toString()).forEach(
			async function (data: any, index: number) {
				console.log(data.url)
				done.push(await data.id);
				console.log(done);

				if (!(done.indexOf(await data.url) > -1)) {
					await bruh(await data);
				}
			},
		);
	});
	await checks.channel_name_and_id_message_attachment(parent_name, {
		root_id: await channel["id"],
		root_name: await channel["name"],
	});
};
