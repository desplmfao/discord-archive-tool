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
		await global.sleep(2500 * (index + 1));

		let names: object[] = [];

		const fetch_url = async (message_attachments_array: string[]) => {
			const bruh = message_attachments_array || { size: 0, proxy_url: undefined, url: undefined };

			const asize = bruh["size"]
			const apurl = bruh["proxy_url"]
			const anurl = bruh["url"]

			console.log(bruh)
			
			let url: string = ""

			if (asize >= 8000000) {
				url = anurl
			}

			if (asize <= 8000000) {
				url = apurl
			}

			return url
		}
		let url = await fetch_url(JSON.parse(JSON.stringify(message["attachments"]))[0])
		
		if (!url) {
			return
		}

		let messaged = message;
		let id = message["id"] || "";
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

		await JSON.parse(JSON.stringify(names).toString()).forEach(
			async function (data: any, index: number) {
				const url_test = data.url.replace("https://", "http://");

				console.log(url_test)
				done.push(await data.id);
				console.log(done);

				if (!(done.indexOf(await url_test.url) > -1)) {
					const arrayBuffer = (await (await fetch(await url_test, {
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
			},
		);
	});

	await checks.channel_name_and_id_message_attachment(parent_name, {
		root_id: await channel["id"],
		root_name: await channel["name"],
	});
};
