import path from "node:path";

import { authorization_token } from "../../index";

import * as global from "../../global/index"
import * as checks from "../index"

export default async (
	parent_name: string,
	messages: string[],
	channel: string[],
) => {
	let id: string = "";
	let url: string = "";
	let array_url: string[] = [];
	let name: string = "";
	let messaged: string[] = [];
	let names: object[] = [];

    console.log(
		messages.forEach(async (message: any) => {
			messaged = message;
			id = message["id"] || "";
			url = JSON.parse(JSON.stringify(message["attachments"]))[0]["url"].toString();
			array_url = url.toString().split("/");
			name = array_url.toString().split(/[, ]+/).pop()?.toString() || "";

			names.push({
				channel: channel,
				messaged: message,
				id: id,
				url: url,
				array_url: array_url,
				name: name,
			});

			let done: string[] = [];

			await checks.channel_name_and_id_message_attachment_id(parent_name, messaged, {
				id: id,
				name: name,
				root_id: await channel["id"],
				root_name: await channel["name"],
			});

			function sleep(ms: number | undefined) {
				return new Promise((resolve) => setTimeout(resolve, ms));
			}

			async function bruh(data: any) {
				const response = await fetch(await data.url, {
					method: "GET",
					headers: {
						authorization: authorization_token,
					},
				});

				const arrayBuffer = await response.arrayBuffer();
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
                    done.push(await data.id)
                    console.log(done)

					if (!(done.indexOf(await data.url) > -1)) {
						await sleep(1000 * (index + 1));
						await bruh(await data);
					}
				},
			);
		}),
	);

	await checks.channel_name_and_id_message_attachment(parent_name, {
		root_id: await channel["id"],
		root_name: await channel["name"],
	});
}
