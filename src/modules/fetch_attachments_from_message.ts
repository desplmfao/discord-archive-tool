import path from "node:path";

import { sanitize } from "../global/sanitize";
import { authorization_token } from "../index";

import write_file from "../global/write_file";
import message_attachment from "./checks/channel_name_and_id_message_attachment";
import message_attachment_id from "./checks/channel_name_and_id_message_attachment_id";

export async function fetch_attachments_from_message(
	parent_name: string,
	messages: string[],
	channel: string[],
) {
	let id: string = "";
	let url: string = "";
	let array_url: string[] = [];
	let name: string = "";
	let messaged: string[] = [];
    let names: object[] = []

	console.log(
		messages.forEach(async (message: any) => {
			messaged = message;
			id = message["id"] || "";
			url = JSON.parse(JSON.stringify(message["attachments"]))[0][
				"proxy_url"
			].toString();
			array_url = url
				.toString()
				//.replace("https://media.discordapp.com/attachments/", "")
				.split("/");
			name = array_url.toString().split(/[, ]+/).pop()?.toString() || "";

            names.push({
                channel: channel,
                messaged: message,
                id: id,
                url: url,
                array_url: array_url,
                name: name,
            })

			await message_attachment_id(parent_name, messaged, {
				id: id,
				name: name,
				root_id: await channel["id"],
				root_name: await channel["name"],
			});

            JSON.parse(JSON.stringify(await names).toString()).forEach(async (
                data: any,
            ) => {
                const response = await fetch(data.url, {
                    method: "GET",
                    headers: {
                        authorization: authorization_token,
                    },
                });
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                await write_file(
                    path.join(
                        process.cwd() + "/data/channels/",
                        await sanitize(parent_name),
                        "/",
                        await sanitize(await data.channel["name"]),
                        "/",
                        await sanitize(await data.channel["id"]),
                        "/",
                        "attachments",
                        "/",
                        await sanitize(data.id),
                        "/",
                        await sanitize(data.name),
                    ),
                    buffer,
                );
            });
		}),
	);

	await message_attachment(parent_name, messaged, {
		id: id,
		name: name,
		root_id: await channel["id"],
		root_name: await channel["name"],
	});
}
